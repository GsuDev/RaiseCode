#!/usr/bin/env bash
# ==============================================================================
# test_worker.sh — Batería de pruebas para el Worker de RaiseCode
# ==============================================================================
#
# USO:
#   chmod +x test_worker.sh
#   ./test_worker.sh                        # usa localhost:4000 por defecto
#   ./test_worker.sh -u http://localhost:4000
#   ./test_worker.sh -u http://localhost:4000 -v   # verbose (muestra JSON completo)
#   ./test_worker.sh -t health              # solo health check
#   ./test_worker.sh -t js                  # solo tests de JavaScript
#   ./test_worker.sh -t python              # solo tests de Python
#   ./test_worker.sh -t queue               # solo test de cola Redis
#
# REQUISITOS:
#   curl, jq  (ambos disponibles en el contenedor y en la mayoría de sistemas)
# ==============================================================================

set -euo pipefail

# ─────────────────────────── Configuración ────────────────────────────────────
WORKER_URL="${WORKER_URL:-http://localhost:4000}"
VERBOSE=false
FILTER=""          # vacío = todos los grupos

# Colores
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

# Contadores globales
PASS=0; FAIL=0; SKIP=0

# ─────────────────────────── Args ─────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    -u|--url)  WORKER_URL="$2"; shift 2 ;;
    -v|--verbose) VERBOSE=true; shift ;;
    -t|--test) FILTER="$2"; shift 2 ;;
    -h|--help)
      sed -n '2,20p' "$0" | sed 's/^# //'
      exit 0
      ;;
    *) echo "Opción desconocida: $1"; exit 1 ;;
  esac
done

# ─────────────────────────── Helpers ──────────────────────────────────────────
header() {
  echo -e "\n${BOLD}${CYAN}══════════════════════════════════════════════${NC}"
  echo -e "${BOLD}${CYAN}  $1${NC}"
  echo -e "${BOLD}${CYAN}══════════════════════════════════════════════${NC}"
}

section() {
  echo -e "\n${BOLD}▶ $1${NC}"
}

ok()   { echo -e "  ${GREEN}✓${NC}  $1"; ((PASS++)) || true; }
fail() { echo -e "  ${RED}✗${NC}  $1"; ((FAIL++)) || true; }
skip() { echo -e "  ${YELLOW}−${NC}  $1 (omitido)"; ((SKIP++)) || true; }
info() { echo -e "  ${YELLOW}ℹ${NC}  $1"; }

# Comprueba si jq está disponible
check_deps() {
  local missing=()
  command -v curl &>/dev/null || missing+=(curl)
  command -v jq   &>/dev/null || missing+=(jq)
  if [[ ${#missing[@]} -gt 0 ]]; then
    echo -e "${RED}Error: faltan dependencias: ${missing[*]}${NC}"
    echo "  Instala con: apt-get install -y curl jq"
    exit 1
  fi
}

# Llamada POST /execute y devuelve el JSON de respuesta
#   call_execute <label> <json_body>
call_execute() {
  local label="$1"
  local body="$2"

  local response http_code
  response=$(curl -s -w "\n%{http_code}" \
    -X POST "${WORKER_URL}/execute" \
    -H "Content-Type: application/json" \
    -d "$body" \
    --max-time 30 2>/dev/null) || { fail "$label — curl falló (¿worker levantado?)"; return 1; }

  http_code=$(echo "$response" | tail -n1)
  local json
  json=$(echo "$response" | sed '$d')

  if $VERBOSE; then
    echo "    $(echo "$json" | jq -C '.' 2>/dev/null || echo "$json")"
  fi

  echo "$json"     # para capturar con $()
  export LAST_HTTP_CODE="$http_code"
  export LAST_JSON="$json"
}

# Extrae campo de $LAST_JSON
field() { echo "$LAST_JSON" | jq -r "$1" 2>/dev/null; }

# Assert: comprueba que el campo del último resultado es igual al valor esperado
assert_field() {
  local label="$1" jq_expr="$2" expected="$3"
  local actual
  actual=$(field "$jq_expr")
  if [[ "$actual" == "$expected" ]]; then
    ok "$label  →  $jq_expr = \"$expected\""
  else
    fail "$label  →  $jq_expr esperado=\"$expected\" obtenido=\"$actual\""
  fi
}

# Comprueba que el worker responde antes de ejecutar tests
wait_for_worker() {
  local max=10 i=0
  echo -ne "  Esperando al worker"
  while [[ $i -lt $max ]]; do
    if curl -sf "${WORKER_URL}/health" &>/dev/null; then
      echo -e " ${GREEN}listo${NC}"
      return 0
    fi
    echo -n "."
    sleep 1
    ((i++)) || true
  done
  echo -e " ${RED}no responde${NC}"
  return 1
}

# ─────────────────────────── Grupos de tests ──────────────────────────────────

run_if() {
  # run_if <filtro_aplicable> <función>
  local group="$1"; shift
  if [[ -z "$FILTER" || "$FILTER" == "$group" ]]; then
    "$@"
  fi
}

# ── 1. Health ──────────────────────────────────────────────────────────────────
test_health() {
  header "1. HEALTH CHECK"

  local response http_code
  response=$(curl -s -w "\n%{http_code}" "${WORKER_URL}/health" --max-time 5 2>/dev/null) \
    || { fail "GET /health — curl falló"; return; }

  http_code=$(echo "$response" | tail -n1)
  LAST_JSON=$(echo "$response" | sed '$d')

  if $VERBOSE; then
    echo "    $(echo "$LAST_JSON" | jq -C '.')"
  fi

  if [[ "$http_code" == "200" ]]; then
    ok "HTTP 200"
  else
    fail "HTTP $http_code (esperado 200)"
  fi

  assert_field "status=ok"     '.status'  "ok"
  assert_field "docker=true"   '.docker'  "true"
  assert_field "redis=true"    '.redis'   "true"
}

# ── 2. JavaScript ──────────────────────────────────────────────────────────────
test_javascript() {
  header "2. JAVASCRIPT (Node.js)"

  # 2.1 FizzBuzz — caso básico
  section "FizzBuzz solution(5)"
  local body
  body=$(jq -n '{
    language: "javascript",
    code: "function solution(n){const r=[];for(let i=1;i<=n;i++){if(i%15===0)r.push(\"FizzBuzz\");else if(i%3===0)r.push(\"Fizz\");else if(i%5===0)r.push(\"Buzz\");else r.push(String(i));}return r;}console.log(JSON.stringify(solution(5)));",
    test_cases: [{ expected_output: "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]" }]
  }')
  call_execute "FizzBuzz js" "$body" >/dev/null
  assert_field "status=accepted"    '.status'       "accepted"
  assert_field "score=100"          '.score'        "100"
  assert_field "tests_passed=1"     '.tests_passed' "1"

  # 2.2 Wrong answer
  section "Respuesta incorrecta"
  body=$(jq -n '{
    language: "javascript",
    code: "console.log(\"wrong\");",
    test_cases: [{ expected_output: "correct" }]
  }')
  call_execute "Wrong answer js" "$body" >/dev/null
  assert_field "status=wrong_answer" '.status' "wrong_answer"
  assert_field "score=0"             '.score'  "0"

  # 2.3 Runtime error (syntax error)
  section "Error de sintaxis"
  body=$(jq -n '{
    language: "javascript",
    code: "this is not valid javascript !!!",
    test_cases: [{ expected_output: "" }]
  }')
  call_execute "Syntax error js" "$body" >/dev/null
  assert_field "status=runtime_error" '.status' "runtime_error"

  # 2.4 Suma de array
  section "Suma de array [1,2,3,4,5] = 15"
  body=$(jq -n '{
    language: "javascript",
    code: "const arr=[1,2,3,4,5];console.log(arr.reduce((a,b)=>a+b,0));",
    test_cases: [{ expected_output: "15" }]
  }')
  call_execute "Sum array js" "$body" >/dev/null
  assert_field "status=accepted"  '.status'       "accepted"
  assert_field "score=100"        '.score'        "100"

  # 2.5 Múltiples tests — FizzBuzz con varios inputs
  section "Múltiples tests (3 cases)"
  body=$(jq -n '{
    language: "javascript",
    code: "function solution(n){const r=[];for(let i=1;i<=n;i++){if(i%15===0)r.push(\"FizzBuzz\");else if(i%3===0)r.push(\"Fizz\");else if(i%5===0)r.push(\"Buzz\");else r.push(String(i));}return r;}console.log(JSON.stringify(solution(3)));",
    test_cases: [
      { expected_output: "[\"1\",\"2\",\"Fizz\"]" },
      { expected_output: "[\"1\",\"2\",\"Fizz\"]" },
      { expected_output: "[\"1\",\"2\",\"Fizz\"]" }
    ]
  }')
  call_execute "Multi-test js" "$body" >/dev/null
  assert_field "tests_total=3"  '.tests_total'  "3"
  assert_field "tests_passed=3" '.tests_passed' "3"

  # 2.6 Sin test_cases (solo ejecución)
  section "Sin test_cases (ejecución libre)"
  body=$(jq -n '{
    language: "javascript",
    code: "console.log(\"hola mundo\");",
    test_cases: []
  }')
  call_execute "Free exec js" "$body" >/dev/null
  local succ
  succ=$(field '.success')
  if [[ "$succ" == "true" ]]; then
    ok "success=true (ejecución libre)"
  else
    fail "success esperado=true obtenido=$succ"
  fi
}

# ── 3. Python ──────────────────────────────────────────────────────────────────
test_python() {
  header "3. PYTHON"

  # 3.1 Suma de dígitos
  section "Suma de dígitos solution(123) = 6"
  local body
  body=$(jq -n '{
    language: "python",
    code: "def solution(n):\n    return sum(int(d) for d in str(n))\nprint(solution(123))",
    test_cases: [{ expected_output: "6" }]
  }')
  call_execute "Digit sum py" "$body" >/dev/null
  assert_field "status=accepted"    '.status'       "accepted"
  assert_field "score=100"          '.score'        "100"

  # 3.2 FizzBuzz en Python
  section "FizzBuzz Python solution(5)"
  body=$(jq -n '{
    language: "python",
    code: "import json\ndef solution(n):\n    r=[]\n    for i in range(1,n+1):\n        if i%15==0: r.append(\"FizzBuzz\")\n        elif i%3==0: r.append(\"Fizz\")\n        elif i%5==0: r.append(\"Buzz\")\n        else: r.append(str(i))\n    return r\nprint(json.dumps(solution(5)))",
    test_cases: [{ expected_output: "[\"1\", \"2\", \"Fizz\", \"4\", \"Buzz\"]" }]
  }')
  call_execute "FizzBuzz py" "$body" >/dev/null
  assert_field "status=accepted" '.status' "accepted"

  # 3.3 Runtime error (ZeroDivisionError)
  section "ZeroDivisionError"
  body=$(jq -n '{
    language: "python",
    code: "print(1/0)",
    test_cases: [{ expected_output: "" }]
  }')
  call_execute "ZeroDivision py" "$body" >/dev/null
  assert_field "status=runtime_error" '.status' "runtime_error"

  # 3.4 Wrong answer
  section "Respuesta incorrecta"
  body=$(jq -n '{
    language: "python",
    code: "print(\"wrong\")",
    test_cases: [{ expected_output: "correct" }]
  }')
  call_execute "Wrong answer py" "$body" >/dev/null
  assert_field "status=wrong_answer" '.status' "wrong_answer"

  # 3.5 Suma de dígitos con varios inputs
  section "Varios tests — suma de dígitos"
  body=$(jq -n '{
    language: "python",
    code: "def solution(n):\n    return sum(int(d) for d in str(n))\nprint(solution(99))",
    test_cases: [
      { expected_output: "18" },
      { expected_output: "18" }
    ]
  }')
  call_execute "Multi-test py" "$body" >/dev/null
  assert_field "tests_total=2"  '.tests_total'  "2"
  assert_field "tests_passed=2" '.tests_passed' "2"
}

# ── 4. Lenguaje no soportado ───────────────────────────────────────────────────
test_unsupported() {
  header "4. LENGUAJE NO SOPORTADO"

  local body
  body=$(jq -n '{
    language: "brainfuck",
    code: "++++++++",
    test_cases: []
  }')
  call_execute "Unsupported language" "$body" >/dev/null

  local err
  err=$(field '.error')
  if [[ "$err" == "UNSUPPORTED_LANGUAGE" ]]; then
    ok "error=UNSUPPORTED_LANGUAGE"
  else
    # Algunos workers devuelven success=false sin campo error
    local succ
    succ=$(field '.success')
    if [[ "$succ" == "false" ]]; then
      ok "success=false (lenguaje rechazado)"
    else
      fail "Se esperaba UNSUPPORTED_LANGUAGE o success=false"
    fi
  fi
}

# ── 5. Cola Redis /queue ───────────────────────────────────────────────────────
test_queue() {
  header "5. ENDPOINT /queue (encolar job)"

  local body
  body=$(jq -n '{
    submission_id: "test-script-001",
    language: "python",
    code: "print(42)",
    test_cases: [{ expected_output: "42" }],
    user_id: 1,
    challenge_id: 1
  }')

  local response http_code
  response=$(curl -s -w "\n%{http_code}" \
    -X POST "${WORKER_URL}/queue" \
    -H "Content-Type: application/json" \
    -d "$body" \
    --max-time 5 2>/dev/null) || { fail "POST /queue — curl falló"; return; }

  http_code=$(echo "$response" | tail -n1)
  LAST_JSON=$(echo "$response" | sed '$d')

  if $VERBOSE; then
    echo "    $(echo "$LAST_JSON" | jq -C '.')"
  fi

  if [[ "$http_code" == "200" ]]; then
    ok "HTTP 200"
  else
    fail "HTTP $http_code (esperado 200)"
  fi

  local succ
  succ=$(field '.success')
  if [[ "$succ" == "true" ]]; then
    ok "success=true (job encolado)"
  else
    fail "success esperado=true obtenido=$succ"
  fi

  info "El resultado llegará por WebSocket al frontend (jobId: test-script-001)"

  # Campos faltantes
  section "Validación de campos obligatorios"
  body=$(jq -n '{ language: "python", code: "print(1)" }')
  response=$(curl -s -w "\n%{http_code}" \
    -X POST "${WORKER_URL}/queue" \
    -H "Content-Type: application/json" \
    -d "$body" \
    --max-time 5 2>/dev/null)
  http_code=$(echo "$response" | tail -n1)
  if [[ "$http_code" == "400" ]]; then
    ok "HTTP 400 cuando falta submission_id"
  else
    fail "HTTP $http_code esperado=400 cuando falta submission_id"
  fi
}

# ── 6. Seguridad / límites ─────────────────────────────────────────────────────
test_security() {
  header "6. SEGURIDAD Y LÍMITES"

  # 6.1 Sin acceso a red — debería fallar o timeout
  section "Sin acceso a red (network=none)"
  local body
  body=$(jq -n '{
    language: "python",
    code: "import urllib.request\nprint(urllib.request.urlopen(\"http://google.com\", timeout=2).status)",
    test_cases: [{ expected_output: "200" }]
  }')
  call_execute "No network py" "$body" >/dev/null
  local st
  st=$(field '.status')
  if [[ "$st" == "runtime_error" || "$st" == "wrong_answer" || "$st" == "timeout" ]]; then
    ok "Acceso a red bloqueado (status=$st)"
  else
    fail "Se esperaba runtime_error/wrong_answer/timeout, obtenido=$st"
  fi

  # 6.2 Bucle infinito — debe terminarse por timeout del runner
  section "Bucle infinito (timeout del runner)"
  body=$(jq -n '{
    language: "python",
    code: "while True:\n    pass",
    test_cases: [{ expected_output: "" }]
  }')
  # Timeout del worker es 10s por defecto; damos 20s al curl
  local response http_code
  response=$(curl -s -w "\n%{http_code}" \
    -X POST "${WORKER_URL}/execute" \
    -H "Content-Type: application/json" \
    -d "$body" \
    --max-time 25 2>/dev/null) || { fail "curl timeout — el runner no cortó a tiempo"; return; }

  http_code=$(echo "$response" | tail -n1)
  LAST_JSON=$(echo "$response" | sed '$d')
  st=$(field '.status')
  if [[ "$st" == "timeout" || "$st" == "runtime_error" ]]; then
    ok "Bucle infinito terminado (status=$st)"
  else
    fail "status=$st (esperado timeout o runtime_error)"
  fi
}

# ─────────────────────────── Resumen ──────────────────────────────────────────
print_summary() {
  echo -e "\n${BOLD}══════════════════════════════════════════════${NC}"
  echo -e "${BOLD}  RESUMEN${NC}"
  echo -e "${BOLD}══════════════════════════════════════════════${NC}"
  echo -e "  ${GREEN}Pasados: ${PASS}${NC}"
  echo -e "  ${RED}Fallados: ${FAIL}${NC}"
  [[ $SKIP -gt 0 ]] && echo -e "  ${YELLOW}Omitidos: ${SKIP}${NC}"
  echo ""
  if [[ $FAIL -eq 0 ]]; then
    echo -e "  ${GREEN}${BOLD}✓ Todos los tests pasaron${NC}"
  else
    echo -e "  ${RED}${BOLD}✗ ${FAIL} test(s) fallaron${NC}"
  fi
  echo ""
}

# ─────────────────────────── Main ─────────────────────────────────────────────
main() {
  check_deps

  echo -e "${BOLD}"
  echo "  ╔══════════════════════════════════════════╗"
  echo "  ║   RaiseCode — Worker Test Suite          ║"
  echo "  ╚══════════════════════════════════════════╝"
  echo -e "${NC}"
  echo -e "  Worker URL : ${CYAN}${WORKER_URL}${NC}"
  echo -e "  Verbose    : ${VERBOSE}"
  [[ -n "$FILTER" ]] && echo -e "  Filtro     : ${YELLOW}${FILTER}${NC}"

  wait_for_worker || exit 1

  run_if "health"      test_health
  run_if "js"          test_javascript
  run_if "python"      test_python
  run_if "unsupported" test_unsupported
  run_if "queue"       test_queue
  run_if "security"    test_security

  print_summary

  [[ $FAIL -eq 0 ]]  # exit code 0 si todo OK, 1 si hay fallos
}

main "$@"

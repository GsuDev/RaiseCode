import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from '@/auth/context/AuthContext';
import { toaster } from '@/components/ui/toaster';
import { submitCodeService } from '../services/execution.service';

/**
 * URL del servidor WebSocket (socket.io).
 *
 * Con nginx como reverse proxy:
 *   - VITE_API_URL = http://localhost/api
 *   - El socket.io corre en el mismo host:puerto, bajo /socket.io/
 *   - Nginx tiene `location /socket.io/` → proxy al API en :3000
 *
 * Por eso el WS_URL es simplemente el origen (sin /api ni puerto extra).
 * En desarrollo directo sin nginx se puede sobreescribir con VITE_WS_URL.
 */
const WS_URL: string = (() => {
  // Permite sobreescribir explícitamente si hace falta (ej: dev sin nginx)
  const explicit = import.meta.env.VITE_WS_URL as string | undefined;
  if (explicit) return explicit;

  // Con nginx: derivar el origen desde VITE_API_URL
  const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (apiUrl) {
    try {
      const { protocol, host } = new URL(apiUrl);
      return `${protocol}//${host}`;
    } catch {
      // URL malformada — fallback
    }
  }

  return 'http://localhost';
})();

const TIMEOUT_MS = 30_000;
const MAX_RECONNECT = 3;

export type ExecutionStatus = 'idle' | 'running' | 'done' | 'error';

export interface TestResultItem {
  test_number: number;
  passed: boolean;
  expected: string;
  actual: string;
  hidden?: boolean;
}

export interface ExecutionResult {
  status: 'accepted' | 'wrong_answer' | 'runtime_error' | 'timeout';
  score: number;
  tests_passed: number;
  tests_total: number;
  test_results: TestResultItem[];
  stdout: string;
  stderr: string;
  execution_time: number;
}

export const useExecution = () => {
  const {token, user } = useAuth();
  const [status, setStatus]  = useState<ExecutionStatus>('idle');
  const [result, setResult]  = useState<ExecutionResult | null>(null);
  const [error, setError]    = useState<string | null>(null);

  const socketRef    = useRef<Socket | null>(null);
  const timeoutRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectRef = useRef(0);
  const jobIdRef     = useRef<string | null>(null);
  const resolvedRef  = useRef(false);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const connectSocket = (jobId: string) => {
    socketRef.current?.disconnect();

    const socket = io(WS_URL, {
      transports: ['websocket'],
      path: '/socket.io/',
      query: { userId: String(user?.id) },
      reconnection: false,
    });
    socketRef.current = socket;

    socket.on(`execution:result:${jobId}`, (data: ExecutionResult) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      resolvedRef.current = true;
      socket.disconnect();

      setResult(data);
      setStatus('done');

      if (data.status === 'accepted') {
        toaster.create({
          title: '¡Reto completado!',
          description: `${data.tests_passed}/${data.tests_total} tests pasados`,
          type: 'success',
        });
      }
    });

    socket.on('connect_error', (err) => {
      if (resolvedRef.current) return;
      console.warn(`[WS] connect_error (intento ${reconnectRef.current + 1}):`, err.message);

      if (reconnectRef.current < MAX_RECONNECT) {
        reconnectRef.current++;
        setTimeout(() => {
          if (!resolvedRef.current && jobIdRef.current) {
            connectSocket(jobIdRef.current);
          }
        }, 500 * Math.pow(2, reconnectRef.current - 1));
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setError('No se pudo conectar al servidor de resultados');
        setStatus('error');
        socket.disconnect();
      }
    });

    socket.on('disconnect', (reason) => {
      if (resolvedRef.current) return;
      if (reason === 'io server disconnect') return;

      if (reconnectRef.current < MAX_RECONNECT) {
        reconnectRef.current++;
        setTimeout(() => {
          if (!resolvedRef.current && jobIdRef.current) {
            connectSocket(jobIdRef.current);
          }
        }, 1000 * reconnectRef.current);
      }
    });
  };

  const submit = async (challengeId: number, code: string): Promise<void> => {
    if (!token) return;

    socketRef.current?.disconnect();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    reconnectRef.current = 0;
    resolvedRef.current  = false;
    jobIdRef.current     = null;

    setStatus('running');
    setResult(null);
    setError(null);

    try {
      const { jobId } = await submitCodeService({ challengeId, code }, token);
      jobIdRef.current = jobId;

      connectSocket(jobId);

      timeoutRef.current = setTimeout(() => {
        if (resolvedRef.current) return;
        socketRef.current?.disconnect();
        setError('La ejecución tardó demasiado. Inténtalo de nuevo.');
        setStatus('error');
      }, TIMEOUT_MS);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
      setStatus('error');
    }
  };

  const abort = () => {
    socketRef.current?.disconnect();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    reconnectRef.current = 0;
    resolvedRef.current  = true;
    jobIdRef.current     = null;
    setStatus('idle');
    setResult(null);
    setError(null);
  };

  return { submit, abort, status, result, error };
};

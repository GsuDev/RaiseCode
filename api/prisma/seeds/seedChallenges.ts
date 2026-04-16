import { PrismaClient } from '../../generated/client/client';

export async function seedChallenges(prisma: PrismaClient) {
  console.log('  -> Insertando Retos...');

  // Obtenemos los usuarios
  const admin = await prisma.user.findFirstOrThrow({ where: { email: 'admin@raisecode.dev' } });

  // Obtenemos las opciones de lenguajes
  const jsLang = await prisma.language.findFirstOrThrow({ where: { name: 'JavaScript' } });
  const pyLang = await prisma.language.findFirstOrThrow({ where: { name: 'Python' } });

  // Obtenemos las opciones de dificultad
  const easyDiff = await prisma.dificulty.findFirstOrThrow({ where: { name: 'Easy' } });
  const medDiff = await prisma.dificulty.findFirstOrThrow({ where: { name: 'Medium' } });

  // Obtenemos las asignaturas
  const dwClient = await prisma.subject.findFirstOrThrow({ where: { name: 'Desarrollo Web en Entorno Cliente' } });
  const programacion = await prisma.subject.findFirstOrThrow({ where: { name: 'Programación' } });

  // 1. Reto: FizzBuzz
  await prisma.challenge.create({
    data: {
      title: 'FizzBuzz',
      description: 'Escribe una función que reciba n y devuelva un array de strings con FizzBuzz.',
      statement: '## FizzBuzz\n\nEscribe una función `solution(n)` que reciba un número entero positivo `n` y devuelva un array de strings con los números del 1 al n donde:\n\n- Los múltiplos de 3 se sustituyen por `"Fizz"`\n- Los múltiplos de 5 se sustituyen por `"Buzz"`\n- Los múltiplos de 3 y 5 se sustituyen por `"FizzBuzz"`\n- El resto de números se dejan como string\n\n### Ejemplo\n```\nsolution(5) → ["1","2","Fizz","4","Buzz"]\n```',
      dificultyId: easyDiff.id,
      languageId: jsLang.id,
      subjectId: dwClient.id,
      creatorId: admin.id,
      validatorId: admin.id,
      validate: true,
      tests: {
        create: [
          { input: '5', expectedOutput: '["1","2","Fizz","4","Buzz"]', hidden: false },
          { input: '1', expectedOutput: '["1"]', hidden: false },
          { input: '15', expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]', hidden: true }
        ]
      }
    }
  });

  // 2. Reto: Suma de dígitos
  await prisma.challenge.create({
    data: {
      title: 'Suma de dígitos',
      description: 'Dado un número entero no negativo, devuelve la suma de todos sus dígitos.',
      statement: '## Suma de dígitos\n\nEscribe una función `solution(n)` que reciba un número entero no negativo `n` y devuelva la suma de todos sus dígitos.\n\n### Ejemplos\n```\nsolution(123) → 6\nsolution(0) → 0\nsolution(99) → 18\n```',
      dificultyId: easyDiff.id,
      languageId: pyLang.id,
      subjectId: programacion.id,
      creatorId: admin.id,
      validatorId: admin.id,
      validate: true,
      tests: {
        create: [
          { input: '123', expectedOutput: '6', hidden: false },
          { input: '0', expectedOutput: '0', hidden: false },
          { input: '99', expectedOutput: '18', hidden: true }
        ]
      }
    }
  });

  // 3. Reto: Palíndromo
  await prisma.challenge.create({
    data: {
      title: 'Palíndromo',
      description: 'Comprueba si una cadena de texto es un palíndromo ignorando espacios y mayúsculas.',
      statement: '## Palíndromo\n\nEscribe una función `solution(s)` que reciba una cadena de texto y devuelva `true` si es un palíndromo, ignorando espacios y mayúsculas.\n\n### Ejemplos\n```\nsolution("racecar") → true\nsolution("hello") → false\nsolution("A man a plan a canal Panama") → true\n```',
      dificultyId: medDiff.id,
      languageId: jsLang.id,
      subjectId: dwClient.id,
      creatorId: admin.id,
      validatorId: admin.id,
      validate: true,
      tests: {
        create: [
          { input: '"racecar"', expectedOutput: 'true', hidden: false },
          { input: '"hello"', expectedOutput: 'false', hidden: false },
          { input: '"A man a plan a canal Panama"', expectedOutput: 'true', hidden: true }
        ]
      }
    }
  });
}
-- ─── LIMPIEZA (orden FK inverso) ──────────────────────────────────────────────
DELETE FROM CompletedChallenges;
DELETE FROM ChallengeTest;
DELETE FROM Challenge;
DELETE FROM SubjectCourse;
DELETE FROM UserSubjects;
DELETE FROM UserAchievements;
DELETE FROM UserRoles;
DELETE FROM User;
DELETE FROM Subject;
DELETE FROM Course;
DELETE FROM Dificulty;
DELETE FROM Language;
DELETE FROM Role;
DELETE FROM Achievement;

-- ─── DIFICULTADES ─────────────────────────────────────────────────────────────
INSERT INTO Dificulty (name) VALUES ('Easy'), ('Medium'), ('Hard');

-- ─── LENGUAJES ────────────────────────────────────────────────────────────────
INSERT INTO Language (name) VALUES ('JavaScript'), ('Python'), ('Java'), ('TypeScript');

-- ─── ROLES ────────────────────────────────────────────────────────────────────
INSERT INTO Role (name) VALUES ('USER'), ('ADMIN');

-- ─── CICLOS ───────────────────────────────────────────────────────────────────
INSERT INTO Course (name) VALUES ('DAW'), ('DAM'), ('ASIR');

-- ─── ASIGNATURAS ──────────────────────────────────────────────────────────────
INSERT INTO Subject (name, description) VALUES
  ('Bases de Datos',                                           'Diseño, implementación y gestión de bases de datos relacionales y no relacionales.'),
  ('Lenguajes de Marcas y Sistemas de Gestión de Información', 'Creación y transformación de documentos XML, HTML y JSON para el intercambio de información.'),
  ('Desarrollo Web en Entorno Cliente',                        'Programación de aplicaciones web con JavaScript, manipulación del DOM, AJAX y frameworks modernos de frontend.'),
  ('Desarrollo Web en Entorno Servidor',                       'Desarrollo de aplicaciones web del lado del servidor con PHP, Node.js y frameworks como Laravel.'),
  ('Diseño de Interfaces Web',                                 'Diseño y maquetación de interfaces web accesibles y usables con CSS, SASS y técnicas responsive.'),
  ('Programación',                                             'Fundamentos de programación orientada a objetos con Java: estructuras de datos, algoritmos y patrones de diseño.');

-- ─── SUBJECT_COURSE ───────────────────────────────────────────────────────────
INSERT INTO SubjectCourse (subjectId, courseId)
SELECT s.id, c.id FROM Subject s, Course c WHERE
  (s.name = 'Bases de Datos'                                           AND c.name IN ('DAW','DAM')) OR
  (s.name = 'Lenguajes de Marcas y Sistemas de Gestión de Información' AND c.name IN ('DAW','DAM','ASIR')) OR
  (s.name = 'Desarrollo Web en Entorno Cliente'                        AND c.name = 'DAW') OR
  (s.name = 'Desarrollo Web en Entorno Servidor'                       AND c.name = 'DAW') OR
  (s.name = 'Diseño de Interfaces Web'                                 AND c.name = 'DAW') OR
  (s.name = 'Programación'                                             AND c.name = 'DAM');

-- ─── USUARIOS ─────────────────────────────────────────────────────────────────
-- admin@raisecode.dev → Admin1234!
-- user@raisecode.dev  → User1234!
INSERT INTO User (email, name, lastname, password, courseId)
VALUES
  ('admin@raisecode.dev', 'Admin',   'RaiseCode', '$2b$10$i0xiTtSqceYh91RrZebfFO29K/8YhENiOM5QJ81IKiID4w8IEgVMu', (SELECT id FROM Course WHERE name='DAW')),
  ('user@raisecode.dev',  'Usuario', 'Demo',       '$2b$10$HTTLwq285R6MURN4mmJuWOQdxkdSpc9x7LSyLMUwKEavhHWJ1UgG6', (SELECT id FROM Course WHERE name='DAM'));

INSERT INTO UserRoles (userId, roleId)
SELECT u.id, r.id FROM User u, Role r WHERE
  (u.email = 'admin@raisecode.dev' AND r.name IN ('USER','ADMIN')) OR
  (u.email = 'user@raisecode.dev'  AND r.name = 'USER');

-- ─── RETOS DE EJEMPLO ─────────────────────────────────────────────────────────
INSERT INTO Challenge (title, description, statement, dificultyId, languageId, subjectId, creatorId, validatorId, validate)
VALUES (
  'FizzBuzz',
  'Escribe una función que reciba n y devuelva un array de strings con FizzBuzz.',
  '## FizzBuzz\n\nEscribe una función `solution(n)` que reciba un número entero positivo `n` y devuelva un array de strings con los números del 1 al n donde:\n\n- Los múltiplos de 3 se sustituyen por `"Fizz"`\n- Los múltiplos de 5 se sustituyen por `"Buzz"`\n- Los múltiplos de 3 y 5 se sustituyen por `"FizzBuzz"`\n- El resto de números se dejan como string\n\n### Ejemplo\n```\nsolution(5) → ["1","2","Fizz","4","Buzz"]\n```',
  (SELECT id FROM Dificulty WHERE name='Easy'),
  (SELECT id FROM Language  WHERE name='JavaScript'),
  (SELECT id FROM Subject   WHERE name='Desarrollo Web en Entorno Cliente'),
  (SELECT id FROM User      WHERE email='admin@raisecode.dev'),
  (SELECT id FROM User      WHERE email='admin@raisecode.dev'),
  1
);

INSERT INTO ChallengeTest (challengeId, input, expectedOutput, hidden)
SELECT id, '5',  '["1","2","Fizz","4","Buzz"]', 0 FROM Challenge WHERE title='FizzBuzz'
UNION ALL
SELECT id, '1',  '["1"]', 0 FROM Challenge WHERE title='FizzBuzz'
UNION ALL
SELECT id, '15', '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]', 1 FROM Challenge WHERE title='FizzBuzz';

INSERT INTO Challenge (title, description, statement, dificultyId, languageId, subjectId, creatorId, validatorId, validate)
VALUES (
  'Suma de dígitos',
  'Dado un número entero no negativo, devuelve la suma de todos sus dígitos.',
  '## Suma de dígitos\n\nEscribe una función `solution(n)` que reciba un número entero no negativo `n` y devuelva la suma de todos sus dígitos.\n\n### Ejemplos\n```\nsolution(123) → 6\nsolution(0)   → 0\nsolution(99)  → 18\n```',
  (SELECT id FROM Dificulty WHERE name='Easy'),
  (SELECT id FROM Language  WHERE name='Python'),
  (SELECT id FROM Subject   WHERE name='Programación'),
  (SELECT id FROM User      WHERE email='admin@raisecode.dev'),
  (SELECT id FROM User      WHERE email='admin@raisecode.dev'),
  1
);

INSERT INTO ChallengeTest (challengeId, input, expectedOutput, hidden)
SELECT id, '123', '6',  0 FROM Challenge WHERE title='Suma de dígitos'
UNION ALL
SELECT id, '0',   '0',  0 FROM Challenge WHERE title='Suma de dígitos'
UNION ALL
SELECT id, '99',  '18', 1 FROM Challenge WHERE title='Suma de dígitos';

INSERT INTO Challenge (title, description, statement, dificultyId, languageId, subjectId, creatorId, validatorId, validate)
VALUES (
  'Palíndromo',
  'Comprueba si una cadena de texto es un palíndromo ignorando espacios y mayúsculas.',
  '## Palíndromo\n\nEscribe una función `solution(s)` que reciba una cadena de texto y devuelva `true` si es un palíndromo, ignorando espacios y mayúsculas.\n\n### Ejemplos\n```\nsolution("racecar") → true\nsolution("hello")   → false\nsolution("A man a plan a canal Panama") → true\n```',
  (SELECT id FROM Dificulty WHERE name='Medium'),
  (SELECT id FROM Language  WHERE name='JavaScript'),
  (SELECT id FROM Subject   WHERE name='Desarrollo Web en Entorno Cliente'),
  (SELECT id FROM User      WHERE email='admin@raisecode.dev'),
  (SELECT id FROM User      WHERE email='admin@raisecode.dev'),
  1
);

INSERT INTO ChallengeTest (challengeId, input, expectedOutput, hidden)
SELECT id, '"racecar"', 'true',  0 FROM Challenge WHERE title='Palíndromo'
UNION ALL
SELECT id, '"hello"',   'false', 0 FROM Challenge WHERE title='Palíndromo'
UNION ALL
SELECT id, '"A man a plan a canal Panama"', 'true', 1 FROM Challenge WHERE title='Palíndromo';

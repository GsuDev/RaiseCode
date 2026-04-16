import { PrismaClient } from '../../generated/client/client';

export async function seedSubjects(prisma: PrismaClient) {
  console.log('  -> Insertando Asignaturas...');

  // Obtenemos todos los cursos/ciclos (DAW, DAM, ASIR) previamente insertados
  const courses = await prisma.course.findMany();
  
  const getCourseId = (name: string) => {
    const course = courses.find(c => c.name === name);
    if (!course) throw new Error(`Ciclo formativo '${name}' no encontrado.`);
    return course.id;
  };

  const subjectsData = [
    {
      name: 'Bases de Datos',
      description: 'Diseño, implementación y gestión de bases de datos relacionales y no relacionales.',
      courses: ['DAW', 'DAM']
    },
    {
      name: 'Lenguajes de Marcas y Sistemas de Gestión de Información',
      description: 'Creación y transformación de documentos XML, HTML y JSON para el intercambio de información.',
      courses: ['DAW', 'DAM', 'ASIR']
    },
    {
      name: 'Desarrollo Web en Entorno Cliente',
      description: 'Programación de aplicaciones web con JavaScript, manipulación del DOM, AJAX y frameworks modernos de frontend.',
      courses: ['DAW']
    },
    {
      name: 'Desarrollo Web en Entorno Servidor',
      description: 'Desarrollo de aplicaciones web del lado del servidor con PHP, Node.js y frameworks como Laravel.',
      courses: ['DAW']
    },
    {
      name: 'Diseño de Interfaces Web',
      description: 'Diseño y maquetación de interfaces web accesibles y usables con CSS, SASS y técnicas responsive.',
      courses: ['DAW']
    },
    {
      name: 'Programación',
      description: 'Fundamentos de programación orientada a objetos con Java: estructuras de datos, algoritmos y patrones de diseño.',
      courses: ['DAM']
    }
  ];

  for (const subject of subjectsData) {
    await prisma.subject.create({
      data: {
        name: subject.name,
        description: subject.description,
        // Crea la relación en la tabla intermedia (SubjectCourse)
        subjectCourses: {
          create: subject.courses.map(courseName => ({
            courseId: getCourseId(courseName)
          }))
        }
      }
    });
  }
}
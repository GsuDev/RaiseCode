import { PrismaClient } from '../../generated/client/client';

export async function seedSubjects(prisma: PrismaClient) {
  console.log('  -> Insertando Asignaturas...');

  const courses = await prisma.course.findMany();
  const getCourseId = (name: string) => courses.find(c => c.name === name)?.id!;

  const subjectsData = [
    {
      name: 'Bases de Datos',
      description: 'Diseño, implementación y gestión de bases de datos relacionales y no relacionales.',
      courses: ['DAW', 'DAM']
    },
    {
      name: 'Desarrollo Web en Entorno Cliente',
      description: 'Programación de aplicaciones web con JavaScript, manipulación del DOM...',
      courses: ['DAW']
    }
  ];

  for (const subject of subjectsData) {
    await prisma.subject.create({
      data: {
        name: subject.name,
        description: subject.description,
        subjectCourses: {
          create: subject.courses.map(courseName => ({
            courseId: getCourseId(courseName)
          }))
        }
      }
    });
  }
}
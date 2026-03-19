import { Box, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";
import { Code2, Zap, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { CycleCard } from "./components/CycleCard";
import { useCycles } from "./hooks/useCycles";

const colorPalettes = [
  {
    gradient: "linear-gradient(135deg, #f59e0b, #ea580c)",
    borderClr: "rgba(245,158,11,0.3)",
    bgClr: "rgba(245,158,11,0.08)",
  },
  {
    gradient: "linear-gradient(135deg, #22c55e, #14b8a6)",
    borderClr: "rgba(34,197,94,0.3)",
    bgClr: "rgba(34,197,94,0.08)",
  },
  {
    gradient: "linear-gradient(135deg, #06b6d4, #2563eb)",
    borderClr: "rgba(6,182,212,0.3)",
    bgClr: "rgba(6,182,212,0.08)",
  },
];

const cycleInfo: Record<string, { title: string; description: string }> = {
  DAW: {
    title: "Desarrollo de Aplicaciones WEB",
    description: "Domina el desarrollo frontend y backend para crear aplicaciones web",
  },
  DAM: {
    title: "Desarrollo de Aplicaciones Multiplataforma",
    description: "Aprende a crear aplicaciones nativas para móviles y escritorio",
  },
  ASIR: {
    title: "Administración de sistemas y redes",
    description: "Gestiona infraestructuras, servidores y seguridad informática",
  },
};

const getIconByCode = (code: string) => {
  if (code === "DAW") return Code2;
  if (code === "DAM") return Zap;
  return Users;
};

export const CyclesSection = () => {
  const navigate = useNavigate();
  const { courses, loading } = useCycles();

  return (
    <Box as="section" mt={10} w="75%">
      <VStack mb="8" gap={1}>
        <Text fontWeight="bold" fontSize="2xl" color={{ base: "gray.900", _dark: "white" }} textAlign="center">
          Ciclos Formativos
        </Text>
        <Text color={{ base: "gray.600", _dark: "gray.400" }} textAlign="center">
          Elige tu especialidad y comienza a resolver retos
        </Text>
      </VStack>

      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="6">
        {loading ? (
          <>
            <Skeleton h="220px" borderRadius="2xl" />
            <Skeleton h="220px" borderRadius="2xl" />
            <Skeleton h="220px" borderRadius="2xl" />
          </>
        ) : (
          courses.map((course, index) => {
            const fixedColor = colorPalettes[index % colorPalettes.length];
            const iconComponent = getIconByCode(course.name);
            const info = cycleInfo[course.name] ?? {
              title: course.name,
              description: "",
            };

            return (
              <CycleCard
                key={course.id}
                code={course.name}
                title={info.title}
                description={info.description}
                subjects={course.subjectCount}
                challenges={course.challengeCount}
                icon={iconComponent}
                gradient={fixedColor.gradient}
                borderClr={fixedColor.borderClr}
                bgClr={fixedColor.bgClr}
                onClick={() => navigate(`/asignaturas?curso=${course.name}`)}
              />
            );
          })
        )}
      </Grid>
    </Box>
  );
};
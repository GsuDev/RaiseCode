import { Box, Grid, Text, VStack } from "@chakra-ui/react";
import { Code2, Zap, Users } from "lucide-react";
import { CycleCard } from "./components/CycleCard";

interface Cycle {
  id: string;
  code: string;
  title: string;
  description: string;
  subjects: number;
  challenges: number;
}

const mockCycles: Cycle[] = [
  {
    id: "1",
    code: "DAW",
    title: "Desarrollo de Aplicaciones WEB",
    description:
      "Domina el desarrollo frontend y backend para crear aplicaciones web",
    subjects: 3,
    challenges: 4,
  },
  {
    id: "2",
    code: "DAM",
    title: "Desarrollo de Aplicaciones Multiplataforma",
    description:
      "Aprende a crear aplicaciones nativas para moviles y escritorio",
    subjects: 3,
    challenges: 2,
  },
  {
    id: "3",
    code: "ASIR",
    title: "Administracion de sistemas y redes",
    description:
      "Gestiona infraestructuras, servidores y seguridad informatica",
    subjects: 2,
    challenges: 2,
  },
];

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

const getIconByCode = (code: string) => {
  if (code === "DAW") return Code2;
  if (code === "DAM") return Zap;
  return Users;
};

export const CyclesSection = () => {
  return (
    <Box as="section" mt={10} w="100%">
      <VStack mb="8" gap={1}>
        <Text fontWeight="bold" fontSize="2xl" color={{ base: "gray.900", _dark: "white" }} textAlign="center">
          Ciclos Formativos
        </Text>
        <Text color={{ base: "gray.600", _dark: "gray.400" }} textAlign="center">
          Elige tu especialidad y comienza a resolver retos
        </Text>
      </VStack>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="6">
        {mockCycles.map((cycle, index) => {
          const fixedColor = colorPalettes[index % colorPalettes.length];
          const iconComponent = getIconByCode(cycle.code);

          return (
            <CycleCard
              key={cycle.id}
              code={cycle.code}
              title={cycle.title}
              description={cycle.description}
              subjects={cycle.subjects}
              challenges={cycle.challenges}
              icon={iconComponent}
              gradient={fixedColor.gradient}
              borderClr={fixedColor.borderClr}
              bgClr={fixedColor.bgClr}
            />
          );
        })}
      </Grid>
    </Box>
  );
};

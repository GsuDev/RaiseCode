import { Box, Flex, Text } from "@chakra-ui/react";
import { Code2 } from "lucide-react";

interface LanguageStat {
  languageName: string;
  count: number;
}

interface Props {
  byLanguage: LanguageStat[];
}

export const ProfileLanguageChart = ({ byLanguage }: Props) => {
  // Sacamos el número máximo de retos para calcular los porcentajes de la barra
  // Si el array está vacío, usamos 1 para no dividir entre 0
  const maxCount = Math.max(...byLanguage.map((l) => l.count), 1);

  return (
    <Box bg="bg.panel" p={6} borderRadius="xl" border="1px solid" borderColor="border" h="full">
      
      {/* Título*/}
      <Flex alignItems="center" gap={2} mb={6}>
        <Code2 size={20} color="var(--chakra-colors-brand-500)" />
        <Text fontSize="lg" fontWeight="bold" color="fg">
          Retos por Lenguaje
        </Text>
      </Flex>

      {/* Lista de barras */}
      <Flex direction="column" gap={5}>
        {byLanguage.map((lang) => {
          const percentage = (lang.count / maxCount) * 100;
          return (
            <Box key={lang.languageName}>
              <Flex justifyContent="space-between" mb={2} fontSize="sm">
                <Text fontWeight="medium" color="fg">{lang.languageName}</Text>
                <Text color="fg.muted">{lang.count} retos</Text>
              </Flex>
              {/* Fondo de la barra */}
              <Box w="full" h="2" bg="bg.subtle" borderRadius="full" overflow="hidden">
                {/* Relleno de la barra */}
                <Box 
                  h="full" 
                  bg="brand.500" 
                  w={`${percentage}%`} 
                  borderRadius="full" 
                  transition="width 0.5s ease" 
                />
              </Box>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};
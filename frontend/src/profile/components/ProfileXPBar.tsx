import { Box, Flex, Text } from "@chakra-ui/react";

export const ProfileXPBar = () => {
  //Los datos son mockeados, los cambiare cuando haga el bacb es para probar que funciona
  const currentXP = 3250;
  const nextLevelXP = 4000;
  const currentLevel = 12;

  const percentage = (currentXP / nextLevelXP) * 100;

  return (
    <Box w="full" mt={6}>
      <Flex justifyContent="space-between" mb={2}>
        <Text fontSize="sm" color="fg.muted">
          Progreso al nivel {currentLevel + 1}
        </Text>
        <Text fontSize="sm" color="fg.muted">
          <Text as="span" color="fg" fontWeight="medium">
            {currentXP}
          </Text>{" "}
          / {nextLevelXP} XP
        </Text>
      </Flex>

      <Box w="full" h="2" bg="bg.subtle" borderRadius="full" overflow="hidden">
        <Box
          h="full"
          bg="brand.500"
          w={`${percentage}%`}
          transition="width 0.5s ease-in-out"
        />
      </Box>
    </Box>
  );
};

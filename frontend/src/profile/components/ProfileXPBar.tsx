import { Box, Flex, Text } from "@chakra-ui/react";

interface Props {
  xp: number;
}

const XP_PER_LEVEL = 100;

export const ProfileXPBar = ({ xp }: Props) => {
  const currentLevel = Math.floor(xp / XP_PER_LEVEL);
  const currentLevelXP = xp % XP_PER_LEVEL;
  const percentage = (currentLevelXP / XP_PER_LEVEL) * 100;

  return (
    <Box w="full" mt={6}>
      <Flex justifyContent="space-between" mb={2}>
        <Text fontSize="sm" color="fg.muted">
          Progreso al nivel {currentLevel + 1}
        </Text>
        <Text fontSize="sm" color="fg.muted">
          <Text as="span" color="fg" fontWeight="medium">
            {currentLevelXP}
          </Text>{" "}
          / {XP_PER_LEVEL} XP
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

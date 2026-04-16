import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { Trophy, Lock } from "lucide-react";
import type { Achievement, UserAchievement } from "../services/profile.service";

interface Props {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
}

export const ProfileAchievements = ({
  achievements,
  userAchievements,
}: Props) => {
    if (!achievements || !userAchievements) return null;
  const unlockedIds = userAchievements.map((ua) => ua.achievementId);

  return (
    <Box
      bg="bg.panel"
      p={6}
      borderRadius="xl"
      border="1px solid"
      borderColor="border"
    >
      <Flex alignItems="center" gap={2} mb={6}>
        <Trophy size={20} color="var(--chakra-colors-brand-500)" />
        <Text fontSize="lg" fontWeight="bold" color="fg">
          Logros
        </Text>
      </Flex>

      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={4}
      >
        {achievements.map((achievement) => {
          const isUnlocked = unlockedIds.includes(achievement.id);
          const userAchievement = userAchievements.find(
            (ua) => ua.achievementId === achievement.id,
          );

          return (
            <Box
              key={achievement.id}
              p={4}
              borderRadius="lg"
              border="1px solid"
              borderColor={isUnlocked ? "brand.500" : "border"}
              bg={
                isUnlocked
                  ? "rgba(var(--chakra-colors-brand-500), 0.08)"
                  : "bg.subtle"
              }
              opacity={isUnlocked ? 1 : 0.4}
            >
              <Flex alignItems="center" gap={3} mb={2}>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  h="10"
                  w="10"
                  borderRadius="md"
                  bg={isUnlocked ? "brand.500" : "bg.canvas"}
                  color={isUnlocked ? "white" : "fg.muted"}
                >
                  {isUnlocked ? <Trophy size={20} /> : <Lock size={20} />}
                </Flex>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="fg">
                    {achievement.name}
                  </Text>
                  {isUnlocked && userAchievement && (
                    <Text fontSize="xs" color="fg.muted">
                      {new Date(userAchievement.unlockedAt).toLocaleDateString(
                        "es-ES",
                      )}
                    </Text>
                  )}
                </Box>
              </Flex>
              <Text fontSize="xs" color="fg.muted">
                {achievement.description}
              </Text>
              <Text fontSize="xs" color="brand.500" fontWeight="bold" mt={1}>
                +{achievement.xpReward} XP
              </Text>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
};

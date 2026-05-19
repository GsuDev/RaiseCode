import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { Trophy, Target } from "lucide-react";
import type { RecentActivity } from "../services/profile.service";

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

interface Props {
  recentActivity: RecentActivity[];
}

export const ProfileRecentActivity = ({ recentActivity }: Props) => {
  return (
    <Box bg="bg.panel" p={6} borderRadius="xl" border="1px solid" borderColor="border" h="full">

      <Flex alignItems="center" gap={2} mb={6}>
        <Trophy size={20} color="var(--chakra-colors-brand-500)" />
        <Text fontSize="lg" fontWeight="bold" color="fg">
          Actividad Reciente
        </Text>
      </Flex>

      <VStack align="stretch" gap={3}>
        {recentActivity.length === 0 && (
          <Text fontSize="sm" color="fg.muted" textAlign="center" py={4}>
            Aún no has completado ningún reto
          </Text>
        )}
        {recentActivity.slice(0, 4).map((activity) => (
          <Flex
            key={activity.challengeId}
            p={3}
            bg="bg.canvas"
            borderRadius="lg"
            border="1px solid"
            borderColor="border"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex alignItems="center" gap={4}>
              <Flex
                alignItems="center"
                justifyContent="center"
                h="10"
                w="10"
                borderRadius="md"
                bg="rgba(72, 187, 120, 0.15)"
                color="green.500"
              >
                <Target size={20} />
              </Flex>

              <Box>
                <Text fontSize="sm" fontWeight="semibold" color="fg" lineClamp={1}>
                  Completaste '{activity.challengeTitle}'
                </Text>
                <Text fontSize="xs" color="fg.muted">
                  {activity.languageName} · {formatDate(activity.completedAt)}
                </Text>
              </Box>
            </Flex>

            <Box px={2} py={1} bg="rgba(72, 187, 120, 0.15)" color="green.500" borderRadius="md" fontSize="xs" fontWeight="bold">
              +{activity.xpEarned} XP
            </Box>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};
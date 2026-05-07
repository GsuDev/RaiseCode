import { Box, HStack, VStack, Text, Skeleton } from '@chakra-ui/react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color?: string;
  isLoading?: boolean;
}

export const StatCard = ({
  label,
  value,
  icon: Icon,
  color = 'brand',
  isLoading = false,
}: StatCardProps) => (
  <Box
    bg="bg.panel"
    borderRadius="lg"
    borderWidth="1px"
    borderColor="border"
    p={6}
  >
    <HStack gap={4} align="flex-start">
      <Box
        p={3}
        borderRadius="lg"
        bg={`${color}.50`}
        color={`${color}.500`}
      >
        <Icon size={24} />
      </Box>
      <VStack gap={1} align="flex-start" flex={1}>
        <Text fontSize="sm" color="fg.muted" fontWeight="500">
          {label}
        </Text>
        {isLoading ? (
          <Skeleton height="28px" width="80px" />
        ) : (
          <Text fontSize="2xl" fontWeight="bold" color="fg">
            {value}
          </Text>
        )}
      </VStack>
    </HStack>
  </Box>
);

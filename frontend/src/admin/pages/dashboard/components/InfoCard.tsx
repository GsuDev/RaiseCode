import { Box, HStack, VStack, Text, Skeleton, Badge } from '@chakra-ui/react';

interface InfoItem {
  label: string;
  value: string | number;
  highlight?: boolean;
}

interface InfoCardProps {
  title: string;
  items: InfoItem[];
  icon: React.ComponentType<any>;
  isLoading?: boolean;
}

export const InfoCard = ({
  title,
  items,
  icon: Icon,
  isLoading = false,
}: InfoCardProps) => (
  <Box
    bg="bg.panel"
    borderRadius="lg"
    borderWidth="1px"
    borderColor="border"
    p={6}
  >
    <HStack gap={4} align="flex-start">
      <Icon size={24} />
      <Text fontSize="lg" fontWeight="bold" color="fg" mb={4}>
        {title}
      </Text>
    </HStack>
    <VStack gap={3} align="stretch">
      {items.map((item, idx) => (
        <HStack key={idx} justify="space-between" gap={2}>
          <Text fontSize="sm" color="fg.muted">
            {item.label}
          </Text>
          {isLoading ? (
            <Skeleton height="20px" width="60px" />
          ) : (
            <Badge
              colorScheme={item.highlight ? 'brand' : 'gray'}
              variant={item.highlight ? 'solid' : 'subtle'}
            >
              {item.value}
            </Badge>
          )}
        </HStack>
      ))}
    </VStack>
  </Box>
);

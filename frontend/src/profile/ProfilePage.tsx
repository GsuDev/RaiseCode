import { Box, Text } from "@chakra-ui/react";

export const ProfilePage = () => {
  return (
    <Box p={8} textAlign="center" mt={10}>
      <Text fontSize="3xl" fontWeight="bold" color="fg">
        Texto ejemplo
      </Text>
      <Text color="fg.muted" mt={4}>
        Texto ejemplo
      </Text>
    </Box>
  );
};
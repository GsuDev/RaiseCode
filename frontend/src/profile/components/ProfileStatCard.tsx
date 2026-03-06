import { Box, Flex, Text } from "@chakra-ui/react";
import { type ReactNode } from "react";

interface Props {
  icon: ReactNode;
  value: string | number;
  label: string;
  iconColor: string,
  boxBg: string;
}

export const ProfileStatCard = ({ icon, value, label, iconColor, boxBg }: Props) => {
  return (
    <Box
      bg="bg.panel"
      p="5"
      borderRadius="xl"
      border="1px solid"
      borderColor="border"
    >
      <Flex alignItems="center" gap="4">
        {/* Contenedor cuadrado para el icono */}
        <Flex
          alignItems="center"
          justifyContent="center"
          h="12"
          w="12"
          borderRadius="lg"
          bg={boxBg}
          color={iconColor}
        >
          {icon}
        </Flex>

        <Box>
            <Text fontSize="2xl" fontWeight="bold" color="fg">
                {value}
            </Text>
            <Text fontSize="sm" color="fg.muted">
                {label}
            </Text>
        </Box>
      </Flex>
    </Box>
  );
};

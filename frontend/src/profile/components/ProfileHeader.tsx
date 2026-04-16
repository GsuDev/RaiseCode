import { Box, Flex, Text, Avatar } from "@chakra-ui/react";
import { ProfileXPBar } from "./ProfileXPBar";

interface Props {
  name: string;
  lastname: string;
  email: string;
  cycle: string;
  xp: number;
}

export const ProfileHeader = ({ name, lastname, email, cycle, xp }: Props) => {
  // Saco las iniciales para el avatar
  const initials = `${name.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  const currentLevel = Math.floor(xp / 100);

  return (
    <Box bg="bg.panel" p={{ base: 5, md: 8 }} borderRadius="xl" border="1px solid" borderColor="border">
      <Flex justifyContent="space-between" alignItems="flex-start" direction={{ base: "column", sm: "row" }} gap={4}>
        
        {/* Info del usuario */}
        <Flex gap={5} alignItems="center">
          <Avatar.Root size="2xl" w="24" h="24" bg="brand.500">
            <Avatar.Fallback color="white" fontSize="3xl" fontWeight="bold">
              {initials}
            </Avatar.Fallback>
          </Avatar.Root>
          
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="fg">
              {name} {lastname}
            </Text>
            <Text color="fg.muted" mb={3}>
              {email}
            </Text>
            
            <Flex gap={2}>
              {/* Badge del ciclo */}
              <Box px={2} py={0.5} bg="bg.subtle" color="fg" borderRadius="md" fontSize="xs" fontWeight="bold">
                {cycle}
              </Box>
              {/* Badge del nivel */}
              <Box px={2} py={0.5} bg="brand.500" color="white" borderRadius="md" fontSize="xs" fontWeight="bold">
                Nivel {currentLevel}
              </Box>
            </Flex>
          </Box>
        </Flex>

        {/* Puntos totales */}
        <Box textAlign={{ base: "left", sm: "right" }}>
          <Text fontSize="3xl" fontWeight="bold" color="brand.500">
            {xp}
          </Text>
          <Text fontSize="sm" color="fg.muted">
            Puntos totales
          </Text>
        </Box>

      </Flex>

      {/* Inserto la barra de XP */}
      <ProfileXPBar xp={xp} />
    </Box>
  );
};
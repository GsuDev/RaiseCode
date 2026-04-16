import { VStack, Box, Text, Button } from '@chakra-ui/react';
import { BookOpen, ChartColumnBig, Target, UserCog } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

interface SidebarItem {
  label: string;
  path: string;
  icon: any;
}

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: SidebarItem[] = [
    { label: 'Dashboard', path: '/admin/', icon: ChartColumnBig },
    { label: 'Usuarios', path: '/admin/users', icon: UserCog },
    { label: 'Retos', path: '/admin/challenges', icon: Target },
    { label: 'Asignaturas', path: '/admin/subjects', icon: BookOpen },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      as="aside"
      w={{ base: '100%', md: '250px' }}
      bg="bg.panel"
      borderRightWidth={{ base: '0', md: '1px' }}
      borderBottomWidth={{ base: '1px', md: '0' }}
      borderColor="border"
      display="flex"
      flexDirection="column"
      h={{ base: '100%' }}
      overflowY={{ base: 'hidden', md: 'auto' }}
      p={4}
    >

      <Box pb={3} mb={3} borderBottomWidth="1px" borderColor="border">
        <Text fontSize="lg" fontWeight="bold" color="fg" textAlign="center">
          Panel de Administración
        </Text>
      </Box>

      {/* Navigation Menu */}
      <VStack as="nav" gap={1} flex={1} mb={6}>
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
                key={item.path}
                w="full"
                variant={isActive(item.path) ? 'solid' : 'ghost'}
                colorScheme={isActive(item.path) ? 'brand' : 'gray'}
                justifyContent="flex-start"
                gap={3}
                onClick={() => navigate(item.path)}
                _hover={{
                bg: 'bg.subtle',
                }}
            >
                <Icon />
                <Text>{item.label}</Text>
            </Button>
          )
}        )}
      </VStack>
    </Box>
  );
};

import { useState } from 'react';
import { AdminSidebar } from '@/admin/components/AdminSidebar';
import { Outlet } from 'react-router';
import { Box, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { Menu, X } from 'lucide-react';

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box h="calc(100vh - 60px)" display="flex" position="relative">
      {/* Botón toggle para móvil - Fijo en la esquina */}
      {isMobile && (
        <IconButton
          aria-label={isSidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          position="fixed"
          top="70px"
          left={isSidebarOpen ? 'calc(250px + 1rem)' : '1rem'}
          zIndex={30}
          variant="ghost"
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border"
          color="fg"
          _hover={{
            bg: 'bg.subtle',
            borderColor: 'border.emphasized',
          }}
          _active={{
            bg: 'brand.500',
            color: 'white',
          }}
          size="lg"
          transition="all 0.3s ease"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </IconButton>
      )}

      {/* Sidebar - Oculto en móvil si no está abierto */}
      <Box
        display={isMobile && !isSidebarOpen ? 'none' : 'block'}
        position={isMobile ? 'fixed' : 'relative'}
        top={isMobile ? '60px' : '0'}
        left={isMobile ? '0' : '0'}
        bottom={isMobile ? '0' : 'auto'}
        zIndex={isMobile ? 20 : 'auto'}
        h={isMobile ? 'calc(100vh - 60px)' : '100%'}
        w={isMobile ? '250px' : '250px'}
        bg="bg.panel"
        borderRightWidth="1px"
        borderColor="border"
        overflowY="auto"
      >
        <AdminSidebar onClose={() => isMobile && setIsSidebarOpen(false)} />
      </Box>

      {/* Overlay en móvil */}
      {isMobile && isSidebarOpen && (
        <Box
          position="fixed"
          top="60px"
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.5)"
          zIndex={15}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <Box
        as="main"
        flex={1}
        overflow="auto"
        p={6}
        pt={isMobile ? '70px' : 6}
        w="full"
      >
        <Outlet />
      </Box>
    </Box>
  );
};
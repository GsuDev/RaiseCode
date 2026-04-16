import { AdminSidebar } from '@/admin/components/AdminSidebar';
import { Outlet } from 'react-router';
import { HStack, Box } from '@chakra-ui/react';

export const AdminLayout = () => {
  return (
    <HStack gap={0} h="93vh">
      <AdminSidebar />
      <Box as="main" flex={1} overflow="auto" p={6}>
        <Outlet />
      </Box>
    </HStack>
  );
};
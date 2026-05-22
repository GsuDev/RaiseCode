import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { Footer } from '@/raiseCode/components/Footer/Footer';
import { Box } from '@chakra-ui/react';
import { Outlet, useLocation, useNavigate } from 'react-router';

export const RaiseCodeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      <CustomJumbotron
        currentPage={location.pathname}
        onNavigate={(page) => navigate(page)}
      />
      <Box flex="1">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { Outlet, useLocation, useNavigate } from 'react-router';

export const RaiseCodeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <CustomJumbotron
        currentPage={location.pathname}
        onNavigate={(page) => navigate(page)}
      />
      <Outlet />
    </>
  );
};

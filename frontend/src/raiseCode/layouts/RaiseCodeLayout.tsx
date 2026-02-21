import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { Outlet } from "react-router";

export const RaiseCodeLayout = () => {
  return (
    <>
        <CustomJumbotron currentPage="/" onNavigate={() => {}} />
        <Outlet />
    </>      
  );
};
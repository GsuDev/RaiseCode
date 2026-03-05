import { RaiseCodeLayout } from '@/raiseCode/layouts/RaiseCodeLayout';
import { HomePage } from '@/raiseCode/pages/Home/HomePage';
import { RegisterPage } from '@/auth/Register/RegisterPage';
import { LoginPage } from '@/auth/Login/LoginPage';
import { CreateChallengePage } from '@/challenges/create/CreateChallengePage';
import { createBrowserRouter } from 'react-router';
import { SubjectsPage } from '@/raiseCode/pages/Subjects/SubjectsPage';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <RaiseCodeLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'registro',
        element: <RegisterPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'crear-reto',
        element: <CreateChallengePage />,
      },
      { path: 'asignaturas', 
        element: <SubjectsPage /> },
    ],
  },
]);

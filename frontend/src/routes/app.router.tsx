import { RaiseCodeLayout } from '@/raiseCode/layouts/RaiseCodeLayout';
import { HomePage } from '@/raiseCode/pages/Home/HomePage';
import { RegisterPage } from '@/raiseCode/pages/Register/RegisterPage';
import { createBrowserRouter } from 'react-router';

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
      // TODO: Añadir ruta /login cuando se implemente la HU de login
    ],
  },
]);

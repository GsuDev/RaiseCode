import { RaiseCodeLayout } from '@/raiseCode/layouts/RaiseCodeLayout';
import { HomePage } from '@/raiseCode/pages/Home/HomePage';
import { RegisterPage } from '@/auth/Register/RegisterPage';
import { LoginPage } from '@/auth/Login/LoginPage';
import { CreateChallengePage } from '@/Challenges/create/CreateChallengePage';
import { createBrowserRouter } from 'react-router';
import { SubjectsPage } from '@/raiseCode/pages/Subjects/SubjectsPage';
import { SubjectDetailPage } from '@/raiseCode/pages/Subjects/SubjectDetailPage';
import { ChallengeDetailPage } from '@/Challenges/detail/ChallengeDetailPage';
import { ChallengeSolverPage } from '@/Challenges/solver/ChallengeSolverPage';
import { ProfilePage } from '@/profile/ProfilePage';

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
      {
        path: 'asignaturas',
        element: <SubjectsPage />
      },
      {
        path: 'asignaturas/:id',
        element: <SubjectDetailPage />
      },
      {
        path: 'retos/:id',
        element: <ChallengeDetailPage />
      },
      {
        path: 'retos/:id/resolver',
        element: <ChallengeSolverPage/>
      },
      {
        path: 'perfil',
        element: <ProfilePage />

      }
    ],
  },
]);

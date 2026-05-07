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
import { RankingPage } from '@/ranking/RankingPage'; 
import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';
import { AdminChallengesPage } from '@/admin/pages/challenges/AdminChallengesPage';
import { AdminLayout } from '@/admin/layouts/AdminLayout';
import { AdminDashboardPage } from '@/admin/pages/dashboard/AdminDashboardPage';
import { AdminUsersPage } from '@/admin/pages/users/AdminUsersPage';
import { AdminSubjectsPage } from '@/admin/pages/subjects/AdminSubjectsPage';

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
        path: 'ranking', 
        element: <RankingPage />
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: 'retos/:id/resolver',
            element: <ChallengeSolverPage />,
          },
          {
            path: 'crear-reto',
            element: <CreateChallengePage />,
          },
          {
            path: 'perfil',
            element: <ProfilePage />,
          },
          {
            path: 'admin',
            element: <AdminRoute />,
            children: [
              { element: <AdminLayout />, children: [
                { index: true,              element: <AdminDashboardPage /> },
                { path: 'challenges',       element: <AdminChallengesPage /> },
                { path: 'users',            element: <AdminUsersPage /> },
                { path: 'subjects',         element: <AdminSubjectsPage /> },
              ]}
            ]
          }
        ],
      },
    ],
  },
]);
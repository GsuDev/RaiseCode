import './App.css';
import { RouterProvider } from 'react-router';
import { appRouter } from './routes/app.router';
import { AuthProvider } from './auth/context/AuthContext';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={appRouter} />
      {/* Toaster global — necesario para toaster.create() funcione en toda la app */}
      <Toaster />
    </AuthProvider>
  );
}

export default App;

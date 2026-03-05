import './App.css'
import { RouterProvider } from 'react-router'
import { appRouter } from './routes/app.router'
import { AuthProvider } from './auth/context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={appRouter} />
    </AuthProvider>
  )
}

export default App

import './App.css'
import { RouterProvider } from 'react-router'
import { appRouter } from './routes/app.router'

function App() {
  return (
    <>
        <RouterProvider router = {appRouter} />
    </>
  )
}

export default App

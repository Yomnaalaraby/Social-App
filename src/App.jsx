import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './Layouts/MainLayout'
import Feedpage from './Pages/Feedpage'
import Profile from './Pages/Profile'
import Login from './Pages/Login'
import NotFound from './Pages/NotFound'
import Register from './Pages/Register'
import SinglePost from './Pages/SinglePost'
import AuthLayout from './Layouts/AuthLayout'
import { HeroUIProvider } from '@heroui/react'
import AuthProvider from './Context/AuthContext'
import ProtectRoutes from './Components/ProtectRoutes/ProtectRoutes'
import AuthRoute from './Components/AuthRoute'
import PostDetails from './Pages/PostDetails'
import HomePage from './Pages/HomePage'

export default function App() {

  const Routes = createBrowserRouter([
    {
      path: '', element: <MainLayout />, children: [
        { index: true, element: <ProtectRoutes> <HomePage /> </ProtectRoutes> },
        { path: '/profile', element: <ProtectRoutes> <Profile /> </ProtectRoutes> },
        { path: '/notfound', element: <NotFound /> },
        { path: '/singlepost', element: <ProtectRoutes> <SinglePost /> </ProtectRoutes> },
        { path: '/post/:id', element: <ProtectRoutes> <PostDetails /> </ProtectRoutes> }
      ]
    },
    {
      path: '', element: <AuthLayout />, children: [
        { path: '/register', element: <AuthRoute> <Register /> </AuthRoute> },
        { path: '/login', element: <AuthRoute> <Login /> </AuthRoute> }

      ]
    }
  ])

  return <>
    <AuthProvider>
      <HeroUIProvider>
        <RouterProvider router={Routes}></RouterProvider>
      </HeroUIProvider>
    </AuthProvider>

  </>
}



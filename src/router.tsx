import { createBrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import CoursesPage from './routes/CoursesPage.tsx'
import CourseDetailPage from './routes/CourseDetailPage.tsx'
import DashboardPage from './routes/DashboardPage.tsx'
import AuthCallbackPage from './routes/AuthCallbackPage.tsx'
import LoginPage from './routes/LoginPage.tsx'
import NotFoundPage from './routes/NotFoundPage.tsx'
import RegisterPage from './routes/RegisterPage.tsx'
import RequireAuth from './routes/RequireAuth.tsx'
import TeacherDetailPage from './routes/TeacherDetailPage.tsx'
import TeachersPage from './routes/TeachersPage.tsx'

const router = createBrowserRouter([
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <App />,
        errorElement: <NotFoundPage />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'courses', element: <CoursesPage /> },
          { path: 'courses/:courseId', element: <CourseDetailPage /> },
          { path: 'teachers', element: <TeachersPage /> },
          { path: 'teachers/:teacherId', element: <TeacherDetailPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallbackPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router

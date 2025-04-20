import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './RootLayout'
import navRoutes from './constants/routes'
import ExerciseEditor from './pages/ExerciseEditor'
import RoutineEditor from './pages/RoutineEditor'

const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path: navRoutes.exercisesEditor.path,
        element: <ExerciseEditor />
      },
      {
        path: navRoutes.routineEditor.path,
        element: <RoutineEditor />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

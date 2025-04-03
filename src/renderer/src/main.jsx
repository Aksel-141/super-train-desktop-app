import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './RootLayout'
import navRoutes from './constants/routes'
import ExerciseEditor from './pages/ExerciseEditor'

const router = createBrowserRouter([
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
        path: navRoutes.workoutEditor.path,
        element: <h1>workout Editor</h1>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

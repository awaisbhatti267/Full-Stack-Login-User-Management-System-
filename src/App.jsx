// App.js

import './App.css'

import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

// Import Components


// Import Pages
import Homes from './Pages/Home/home';
import Login from './Pages/Login/login';
import Signup from './Pages/Signup/signup';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import ResetPassword from './Pages/ResetPassword/resetPassword'

// ✅ Layout component — shared Navbar + route content (Outlet)
const Layout = () => {
  return (
    <>

      <main>
        <Outlet /> {/* This renders child route pages */}
      </main>
    </>
  );
};

// ✅ Router setup
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/home', element: <Homes /> },
      { path: '/', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password/:token", element: <ResetPassword /> }
    ],
  },
]);

// ✅ App component
function App() {
  return <RouterProvider router={router} />;
}

export default App;

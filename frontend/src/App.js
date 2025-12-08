import { createBrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';
import { Component } from 'react';
import { RouterProvider } from 'react-router-dom';

function App() {
  const myRoutes= createBrowserRouter([
    {path:'',Component:Signup},
    {path:'/signup',Component:Signup},
    {path:'/login',Component:Login}
  ])
  return (
    <div>
      <RouterProvider router={myRoutes}></RouterProvider>
    </div>
  );
}

export default App;

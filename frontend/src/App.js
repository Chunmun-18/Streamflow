import { createBrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard/Dashboard';
import Home from './components/Dashboard/Home';
import MyVideo from './components/Dashboard/MyVideo'
import Upload from './components/Dashboard/Upload'

function App() {
  const myRoutes= createBrowserRouter([
    {path:'',Component:Signup},
    {path:'/signup',Component:Signup},
    {path:'/login',Component:Login},
    {path:'/dashboard',Component:Dashboard,children:[
      {path:'',Component:Home},
      {path:'home',Component:Home},
      {path:'upload',Component:Upload},
      {path:'my-videos',Component:MyVideo}
    ]}
  ])
  return (
    <div>
            <RouterProvider router={myRoutes}></RouterProvider>
            <ToastContainer/>
    </div>

  );
}

export default App;

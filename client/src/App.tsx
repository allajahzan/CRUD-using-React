import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/client/home/home';
import Login from './pages/client/login/login';
import AdminLogin from './pages/admin/login/login'
import Profile from './pages/client/profile/profile';
import Users from './pages/admin/users/users';
import Dashboard from './pages/admin/dashboard/dashboard';
import { UserContext, UserContextProvider, contextType } from './context/userContext';
import { AdminContext, AdminContexetProvider } from './context/adminContext';
import { useContext } from 'react';
import AddUser from './pages/admin/addUser/addUser';
import EditUser from './pages/admin/editUser/editUser';

function App() {
  return (
    <>
      <Routes>
        {/* user side */}
        <Route path='/*' element={
          <UserContextProvider>
            <UserRoutes />
          </UserContextProvider>
        } />

        {/* admin side */}
        <Route path='/admin/*' element={
          <AdminContexetProvider>
            <AdminRoutes />
          </AdminContexetProvider>
        } />
      </Routes>
    </>
  );
}


const UserRoutes = () => {

  const userContext: contextType | null = useContext(UserContext)

  return (
    <Routes>
      <Route path='*' element={<Navigate to='/login' />} />
      <Route path='' element={<Navigate to='/login' />} />
      <Route path='login' element={userContext?.isAuth ? <Navigate to='/home' /> : <Login />} />
      <Route path='home' element={userContext?.isAuth ? <Home /> : <Navigate to='/login' />} />
      <Route path='profile' element={userContext?.isAuth ? <Profile /> : <Navigate to='/login' />} />
    </Routes>
  )
}

const AdminRoutes = () => {

  const adminContext: contextType | null = useContext(AdminContext)

  return (
    <Routes>
      <Route path='' element={<Navigate to={'/admin/login'} />} />
      <Route path='login' element={adminContext?.isAuth? <Navigate to={'/admin/dashboard'}/> : <AdminLogin />} />
      <Route path='dashboard' element={adminContext?.isAuth? <Dashboard/> : <Navigate to={'/admin/login'}/>}  />
      <Route path='users' element={adminContext?.isAuth? <Users/> : <Navigate to={'/admin/login'}/>}  />
      <Route path='addUser' element={adminContext?.isAuth? <AddUser/> : <Navigate to={'/admin/login'}/>}  />
      <Route path='edit/:name' element={adminContext?.isAuth? <EditUser/> : <Navigate to={'/admin/login'}/>}  />
    </Routes>
  )
}

export default App


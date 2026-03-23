import { Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import Navbar from './common/Navbar'
import Footer from './common/Footer'
import HomePage from './pages/HomePage'
import ProtectedRoute from './Auth/ProtectedRoute'
import BuilderPage from './pages/BuilderPage'
import { ResumeProvider } from './context/ResumeContext'

function App (){
  const location = useLocation();
  return (
    <AuthProvider>
      <ResumeProvider>
        <div className="min-h-screen flex flex-col bg-linear-to-br from-gray-900 via-gray-800 to-black text-white">
          {(location.pathname !== '/login' && location.pathname !== '/register') && <Navbar/>}
          <main className = "grow">
            <Routes>
              <Route path = '/register' element = {<RegisterPage/>}/>
              <Route path = '/login' element = {<LoginPage/>}/>
              <Route path = '/' element = {<HomePage/>} />
              <Route path = '/builder' element = {<ProtectedRoute><BuilderPage/></ProtectedRoute>} />
            </Routes>
          </main>
          {(location.pathname !== '/login' && location.pathname !== '/register') &&<Footer/>}
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </ResumeProvider>
    </AuthProvider>
  )
}

export default App

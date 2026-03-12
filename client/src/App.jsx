import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'

function App (){
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-linear-to-br from-gray-900 via-gray-800 to-black text-white">
        <main className = "grow">
          <Routes>
            <Route path = '/register' element = {<RegisterPage/>}/>
            <Route path = '/login' element = {<LoginPage/>}/>
          </Routes>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  )
}

export default App

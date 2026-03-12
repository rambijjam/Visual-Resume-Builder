import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom'
import { register as registerService} from "../services/authService";
import { toast } from "react-toastify";


const Register =  ()=>{
    const [formData, setFormData] = useState({name : '', email : '', password : ''});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e)=>{
        setFormData({...formData, [e.target.name] : e.target.value})
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()

        setLoading(true);
        try{
            const res = await registerService(formData.name, formData.email, formData.password);
            login(res.data.token, res.data.user)
            toast.success('Account created successfully!')
            navigate('/builder')
        }catch(err){
            console.log(err)
            toast.error(err.response?.data?.message || 'Registration failed')
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md w-full rounded-xl bg-white/5 p-8 shadow-lg outline-1 outline-white/10">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
                <label className="block text-sm font-medium text-white mb-2">
                    Full Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-white mb-2">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-white mb-2">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                />
                </div>

                <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50"
                >
                {loading ? "Creating account..." : "Register"}
                </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
                Login
                </Link>
            </p>
        </div>
    )
}

export default Register
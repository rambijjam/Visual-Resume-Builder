import { useState } from "react"
import { login as loginService} from "../services/authService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = ()=>{
    const [FormData, setFormData] = useState({email : '', password : ''});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate()

    const handleChange = (e)=>{
        setFormData({...FormData, [e.target.name] : e.target.value});
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);

        try{
            const res = await loginService(FormData.email, FormData.password);
            login(res.data.token, res.data.user);
            toast.success('Login Successful');
            navigate('/builder');
        }catch(error){
            console.log(error);
            toast.error(error.response?.data?.message || 'Login Failed');
        }finally{
            setLoading(false);
        }
    }   

    return (
    <div className="max-w-md w-full rounded-xl bg-white/5 p-8 shadow-lg outline outline-white/10">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
                <label className="block text-sm font-medium text-white mb-2">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    value={FormData.email}
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
                    value={FormData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                />
                </div>

                <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50"
                >
                {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
                Don't have an account?{" "}
                <Link
                to="/register"
                className="font-semibold text-indigo-400 hover:text-indigo-300"
                >
                Register
                </Link>
            </p>
        </div>
    )
}

export default Login
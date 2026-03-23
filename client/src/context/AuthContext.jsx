import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext(null);

const isTokenValid = (token)=>{
    try{
        const decoded = jwtDecode(token);
        return decoded.exp*1000 > Date.now();
    }catch{
        return false;
    }
}

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }

    useEffect(()=>{
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        if( storedUser && token && isTokenValid(token)){
            setUser(JSON.parse(storedUser));
        }else{
            logout();
        }
        setLoading(false);
    }, [])

    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(!token) return ;
        try{
            const decoded = jwtDecode(token);
            const expiryTime = decoded.exp*1000 - Date.now();

            if(expiryTime<=0) logout();
            else{
                const timer = setTimeout(logout, expiryTime);
                return ()=>clearTimeout(timer);
            }
        }catch{
            logout();
        }
    },[user]);

    const login = (token, userData)=>{
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    }

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value = {{user, login, logout, isAuthenticated, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuth must be used within AuthProvider')
    return context;
}

export default AuthContext
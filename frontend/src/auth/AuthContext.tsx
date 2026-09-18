import {
    useEffect,
    useState
} from "react"
import type { ReactNode } from "react"
import api from "../api/axios"
import { AuthContext } from './useAuth'
import type { User } from './useAuth'

export const AuthProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const loadUser = async() => {
            const token = localStorage.getItem("accessToken")
            if(!token){
                setLoading(false)
                return
            }
            try{
                const response = await api.get("/auth/me")
                setUser(response.data.user)
            }catch{
                localStorage.removeItem("accessToken")
                setUser(null)
            }finally {
                setLoading(false)
            }
        }
        loadUser()
    }, [])
    const login = async(email: string, password: string) => {
        const response = await api.post("/auth/login", {
            email, password
        })
        const { token, user } = response.data
        localStorage.setItem("accessToken", token)
        setUser(user)
    }
    const logout = ()=> {
        localStorage.removeItem("accessToken")
        setUser(null)
    }
    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

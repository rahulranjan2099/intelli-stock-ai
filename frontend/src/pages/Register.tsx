import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios"

const Register = () => {
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setError("")
        setLoading(true)
        try{
            await api.post("/auth/register", {
                name,
                email,
                password,
            })
            navigate("/login")
        }catch(err){
            console.error(err)
            setError("Unable to register user")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="auth-page">
            <h1>Create Account</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(event)=>setName(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(event)=>setEmail(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(event)=>setPassword(event.target.value)}
                        required
                    />
                </div>
                {error && <p>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                </button>
            </form>

            <p>
                Already have an account?{" "}
                <Link to="/login">Login</Link>
            </p>
        </div>
    )
}

export default Register;

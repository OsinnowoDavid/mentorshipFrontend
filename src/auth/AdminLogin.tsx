import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useShopContext } from '../context'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

function AdminLogin() {
    const navigate = useNavigate()
    interface LoginResponse {
        token: string,
        user: {
            id: string,
            name?: string,
            email: string,
            role: string
        }
    }

    const context = useShopContext()
    const backendUrl = context?.backendUrl || ""
    const { login } = useAuth()
    
    // Get the intended destination from location state
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        
        try {
            const response = await axios.post<LoginResponse>(`${backendUrl}/api/auth/login`, {
                email, password
            })
            
                    if (response.status === 200 && response.data.user.role==="admin"    ) {
            // Use the auth context to handle login
            login(response.data.token, response.data.user)
            // Navigate to the intended destination or home
            navigate("/adminDashboard")
        }
            // if(response.data.user.role==="admin"){
            //     navigate("/admin")
            // }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='mt-10 justify-self-center mx-auto'>
            <h1 className='justify-self-center justify-center font-bold text-2xl'>Admin Login page</h1>
            <form className='max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg' onSubmit={submit}>
                <h1 className='text-xl font-bold text-center'>Login to your account</h1>
                
                {error && (
                    <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
                        {error}
                    </div>
                )}
                
                <div className='mb-4'>
                    <label htmlFor='email' className='block text-gray-600 mb-2'>
                        Email address
                    </label>
                    <input 
                        id="email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        type='email' 
                        placeholder='Enter your email address' 
                        required 
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        disabled={isLoading}
                    />
                </div>
                
                <div className='mb-6'>
                    <label htmlFor='password' className='block text-gray-600 mb-2'>
                        Password
                    </label>
                    <input 
                        id="password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        type='password'  
                        placeholder='Enter your password' 
                        required 
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        disabled={isLoading}
                    />
                </div>
                
                <button 
                    type='submit' 
                    className='w-full mt-5 text-lg bg-blue-500 text-white py-3 px-6 rounded-lg focus:outline-none hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors'
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}

export default AdminLogin

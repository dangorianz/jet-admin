/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { auth } from "@/config/firebase/firebaseConfig"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { Button, IconButton, InputAdornment, TextField } from "@mui/material"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Cookies from 'js-cookie';


export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [formLogin, setFormLogin] = useState({
        email:'',
        password:''
    })

    const { email, password } = formLogin;

    const onChangeForm = (e: any) => {
        setFormLogin({
            ...formLogin,
            [e.target.name]: e.target.value
        })
    }

    const login = async (e:any) => {
        e.preventDefault()
        try {
           const userCredential = await signInWithEmailAndPassword(auth, email, password);
           console.log('---userCredential---', userCredential);
           const token = await userCredential.user.getIdToken();

           Cookies.set('token', token, { expires: 1 });
           router.push('/')
        } catch (error) {
            console.log('error', error);
        }
    }

    return (
        <div className="h-screen w-full flex justify-center items-center bg-gray-100"> 
            <div className="shadow rounded-lg p-8 min-w-96 bg-white">
                <div className="flex flex-col">
                    <h1 className="text-center text-2xl font-bold mb-2">Bienvenido a JET</h1>
                    <p className="text-center text-gray-500 mb-5">Please sign-in to your account</p>
                    <form className="flex flex-col" action="" onSubmit={login}>
                        <TextField sx={{marginY: '8px'}} name="email" value={email} onChange={onChangeForm} variant="standard" placeholder="micorre@gmail.com" label="email" type="email"/>
                        <TextField name="password" value={password} onChange={onChangeForm} variant="standard" placeholder="****" label="password"
                            sx={{
                                marginY: '8px'
                            }} 
                            type={showPassword ? 'text' : 'password'}
                            slotProps={{
                                input:{
                                    endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            }}
                        />
                        <Button type="submit" sx={{marginTop:'40px', marginBottom:'20px'}} variant="contained">Login</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

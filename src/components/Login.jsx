import React, { useState } from 'react'
import Header from './Header';
import axios from "axios";
import { API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast"
import {useNavigate} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux";
import { setLoading, setUser } from '../redux/userSlice';


const Login = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isLoading = useSelector(store=>store.app.isLoading);
 
    const loginHandler = () => {
        setIsLogin(!isLogin);
    }
    const getInputData = async (e)=>{
        e.preventDefault();
        dispatch(setLoading(true));
        if(isLogin){
            //login
            const user = {email,password}; 
            try {
                const res = await axios.post(`${API_END_POINT}/login`, user,{
                    headers:{
                        'Content-Type':'application/json'
                    },
                    withCredentials:true
                });
                if(res.data.success){
                    toast.success(res.data.message);
                }
                dispatch(setUser(res.data.user));
                navigate("/browse");
            } catch (error) {
                toast.error(error.response.data.message);
                console.log(error);
            } finally {
                dispatch(setLoading(false));
            }
        }else{
            //register
            dispatch(setLoading(true));
            const user = {fullName, email, password};
            try {
                const res = await axios.post(`${API_END_POINT}/register`,user,{
                    headers:{
                        'Content-Type':'application/json'
                    },
                    withCredentials:true
                });
                if(res.data.success){
                    toast.success(res.data.message);
                }
                setIsLogin(true);
            } catch (error) {
                toast.error(error.response.data.message);
                console.log(error);
            } finally{
                dispatch(setLoading(false));
            }
        }
        setFullName("");
        setEmail("");
        setPassword("");
    }
    
    return (
        <div>
            <Header />
            <div className='absolute flex w-screen'>
                <img className='w-[100vw] h-[100vh] bg-cover' src="https://assets.nflxext.com/ffe/siteui/vlv3/dc1cf82d-97c9-409f-b7c8-6ac1718946d6/14a8fe85-b6f4-4c06-8eaf-eccf3276d557/IN-en-20230911-popsignuptwoweeks-perspective_alpha_website_medium.jpg" alt="banner" />
            </div>
            <form onSubmit={getInputData} className='flex flex-col w-[40%] p-3 py-8 justify-center rounded-lg mt-[10%] left-0 right-0  mx-auto items-center  absolute  bg-[#54594c] opacity-90'>
                <h1 className='text-3xl text-white mb-5 font-bold'>{isLogin ? "Login" : "Sign Up"}</h1>
                <div className='flex flex-col'>
                    {
                        !isLogin && <input value={fullName} onChange={(e)=>setFullName(e.target.value)} type='text' placeholder='Fullname' className='outline-none p-3 my-2 bg-[#3f4122] text-white rounded-lg' />
                    }
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} type='email' placeholder='Email' className='outline-none p-3 items-center my-2 rounded-lg bg-[#3f4122] text-white' />
                    <input value={password} onChange={(e)=>setPassword(e.target.value)} type='password' placeholder='Password' className='outline-none p-3 my-2 rounded-lg bg-[#3f4122] text-white' />
                    <button type='submit' className='bg-[#d1e2c4] mt-6 p-3 text-gray-800 rounded-lg font-medium'>{`${isLoading ? "loading...":(isLogin?"Login":"Sign Up")}`}</button>
                    <p className='text-white mt-2 px-1 flex'>{isLogin ? "New to MovieHub?" : "Already have an account?"}<span onClick={loginHandler} className='ml-1 text-white font-medium cursor-pointer'>{isLogin ? "Signup" : "Login"}</span></p>
                </div>
            </form>
        </div>
    )
}

export default Login
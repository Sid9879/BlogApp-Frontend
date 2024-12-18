import { useEffect, useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Home from './pages/Home'
import Signup from './pages/Signup'
import {BrowserRouter,Routes,Route, Navigate} from 'react-router-dom'
import Navbar from './Component/Navbar'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { updateUser } from './store/UserSlice'
import ForgetPassword from './pages/ForgetPassword'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Profile from './pages/Profile'
import FriendProfile from './pages/FriendProfile'
import Chat from './pages/Chat'
import PageNotFound from './pages/PageNotFound'
// import FriendComponent from './FriendComponent'




function App() {
let dispatch = useDispatch();
  let userStore = useSelector((state)=>state.user)
// console.log(userStore)
let login = userStore.login
// console.log(login)

const getUserDetails = async()=>{
  let res = await axios.get('https://blogapp-anlu.onrender.com/users/getUser',{
    headers:{
      "Authorization":userStore.token
    }
  })
  let data = res.data
  // console.log(data)
  dispatch(updateUser(data))
}
useEffect(()=>{
  if(userStore.token){
    getUserDetails()
   }
},[userStore.token])

  return (
    <>
  
       <BrowserRouter>
       <div className='mb-[64px]'>
       <Navbar/>
       </div>
       <Routes>
        <Route path="/" element={login===true?<Home/>:<Navigate to = {'/login'}/>}/>
        <Route path="/login" element={login===false?<Login/>:<Navigate to = {"/"}/>} />
        <Route path = "/signup" element = { <Signup/>}/>
        <Route path = "/forgetPassword" element = {<ForgetPassword/>}/>
        <Route path = "/profile"  element = {login===true? <Profile  getUserDetails={getUserDetails}/>:<Navigate to = {'/login'}/>}/>
        
        <Route path = "/FriendProfile" element = {login===true?<FriendProfile getUserDetails={getUserDetails}  />:<Navigate to = {'/'}/> }/>
        <Route path = "/chat" element = {login===true?<Chat   />:<Navigate to = {'/'}/> }/>
        <Route path = "/*" element = {login===true?<PageNotFound/>:<Navigate to ={'/login'}/>}/>
        
       </Routes>
       {/* <FriendComponent/> */}
       <ToastContainer/>
       </BrowserRouter>
    </>
  )
}

export default App

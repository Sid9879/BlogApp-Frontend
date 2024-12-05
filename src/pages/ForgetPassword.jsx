import React, { useRef, useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';

const ForgetPassword = () => {
  let emailRef = useRef();

  const handleSubmit = async(e)=>{
    e.preventDefault()
   let value=emailRef.current.value
    // console.log(value)
    let res = await axios.post('https://blogapp-anlu.onrender.com/users/resetPassword',{email:value});

    email:emailRef.current.value=''
    let data = res.data
    console.log(data)
    if(data.msg){
      toast.success(data.msg,{position:"top-center",theme:"dark"})
    }
    else{
      toast.error(data.msg,{position:"top-center",theme:"dark"})
      
    }
  }
  return (
    <div>
    <main id="content" role="main" className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Forgot password?</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{" "}
              <Link
                className="text-blue-600 decoration-2 hover:underline font-medium"
                to="/login"
              >
                Login here
              </Link>
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      ref={emailRef}
                      type="email"
                      id="email"
                      name="email"
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                      required
                      aria-describedby="email-error"
                      placeholder="Enter your email"
                    />
                  </div>
                  {/* <p
                    className="hidden text-xs text-red-600 mt-2"
                    id="email-error"
                  >
                    Please include a valid email address so we can get back to
                    you
                  </p> */}
                </div>

                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                >
                  Reset password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <p className="mt-3 flex justify-center items-center text-center divide-x divide-gray-300 dark:divide-gray-700">
        <Link
          className="pl-3 inline-flex items-center gap-x-2 text-sm text-gray-600 decoration-2 hover:underline hover:text-blue-600 dark:text-gray-500 dark:hover:text-gray-950"
          to="#"
        >
          Contact us!
        </Link>
      </p>
    </main>

    <div className="message-container">
      <p className="message">
        Didn’t receive the reset password link in your email? It might have
        ended up in your spam or junk folder. Please check there, and if you
        still can’t find it, feel free to request a new link.
      </p>
    </div>
  </div>


  )
}

export default ForgetPassword

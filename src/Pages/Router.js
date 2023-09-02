import React, { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import PrivateRoute from "../Components/PrivateRoute"

import Frontend from "./Frontend"
import Auth from "./Auth"
import { useAuthContext } from '../Context/AuthContext'
import { Spin } from 'antd'

export default function Router() {

  const { isAuth } = useAuthContext()
  return (
    <>
        <Routes>
        <Route path='/*' element={<PrivateRoute Component={Frontend} />} />
        <Route path='/Auth/*' element={!isAuth ? <Auth /> : <Navigate to={"/"} />} />
        {/* <Route path='/*' element={<Frontend/>}/> */}
      </Routes>
      
      
    </>
  )
}

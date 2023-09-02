import React from 'react'
import { useLocation , Navigate} from 'react-router-dom'
import { useAuthContext } from '../Context/AuthContext'


export default function PrivateRoute({Component}) {
const location = useLocation()
const {isAuth} = useAuthContext()

if(!isAuth){
    return <Navigate to ='/auth/register'  state={{ from: location.pathname }}  replace/>
}
  return (
    <>
    <Component/>
    </>
  )
}

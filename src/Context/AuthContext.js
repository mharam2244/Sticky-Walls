import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { auth } from '../config/firesbase';
import { Spin } from 'antd';


const AuthContext = createContext()
const initialState = { isAuth: false }
const reducer = (state, { type, payload }) => {
    
    switch (type) {
        case "LOGIN":
            return { isAuth: true, user: payload }
        case "LOGOUT":
            return { isAuth: false }
        default:
            return state
    }
}
export default function AuthContextProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState)
    useEffect(() => {

        onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch({ type: "LOGIN", payload: { user } })
            }
               
            
        })
    }, [])
    return (
        <AuthContext.Provider value={{ ...state, dispatch, reducer }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)
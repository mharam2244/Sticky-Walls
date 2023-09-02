import { Button, Col, Form, Input, Row, message } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../../../config/firesbase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const initialState = {
    email: "",
    password: "",
}

export default function Login() {
    const [user, setUser] = useState(initialState)

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const handleLogin = () => {
        const { email, password } = user
if (email && password) {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        message.success("Logged In")
        console.log("Logged In")
    })
    .catch((error) => {
        message.error("Something Went Wrong")
        console.log(error)
    });
    setUser(initialState)
    
    } else {
    message.warning("Please fill all inputs")
    }
}
    return (
        <div className='container w-50'>
            <div className=" text-center">
                <Col className="my-3">
                    <Title>Login Page</Title>
                    <Form className='my-3'>
                        <FormItem>
                            <Input name='email' placeholder='Email' type='email' onChange={handleChange} />
                        </FormItem>
                        <FormItem>
                            <Input name='password' placeholder='Password' type='password' onChange={handleChange} />
                        </FormItem>
                        <FormItem className='my-1'>
                            <Link >
                                <Button type='primary' className='w-50' onClick={handleLogin}>Login</Button>
                            </Link>
                        </FormItem>
                        <Link to={"/auth/register"}>Not a User Yet?</Link>
                    </Form>
                </Col>
            </div>

        </div>
    )
}

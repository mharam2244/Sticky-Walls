import React, { useState } from 'react';
import { Button, Col, Form, Input, message } from 'antd';
import Title from 'antd/es/typography/Title';
import { Link } from 'react-router-dom';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from '../../../config/firesbase';
import { useAuthContext } from "../../../Context/AuthContext";
import { doc, setDoc } from 'firebase/firestore/lite';
import FormItem from 'antd/es/form/FormItem';

const initialState = {
    fullName: "",
    email: "",
    password: "",
    dob: "",
};

export default function Register() {
    const [register, setRegister] = useState(initialState);
    const [reTypePassword , setReTypePassword ] = useState("")
    const { dispatch } = useAuthContext();

    const handleChange = (e) => {
        setRegister({ ...register, [e.target.name]: e.target.value });
    };

    const addUserDoc = async (user) => {
        const { fullName, dob, email } = register;
        const finalUser = {
            fullName,
            dob,
            email,
            uid: user.uid
        };
        try {
            await setDoc(doc(firestore, "users", user.uid), finalUser);
            dispatch({ type: "LOGIN" });
        } catch (error) {
            console.log(error);
        }
    };

    const handleRegister = () => {
        const { email, password } = register;
        if (email && password && password === reTypePassword) {
          
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    message.success("Registered");
                    const user = userCredential.user;
                    addUserDoc(user);
                })
                .catch((error) => {
                    console.log(error);
                    message.error("Something Went Wrong");
                })
            } else if (password !== reTypePassword) {
                message.warning("Passwords do not match");
            } else {
                message.warning("Please fill all inputs");
            }
        };

    return (
        <div className='container w-50'>
            <div className=" text-center">
                <Col className="my-3">
                    <Title>Register Page</Title>
                    <Form className='my-3'>
                        <FormItem >
                            <Input placeholder='Full Name' name='fullName' onChange={handleChange} value={register.fullName} type='text' />
                        </FormItem>
                        <FormItem className='mb-0'>
                            <Input placeholder='Email' name='email' onChange={handleChange} value={register.email} type='email' />
                        </FormItem>
                        <FormItem label="Date of Birth" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} className='p-0'>
                            <Input type='date' placeholder='Date of Birth' name='dob' onChange={handleChange} value={register.dob} />
                        </FormItem>
                        <FormItem>
                            <Input placeholder='Password' name='password' onChange={handleChange} value={register.password} type='password' />
                        </FormItem>
                        <FormItem>
                            <Input placeholder='Re-Type Password' type='password' onChange={(e)=>{setReTypePassword(e.target.value)}} />
                        </FormItem>
                        <FormItem className='my-1'>
                            <Button type='primary' className='w-50' onClick={handleRegister} >Register</Button>
                        </FormItem>
                        <Link to={"/auth/login"}>Already have an Account</Link>
                    </Form>
                </Col>
            </div>

        </div>
    );
}

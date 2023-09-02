import { Button, Form, Input, message } from 'antd'
import { signOut } from 'firebase/auth'
import React from 'react'
import { auth, firestore } from '../../../config/firesbase'
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuthContext } from '../../../Context/AuthContext';
import FormItem from 'antd/es/form/FormItem';
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore/lite';

const colorList = ["#ccd5ae", "#faedcd", "#d4a373", "#e9edc9", "#e3d5ca", "#fed9b7", "#ffbf69", "#ede0d4",
    "#eddea4", "#adb5bd", "#ccc5b9", "#eee4e1", "#e6beae", "#83c5be", "#bcb8b1", "#d9d9d9", "#d9dcd6", "#bfd8bd", "#ffe6a7", "#daf0ee",
    "#e0fbfc", "#b7b7a4", "#ddbea9", "#c6c5b9", "#7b9e89", "#efe6dd", "#efe5dc", "#cbbaa9", "#fde2e4", "#8d99ae", "#f9dcc4",
]

const initialState = {
    title: "",
    location: "",
    date: "",
    description: "",
    status: "",
}
export default function AddStick() {
    const [sticks, setSticks] = useState(initialState)

    const currentUser = auth.currentUser;


    const { dispatch } = useAuthContext()
    const handleLogOut = () => {
        signOut(auth).then(() => {
            dispatch({ type: "LOGOUT" })
            message.info("Logged Out")
        }).catch((error) => {
            console.log(error)
        })
    }

    const handlechange = (e) => {
        setSticks({ ...sticks, [e.target.name]: e.target.value })

    }

    const randomIndex = Math.floor(Math.random() * colorList.length)

    const randomId = Math.random().toString(36).slice(2)

    const handleAdd = async () => {

        setSticks(initialState)
        const { title, date, description, location } = sticks
        const finalSticks = {
            title, date, description, location,
            bgColor: colorList[randomIndex],
            id: randomId,
            uid: currentUser.uid
        }
        if (finalSticks.title && finalSticks.location && finalSticks.description && finalSticks.date) {
            try {
                await setDoc(doc(firestore, "Sticks", finalSticks.id), finalSticks);
                message.success("Stick Added Successfully", 2)
            } catch (e) {
                console.log("This is Error", e)
                message.error("Something Went Wrong")
            }
            setSticks(initialState)
        } else {
            message.warning("Please Fil All Inputs")
        }
    }
    return (
        <div>
            <header className="container bg-light py-3">
                <h1 className='d-inline'>Add Stick</h1>
                <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogOut} className='float-end sm-me-0 me-5'>Logout</Button>
            </header>
            <main>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Form className='m-3'>
                                <FormItem>
                                    <Input type='text' placeholder='Title' name='title' value={sticks.title} onChange={handlechange} className='' />
                                </FormItem>
                                <FormItem>
                                    <Input type='location' placeholder='Location' name='location' value={sticks.location} onChange={handlechange} className='' />
                                </FormItem>
                                <FormItem>
                                    <Input type='text' placeholder='Description' name='description' value={sticks.description} onChange={handlechange} className='' />
                                </FormItem>
                                <FormItem>
                                    <Input type='date' placeholder='Date' name='date' value={sticks.date} onChange={handlechange} className='my-1 w-100' />
                                </FormItem>
                                <FormItem>
                                    <Button className='w-50 offset-3' type='primary' onClick={handleAdd}>Add Stick</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

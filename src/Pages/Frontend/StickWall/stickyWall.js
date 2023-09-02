import { Button, Col, DatePicker, Dropdown, Form, Input, Menu, Modal, Row, Space, message } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import React, { useCallback, useEffect, useState } from 'react'
import { collection, getDocs, doc, setDoc, deleteDoc, where } from "firebase/firestore/lite";


import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { async } from '@firebase/util';
import { auth, firestore } from '../../../config/firesbase';
import { useAuthContext } from '../../../Context/AuthContext';
import MenuItem from 'antd/es/menu/MenuItem';
import { signOut } from 'firebase/auth';



const colorList = ["#ccd5ae", "#faedcd", "#d4a373", "#e9edc9", "#e3d5ca", "#fed9b7", "#ffbf69", "#ede0d4",
    "#eddea4", "#adb5bd", "#ccc5b9", "#eee4e1", "#e6beae", "#83c5be", "#bcb8b1", "#d9d9d9", "#d9dcd6", "#bfd8bd", "#ffe6a7", "#daf0ee",
    "#e0fbfc", "#b7b7a4", "#ddbea9", "#c6c5b9", "#7b9e89", "#efe6dd", "#efe5dc", "#cbbaa9", "#fde2e4", "#8d99ae", "#f9dcc4",
]
const initialState = {
    title: "",
    location: "",
    date: "",
    description: "",
    status:""  ,
}


export default function StickyWall() {
    const [sticks, setSticks] = useState(initialState)
    const [modal, setModal] = useState(false)
    const [edit, setEdit] = useState(false)
    const [editStick, setEditSticks] = useState(initialState)
    const [sticksFromFirebase, setSticksFromFirebase] = useState([])
    const { dispatch, user } = useAuthContext()

    const currentUser = auth.currentUser;

    const fromFireStore = async () => {
        
        const arr = [];
        const querySnapshot = await getDocs(collection(firestore, "Sticks"));
        querySnapshot.forEach((doc) => {
            let data = doc.data()
            arr.push(data)
        });
        let filtered = arr.filter((stick) => {
            return stick.uid === currentUser.uid
        })
        setSticksFromFirebase(filtered)
    }


    const handlechange = (e) => {
        edit ?
            setEditSticks({ ...editStick, [e.target.name]: e.target.value }) 
            :
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
            setModal(false)
        } else {
            message.warning("Please Fil All Inputs")
        }
    }

    const handleUpdate = async () => {
        try {
            await setDoc(doc(firestore, "Sticks", editStick.id), editStick);
            message.success("Stick Successfully Edited")
        } catch (error) {
            console.log(error)
            message.error("Something Went Wrong")
        }

        setEdit(false)
        setModal(false)
    }
    const handleEdit = (stick) => {
        setEditSticks({ ...stick })
        setEdit(true)
        setModal(true)
    };


    const handleDelete = async (stick) => {
        message.loading("Stick Deleting", .5)
        await deleteDoc(doc(firestore, "Sticks", stick.id))
        message.success("Stick Deleted Successfully")
    }

    const openModal = () => {
        setSticks(initialState)
        setModal(true)
    }
    const handleLogOut = () => {
        signOut(auth).then(() => {
          dispatch({ type: "LOGOUT" })
          message.info("Logged Out")
        }).catch((error) => {
          console.log(error)
        })}
    useEffect(() => {
        fromFireStore()
    }, [handleDelete, handleUpdate, handleAdd])
    return (
        <>
            <header className="container bg-light py-3">
                <h1 className='d-inline' >All Sticky Walls</h1>
                <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogOut} className='float-end sm-me-0 me-5'>Logout</Button>
            </header>
            <main>
                <div className="container sticks-container">

                    {sticksFromFirebase.map((stick, i) => {
                        return <>
                            <div key={i} className="card p-3 sticksCard m-1 xs-11 sm-5 md-3 lg-3 xxl-2" style={{
                                background: stick.bgColor,
                                whiteSpace: 'normal'
                            }}>

                                <Dropdown className='float-end bg-transparent border-0 p-0 text-3' overlay={<Menu>
                                    <Menu.Item key={"Edit"} onClick={() => { handleEdit(stick) }}>Edit</Menu.Item>
                                    <Menu.Item key={"Delete"} onClick={() => { handleDelete(stick) }}>Delete</Menu.Item>
                                </Menu>} placement="bottomRight">
                                    <button className="ellipsis-button">
                                        <DownOutlined />
                                    </button>
                                </Dropdown>
                                <p className='p-0 m-0'><b><u>Title</u></b></p>
                                {stick.title}
                                <p className='p-0 m-0' ><b><u>Description</u></b></p>
                                {stick.description}
                                <p className='p-0 m-0' ><b><u>Location</u></b></p>
                                {stick.location}
                                <p className='p-0 m-0' ><b><u>Date</u></b></p>
                                {stick.date}
                                <p className='p-0 m-0' ><b><u>Status</u></b></p>
                                {stick.status}
                            </div>

                        </>
                    })
                    }
                    <div className='m-2 xs-11 sm-5 md-3 lg-3 xxl-2'>
                        <button onClick={openModal} className="card sticksCard addButton p-3 h-100 w-100">
                            <i className="fa-solid fa-circle-plus plusIcon"></i>
                        </button>

                    </div>

                </div>
                <Modal
                    open={modal}
                    okText={edit ? "Update" : "Add"}
                    onOk={edit ? handleUpdate : handleAdd}
                    onCancel={() => { setModal(false); setEdit(false) }}
                    className='' >
                    <Form className='m-3'>
                        <FormItem>
                            <Input type='text' placeholder='Title' name='title' value={edit ? editStick.title : sticks.title} onChange={handlechange} className='my-1 in' />
                            <Input type='location' placeholder='Location' name='location' value={edit ? editStick.location : sticks.location} onChange={handlechange} className='my-1 in' />
                            <Input type='text' placeholder='Description' name='description' value={edit ? editStick.description : sticks.description} onChange={handlechange} className='my-1 in' />
                            <Input type='date' placeholder='Date' name='date' value={edit ? editStick.date : sticks.date} onChange={handlechange} className='my-1 w-100 in' />
                        </FormItem>
                    </Form>
                </Modal>
            </main >
        </>
    )
}

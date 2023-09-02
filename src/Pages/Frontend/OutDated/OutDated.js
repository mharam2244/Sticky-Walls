import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore/lite';
import React, { useEffect, useState } from 'react'
import { auth, firestore } from '../../../config/firesbase';
import { Dropdown, Form, Input, Menu, Modal, message, Button } from 'antd';
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
import FormItem from 'antd/es/form/FormItem';
import Title from 'antd/es/typography/Title';
import { useAuthContext } from '../../../Context/AuthContext';
import { signOut } from 'firebase/auth';


const currentDate = new Date();
const formattedDate = currentDate.toISOString().slice(0, 10);

const initialState = {
  title: "",
  location: "",
  date: "",
  description: "",
}
export default function Today() {
  const [fromFirebase, setFromFirebase] = useState([])
  const [editStick, setEditSticks] = useState(initialState)
  const [modal, setModal] = useState(false)
const currentUser = auth.currentUser
  const fromFireStore = async () => {
    const arr = [];
    const querySnapshot = await getDocs(collection(firestore, "Sticks"));
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      arr.push(data)
    });
    let todaySticks = arr.filter((stick) => {
      return stick.date < formattedDate && stick.uid === currentUser.uid
    })
    setFromFirebase(todaySticks)
  }



  const handlechange = (e) => {
    setEditSticks({ ...editStick, [e.target.name]: e.target.value })

  }
  const handleEdit = (stick) => {
    setModal(true)
    setEditSticks({ ...editStick })
    setEditSticks(stick)
  }
  const handleDelete = async (stick) => {
    message.loading("Stick Deleting", .5)
    try {
      await deleteDoc(doc(firestore, "Sticks", stick.id));
      message.success("Stick Deleted Successfully")

    } catch (error) {
      console.log(error)
      message.error("Something went wrong while Deleting Stick")
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
    setModal(false)
  }
  useEffect(() => {
    fromFireStore()
  }, [handleDelete || handleUpdate])
  const { dispatch } = useAuthContext()
  const handleLogOut = () => {
signOut(auth).then(() => {
  dispatch({ type: "LOGOUT" })
  message.info("Logged Out")
}).catch((error) => {
  console.log(error)
});
  }
  return (
    <div>
      <header className="container bg-light py-3">
        <h1 className='d-inline '>Out Dated</h1>
        <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogOut} className='float-end sm-me-0 me-5'>Logout</Button>
      </header>
      <main>
        <div className="container sticks-container">

          {fromFirebase.length > 0 ? fromFirebase.map((stick, i) => {
            return <>
              <div key={i} className="card p-3 sticksCard m-1 xs-11 sm-5 md-3 lg-3 xxl-2" style={{
                background: stick.bgColor,
                whiteSpace: 'normal'

              }}>

                <Dropdown className='float-end bg-transparent border-0 p-0 text-3' overlay={<Menu>
                  <Menu.Item key={"Edit"} onClick={
                    () => { handleEdit(stick) }}>Edit</Menu.Item>
                  <Menu.Item key={"Delete"} onClick={
                    () => { handleDelete(stick) }}>Delete</Menu.Item>
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
              </div>
            </>
          })
            :
            <h5>There is no Out Dated Sticks...</h5>
          }
        </div>

        <Modal
          open={modal}
          okText={"Update"}
          onOk={handleUpdate}
          onCancel={() => { setModal(false) }}
          className='' >
          <Form className='m-3'>
            <FormItem>
              <Input type='text' placeholder='Title' name='title' value={editStick.title} onChange={handlechange} className='my-1 in' />
              <Input type='location' placeholder='Location' name='location' value={editStick.location} onChange={handlechange} className='my-1 in' />
              <Input type='text' placeholder='Description' name='description' value={editStick.description} onChange={handlechange} className='my-1 in' />
              <Input type='date' placeholder='Date' name='date' value={editStick.date} onChange={handlechange} className='my-1 w-100 in' />
            </FormItem>
          </Form>
        </Modal>
      </main>
    </div>

  )
}

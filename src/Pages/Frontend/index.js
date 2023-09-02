import React, { useEffect, useState } from 'react';
import StickyWall from "./StickWall"
import Today from "./Today"
import Upcoming from "./Upcoming"
import OutDated from "./OutDated"
import {
    MenuFoldOutlined,
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    HourglassOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { Button, Collapse, MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { Link, Route, Routes } from 'react-router-dom';
import CopyRight from '../../Components/Footer/CopyRight';
import SelectDate from './SelectDate/SelectDate';
import AddStick from './Add/AddStick';
import { Grid, Tag } from 'antd';

const { useBreakpoint } = Grid;
const { Header, Content, Footer, Sider } = Layout;

const Index = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const screens = useBreakpoint();
    const [collapsed, setCollaped] = useState(false)
    const toggleSideBar = () => {
        if (window.innerWidth < 768) {
            setCollaped(true)
        } else {
            setCollaped(false)
        }
    }
    useEffect(()=>{
        toggleSideBar()
    },[window.innerWidth])
    return (
        <Layout hasSider >
            <Sider
            
                collapsed={collapsed}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    background: colorBgContainer,
                }}
            >
                <div className="demo-logo-vertical d-flex  flex-column h-100vh" />
                <Menu theme="light" mode="inline" defaultSelectedKeys={['4']} >
                <Button  className='float-end my-2 ' width='100%' icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
                onClick={()=>{setCollaped(!collapsed)}}
                />
                    <p className='mt-4 ms-3 mb-3'><b>Sticks</b> </p>
                    <Menu.Item icon={<BarChartOutlined />} >
                        <Link to={"/"}>Sticky Walls</Link>
                    </Menu.Item>
                    <Menu.Item icon={<AppstoreOutlined />} >
                        <Link to={"/today"}>Today</Link>
                    </Menu.Item>
                    <Menu.Item icon={<HourglassOutlined />} >
                        <Link to={"/upcoming"}>Upcoming</Link>
                    </Menu.Item>
                    <Menu.Item icon={<ShopOutlined />} >
                        <Link to={"/outdated"}>Out Dated</Link>
                    </Menu.Item>
                    <p className='pt-2 ps-3 '><b>Others</b></p>
                    <Menu.Item icon={<MenuUnfoldOutlined />} >
                        <Link to={"/selectdate"}>Select Date</Link>
                    </Menu.Item>
                    <Menu.Item icon={<MenuUnfoldOutlined />} >
                        <Link to={"/addstick"}>Add Stick</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout"
                style={{ marginLeft: collapsed? 100: 200 }}
            >
                <Content>
                    <Routes>
                        <Route path="/" element={<StickyWall />} />
                        <Route path="/today" element={<Today />} />
                        <Route path="/upcoming" element={<Upcoming />} />
                        <Route path="/outdated" element={<OutDated />} />
                        <Route path="/selectdate" element={<SelectDate />} />
                        <Route path="/addstick" element={<AddStick />} />
                    </Routes>
                </Content>
                <Footer style={{ textAlign: 'center' }}><CopyRight /></Footer>
            </Layout>
        </Layout>
    );
};

export default Index;
import React, {useEffect, useState} from 'react'
import {Layout, Menu} from 'antd';
import './index.css'
import {UserOutlined,} from '@ant-design/icons';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import axios from "axios";

const {Sider} = Layout;
const {SubMenu} = Menu

const iconList = {
  "/home": <UserOutlined/>,
  "/user-manage": <UserOutlined/>,
  "/user-manage/list": <UserOutlined/>,
  "/right-manage": <UserOutlined/>,
  "/right-manage/role/list": <UserOutlined/>,
  "/right-manage/right/list": <UserOutlined/>
}

function SideMenu(Props) {
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      setMenu(res.data);
    })
  }, [])

  const checkPagePermission = (item) => {
    return item.pagepermisson;
  }

  const renderMenu = (menuList) => {
    return menuList.map(item => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {renderMenu(item.children)}
        </SubMenu>;
      }
      return checkPagePermission(item) && <Menu.Item key={item.key} icon={item.icon} onClick={() => {
        Props.history.push(item.key);
      }}>{item.title}
      </Menu.Item>

    })
  }

   const selectkeys = [Props.location.pathname];
   const openkeys = ["/" + Props.location.pathname.split("/")[1]];
  return (
    <Sider trigger={null} collapsible collapsed={Props.isCollapsed}>
      <div style={{display: "flex", height: "100%", "flexDirection": "column"}}>
        <div className="logo">全球新闻发布管理系统</div>

        <div style={{flex: 1, "overflow": "auto"}}>
          <Menu theme="dark" mode="inline" selectedKeys={selectkeys} className="aaaaaaa" defaultOpenKeys={openkeys}>
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  );
}

const mapStateToProps = ({collapsedReducer:{isCollapsed}})=>({
  isCollapsed
})

export default connect(mapStateToProps)(withRouter(SideMenu));


import {Form, Input, Button, message} from "antd";
import {UserOutlined,LockOutlined} from "@ant-design/icons";
import './Login.css'
import axios from "axios";

export default function Login(poops) {
  const onFinish =(values)=>{
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res=>{
      console.log('-----',res.data);
      if (res.data.length === 0) {
        message.error('用户名和密码不匹配')
      }else {
        localStorage.setItem("token", JSON.stringify(res.data[0]))
        poops.history.push("/")
      }
    })
  }



  return (
    <div style={{background: 'rgb(35,39,65)', height: '100%', overflow: 'hidden'}}>
      <div className="formContainer">
        <div className="loginTitle">全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            label="姓名"
            rules={[{required: true,message:'请输入姓名'},]}
          >
            <Input size="small" prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="请输入用户名"></Input>
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{required: true,message:'请输入密码'},]}
          >
            <Input size="small"  type="password" prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="请输入密码"></Input>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

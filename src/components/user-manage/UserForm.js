import {Form, Input, Select} from "antd";
import {forwardRef, useState,useEffect} from "react";
import {Option} from "antd/es/mentions";

const UserForm = forwardRef((props, ref) => {
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsDisabled(props.isUpdateDisabled)
  }, [props.isUpdateDisabled])

  return <div>
    <Form
      ref={ref}
      layout="vertical"

    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[{required: true, message: 'Please input your username !',}]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[{required: true, message: 'Please input your password !',}]}
      >
        <Input.Password/>
      </Form.Item>
      <Form.Item
        label="区域"
        name="region"
        rules={isDisabled ? [] : [{required: true, message: 'Please input your region !',}]}
      >
        <Select disabled={isDisabled}>
          {
            props.regionList.map(item =>
              <Option value={item.value} key={item.id} >{item.title}</Option>
            )
          }

        </Select>

      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[{required: true, message: 'Please input your roleId !',}]}
      >
        <Select onChange={(value => {
          if (value === 1) {
            setIsDisabled(true);
            ref.currnent.setFieldsValue({
              region: ''
            })
          } else {
            setIsDisabled(false);
          }
        })}>
          {
            props.roleList.map(item => <Option value={item.id} key={item.id}>{item.roleName}</Option>)
          }
        </Select>

      </Form.Item>
    </Form>
  </div>;
})


export default UserForm

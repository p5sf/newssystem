import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Button, Modal, Switch, Table} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import UserForm from "../../../components/user-manage/UserForm";

const {confirm} = Modal;

export default function UserList() {
  const [Users, setUsers] = useState([]);

  const [isAddVisible, setAddVisible] = useState(false);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)


  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);

  const [regionList, setRegionList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [current, setCurrent] = useState(null)

  const addForm = useRef(null);
  const updateForm = useRef(null);

  useEffect(() => {
    axios.get("/users?_expand=role").then(res => {
      setUsers(res.data);
    })
  }, [])

  useEffect(() => {
    axios.get('/regions').then(res => {
      setRegionList(res.data);
    })
  }, [])
  useEffect(() => {
    axios.get('/roles').then(res => {
      setRoleList(res.data);
    })
  }, [])

  const columns = [
    {
      title: "区域",
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
            text: item.title,
            value: item.value
          })
        ), {
          text: "全球",
          value: "全球"
        }
      ],
      onFilter:(value,item)=>{
        if (value === '全球') {
          return item.region === "";
        }
        return item.region === value;
      },
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>
      }

    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <div>
          <Switch checked={roleState} onChange={() => checkUser(item)} disabled={item.default}></Switch>
        </div>
      }
    },
    {
      title: "操作",
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => confirmDelete(item)}
                  disabled={item.default}></Button>

          <Button type="primary" shape="circle" icon={<EditOutlined/>} disabled={item.default}
                  onClick={() => handleUpdate(item)}></Button>
        </div>
      }
    }
  ]

  const checkUser = (item) => {
    item.roleState = !item.roleState;
    setUsers([...Users])

    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }

// 删除用户
  const confirmDelete = (item) => {
    confirm({
      title: '确定要删除么？',
      icon: <ExclamationCircleOutlined/>,
      onOk() {
        deleteUser(item);
      },
      onCancel() {
        console.log('取消删除');
      }

    })
  }
  const deleteUser = (item) => {
    setUsers(Users.filter(data => data.id !== item.id));
    axios.delete(`/users/${item.id}`)
  }

  // 添加用户
  const addFormOk = () => {
    addForm.current.validateFields().then(value => {
      setAddVisible(false);
      addForm.current.resetFields()
      axios.post(`/users`, {
        ...value,
        'roleState': true,
        "default": false
      }).then(res => {
        console.log("添加用户", res);
        setUsers([...Users], {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0]
        })
      })
    }).catch(Error => {
      console.log(Error);
    })
  }

  // 编辑用户
  const handleUpdate = (item) => {
    setTimeout(() => {
      setIsUpdateVisible(true);
      if (item.roleId === 1) {
        setIsUpdateDisabled(true);
      } else {
        setIsUpdateDisabled(false);
      }
      updateForm.current.setFieldsValue(item);

    }, 0)
    setCurrent(item)
  }

  const updateFormOk = () => {
    updateForm.current.validateFields().then(value => {

      setIsUpdateVisible(false);

      setUsers(Users.map(item => {
        if (item.id === current.id) {
          return {
            ...item,
            ...value,
            role: roleList.filter(data => data.id === value.roleId)[0]
          }
        }
        return item
      }))
      setIsUpdateDisabled(!isUpdateDisabled)

      axios.patch(`/users/${current.id}`, value)


    }).catch(Error => {
      console.log(Error);
    })
  }
  return (
    <div>
      <Button type="primary" onClick={() => setAddVisible(true)}>添加用户</Button>
      <Table dataSource={Users} columns={columns} pagination={{pageSize: 5}}></Table>
      <Modal title="添加用户" visible={isAddVisible} okText="确定" cancelText="取消"
             onCancel={() => {
               setAddVisible(false);
             }}
             onOk={() => addFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>

      <Modal title="更新用户" visible={isUpdateVisible} okText="更新" cancelText="取消"
             onCancel={() => {
               setIsUpdateVisible(false);
               setIsUpdateDisabled(!isUpdateVisible);
             }}
             onOk={() => updateFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm}
                  isUpdateDisabled={isUpdateDisabled}></UserForm>
      </Modal>
    </div>
  );
}

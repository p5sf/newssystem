import {Button, Modal, Popover, Switch, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
const {confirm} = Modal;

export default function RightList() {
  const [Rights, setRights] = useState([]);
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      const list = res.data
      list.forEach(item => {
        if (item.children.length === 0) {
          item.children = ""
        }
      })
      setRights(res.data);
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',

    },
    {
      title: '权限名称',
      dataIndex: 'title',

    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (text) => <Tag color={"orange"}>{text}</Tag>

    },
    {
      title: "操作",
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => confirmMethod(item)}></Button>

          <Popover content={<div style={{textAlign: "center"}}>
            <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)}></Switch>
          </div>} title="页面配置项" trigger={item.pagepermisson === undefined ? "" : "click"}>
            <Button type="primary" shape="circle" icon={<EditOutlined/>}></Button>
          </Popover>
        </div>
      }

    }
  ];

  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    setRights([...Rights]);
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      }).then();
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      }).then();
    }
  }

  const confirmMethod = (item) => {
    confirm({
      title: "你确定要删除吗？",
      icon: <ExclamationCircleOutlined/>,
      onOk() {
        deleteRights(item);
      },
      onCancel() {
        console.log('cancel');
      }
    })
  }

  const deleteRights = (item) => {
    if (item.grade === 1) {
      setRights(Rights.filter(data => data !== item.id));
      axios.delete(`/rights/${item.id}`).then();
    } else {
      let list = Rights.filter(data => data.id === item.rightId);
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setRights([...Rights])
      axios.delete(`/children/${item.id}`).then(r => r)
    }
  }

  return (
    <div>
      <Table dataSource={Rights} columns={columns}/>
    </div>
  )
}

import {Button, Modal, notification, Table} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined} from "@ant-design/icons";

const {confirm} = Modal;

export default function NewsDraft(props) {
  const {username} = JSON.parse(localStorage.getItem("token"))
  const [DraftList, setDraftList] = useState([]);
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      console.log(res.data)
      setDraftList(res.data);
    })
  }, [username])

  const colums = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>;
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title;
      }
    },
    {
      title: '',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => deleteDraft(item)}></Button>
          <Button shape="circle" icon={<EditOutlined/>} onClick={() => {
            props.history.push(`/news-manage/update/${item.id}`);
          }}></Button>
          <Button type="primary" shape="circle" icon={<UploadOutlined/>} onClick={() => handleCheck(item.id)}></Button>
        </div>
      }
    }
  ];

  const deleteDraft = (item) => {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleOutlined/>,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {

      },
    });
  }
  const deleteMethod = (item) => {
    setDraftList(DraftList.filter(data => data.id !== item.id));
    axios.delete(`/news/${item.id}`);
  }
  const handleCheck = (id) => {
    axios.patch(`/news/${id}`, {
      auditState: 1
    }).then(res => {
      props.history.push('/audit-manage/list');
      notification.info({
        message: `通知`,
        description: `你可以到${'审核列表'}中查看你的新闻`,
        placement: 'bottomRight'
      })
    })

  }

  return (<div>
    <Table dataSource={DraftList} columns={colums}
           pagination={{pageSize: 5}}
    >
    </Table>
  </div>)
}

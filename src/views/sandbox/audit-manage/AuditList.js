import {Button, notification, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";

export default function AuditList(props) {
  const colorList = ["", 'orange', 'green', 'red']
  const auditCheck = ["草稿箱", "审核中", "已通过", "未通过"]
  const [auditList, setAuditList] = useState([])
  const {username} = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
    axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setAuditList(res.data)
    })
  }, [username])
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-mange/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: "新闻分类",
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      }
    },
    {
      title: "审核状态",
      dataIndex: 'auditState',
      render: (auditState) => {
        return <Tag color={colorList[auditState]}>{auditCheck[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {
            item.auditState === 1 && <Button onClick={() => handleRevert(item)}>撤销</Button>
          }
          {
            item.auditState === 2 && <Button danger onClick={() => handlePublish(item)}>发布</Button>
          }
          {
            item.auditState === 3 && <Button type="primary" onClick={() => handleUpdate(item)}>更新</Button>
          }
        </div>

      }
    }
  ]

  // 撤退
  const handleRevert = (item) => {
    setAuditList(auditList.filter(data => data.id !== item.id));
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(res => {
      notification.info({
        message: '通知',
        description: `你可以到草稿箱中查看你的新闻`,
        placement: 'bottomRight'
      })
    })
  }

  const handleUpdate = (item) => {
    props.history.push(`/news-mange/update/${item.id}`);
  }

  // 发布
  const handlePublish = (item) => {
    axios.patch(`/news/${item.id}`, {
      'publishState': 2
    }).then(res => {
      props.history.push('/publish-mange/published');
      notification.info({
        message: `通知`,
        description:
          `您可以到【发布管理/已经发布】中查看您的新闻`,
        placement: "bottomRight"
      });
    })
  }
  return (


    <div>
    <Table dataSource={auditList} columns={columns}>
      pagination={{
      pageSize: 5
    }}
      rowKey={item => item.id}
    </Table>
  </div>)
}

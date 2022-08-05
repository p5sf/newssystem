import {Button, Form, Input, message, notification, PageHeader, Select, Steps} from "antd";
import {useEffect, useRef, useState} from "react";
import {Option} from "antd/es/mentions";
import axios from "axios";
import style from './News.module.css'
import NewsEditor from "../../../components/news-manage/NewsEditor";

const {Step} = Steps;

export default function NewsAdd(props) {

  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [content, setContent] = useState("")
  const [formInfo, setFormInfo] = useState({})
  const NewsForm = useRef(null)
  const User = JSON.parse(localStorage.getItem("token"))


  const handleNext = () => {
    if (current === 0) {
      NewsForm.current.validateFields().then(res => {
        // console.log(res)
        setFormInfo(res)
        setCurrent(current + 1)
      }).catch(error => {
        console.log(error)
      })
    } else {
      // console.log(content)
      if (content === "" || content.trim() === "<p></p>") {
        message.error("新闻内容不能为空")
      } else {
        setCurrent(current + 1)
      }
    }
  }

  const handlePrevious = () => {
    setCurrent(current - 1);
  }
  useEffect(() => {
    axios.get("/categories").then(res => {
      setCategoryList(res.data)
    })
  })

  // 保存草稿箱
  const handleSave = (auditSate) => {
    axios.post('/news', {
      ...formInfo,
      "content": content,
      "region": User.region?User.region:"全球",
      "author": User.username,
      "roleId": User.roleId,
      "auditState": auditSate,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
    }).then(res => {
      props.history.push(auditSate === 0 ? '/news-manage/draft' : '/audit-manage/list');
      notification.info({
        message: '通知',
        description: `你可以到${auditSate === 0 ? '草稿箱' : '审核列表'}中查看你的新闻`
      })
    })
  }

  return (
    <div>
      <PageHeader title="撰写新闻" subTitle="this is a subtitle"></PageHeader>

      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类"/>
        <Step title="新闻内容" description="新闻主体内容"/>
        <Step title="新闻提交" description="保存草稿或者提交审核"/>
      </Steps>
      <div style={{marginTop: "50px"}}>
        <div className={current === 0 ? '' : style.active}>
          <Form
            ref={NewsForm}>
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{required: true, message: 'Please input your username!'}]}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{required: true, message: 'Please input your categoryId!'}]}
            >

              <Select>
                {categoryList.map(item =>
                  <Option value={item.id} key={item.id}>{item.title}</Option>
                )}
              </Select>
            </Form.Item>
          </Form>
        </div>

        <div className={current === 1 ? '' : style.active}>
          <NewsEditor getContent={(value) => {
            setContent(value);
          }}>

          </NewsEditor>

        </div>

      </div>

      <div style={{margin: '50px 120px', textAlign: "center", display: "flex"}}>
        {
          current === 2 && <span>
            <Button type="primary" onClick={() => handleSave(0)}>保存草稿箱</Button>
              <Button danger onClick={() => handleSave(1)}>提交审核</Button>
          </span>
        }
        {
          current < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>
        }
        {
          current > 0 && <Button onClick={handlePrevious}>上一步</Button>
        }

      </div>


    </div>)
}

## 创建项目

#### 快速开始

```
npx create-react-app newsystem
cd newsystem
npm start
```

#### Sass应用

```
npm install node-sass --save
```

#### 项目配置

**反向代理**

```
npm install http-proxy-middleware --save
```

修改配置文件,src/setupProxy.js

```js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/ajax',
    createProxyMiddleware({
      target: 'https://m.maoyan.com',
      changeOrigin: true,
    })
  );
};
```

修改app.js

```js
import "./index.css"
import { useEffect } from 'react'
import axios from 'axios'

function App() {
  useEffect(()=>{
    axios.get("/ajax/movieOnInfoList?token=&optimus_uuid=74B5F0A032A711EB82DD6B9282E93C676D27D7B9731D4E608D7612C3E708C120&optimus_risk_level=71&optimus_code=10").then(res=>{
      console.log(res.data)
    })
  },[])
  return (
    <div>
      <h1>H1</h1>
    </div>
  )
}

export default App
```

#### 安装路由

> 本版本默认5

```
npm install react-router-dom --save-dev
```

创建IndexRouter.js

```js
import React from 'react'
import {HashRouter,Redirect,Route, Switch} from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
export default function IndexRouter() {
    return (
        <HashRouter>
            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/" render={()=>
                    localStorage.getItem("token")?
                    <NewsSandBox></NewsSandBox>:
                    <Redirect to="/login"/>
                }/>
            </Switch>
        </HashRouter>
    )
}
```

在App.js 引入路由表

```js
import IndexRouter from "./router/IndexRouter";

function App() {
  return (
    <div>
     <IndexRouter></IndexRouter>
    </div>
  )
}
export default App
```

#### Ant Desgin引入

```
yarn add antd
```

修改src/app.js,引入antd的按钮组件

```

```

修改src/app.css在文件顶部引入antd/dist/antd.css

```
@import '~antd.dist/antd.css'
```



## 项目配置

#### 发送请求

```
# 安装
npm install  -g json-server
```

Json 文件

```json
{
  "posts": [
    {
      "id": 1,
      "title": "1111-修改-11111",
      "author": "kerwin"
    },
    {
      "id": 2,
      "title": "22222",
      "author": "tiechui"
    },
    {
      "title": "33333",
      "author": "xiaoming",
      "id": 3
    }
  ],
  "comments": [
    {
      "id": 1,
      "body": "11111-comment",
      "postId": 1
    },
    {
      "id": 2,
      "body": "22222-comment",
      "postId": 2
    }
  ]
}
```

发送请求

```
json-server --watch ./db.json --port 5000
```

![Snipaste_2022-07-26_22-04-13](https://java-note-pic.oss-cn-beijing.aliyuncs.com/java/202207262204967.png)

项目配置

```js
 import axios from 'axios'
export default function Home() {

    const ajax = ()=>{
      // 获取数据
        axios.get("http://localhost:8000/posts/2").then(res=>{
            console.log(res.data)
        })
      // 添加数据
        axios.post("http://localhost:8000/posts",{
            title:"33333",
            author:"xiaoming"
        })
      // 更新数据
        axios.put("http://localhost:8000/posts/1",{
            title:"1111-修改"
        })
        axios.patch("http://localhost:8000/posts/1",{
            title:"1111-修改-11111"
        })
        axios.delete("http://localhost:8000/posts/1")
        axios.get("http://localhost:8000/posts?_embed=comments").then(res=>{
            console.log(res.data)
        })
        axios.get("http://localhost:8000/comments?_expand=post").then(res=>{
            console.log(res.data)
        })
    }
    return (
        <div>
            <Button type="primary" onClick={ajax}>Button</Button>
        </div>
    )
}
```


![](https://java-note-pic.oss-cn-beijing.aliyuncs.com/java/202208051142880.png)
























































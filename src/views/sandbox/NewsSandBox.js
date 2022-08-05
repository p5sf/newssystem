import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
import {Redirect, Route, Switch} from "react-router-dom";
import Home from "./home/Home";
import RoleList from "./right-manage/RoleList";
import RightList from "./right-manage/RightList";
import UserList from "./user-manage/UserList";
import NoPermission from "./nopermission/Nopermission";
//css
import './NewsSandBox.css'

//antd
import {Layout} from 'antd'
import newsAdd from "./new-manage/NewsAdd";
import newsDraft from "./new-manage/NewsDraft";
import NewsPreview from "./new-manage/NewsPreview";
import NewsUpdate from "./new-manage/NewsUpdate";
import AuditList from "./audit-manage/AuditList";
import NewsCategory from "./new-manage/NewsCategory";
import Sunset from "./publish-manage/Sunset";
import Published from "./publish-manage/Published";
import Unpublished from "./publish-manage/Unpublished";


const {Content} = Layout

export default function NewSandBox() {
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content className="site-layout-background"
                 style={{
                   margin: '24px 16px',
                   padding: 24,
                   minHeight: 280,
                 }}>
          <Switch>
            <Route path="/home" component={Home}></Route>
            <Route path="/user-manage/list" component={UserList}></Route>
            <Route path="/right-manage/role/list" component={RoleList}></Route>
            <Route path="/right-manage/right/list" component={RightList}></Route>
            <Route path="/news-manage/add" component={newsAdd}></Route>
            <Route path="/news-manage/draft" component={newsDraft}></Route>
            <Route path="/news-manage/category" component={NewsCategory}></Route>
            <Route path="/news-manage/preview/:id" component={NewsPreview}></Route>
            <Route path="/news-manage/update/:id" component={NewsUpdate}></Route>
            <Route path="/audit-manage/list" component={AuditList}></Route>
            <Route path="/publish-manage/published" component={Published}></Route>
            <Route path="/publish-manage/sunset" component={Sunset}></Route>
            <Route path="/publish-manage/unpublished" component={Unpublished}></Route>

            <Redirect from="/" to="/home" exact></Redirect>
            <Route path="*" component={NoPermission}/>
          </Switch>
        </Content>

      </Layout>

    </Layout>
  );
}

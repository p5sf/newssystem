import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import Login from '../views/login/Login'
import NewSandBox from "../views/sandbox/NewsSandBox";
import News from "../views/news/News";
import Detail from "../views/news/Detail";

export default function IndexRouter() {
  return (
      <HashRouter>
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/news" component={News}></Route>
          <Route path="/detail/:id" component={Detail}></Route>
          <Route path="/" render={() => localStorage.getItem("token") ?
            <NewSandBox></NewSandBox> : <Redirect to="/login"/>
          }></Route>
        </Switch>
      </HashRouter>
  )
}

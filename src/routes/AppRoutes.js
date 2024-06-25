import {Route, Switch} from "react-router-dom";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import Users from "../components/ManageUsers/Users";
import PrivateRoutes from "./PrivateRoutes";
import Role from "../components/Role/Role";
import GroupRole from "../components/GroupRole/GroupRole";

const AppRoutes = (props) => {

    const Project = () => {
        return (
            <div className="container mt-3">
                <h1 className="text-center">Project</h1>
            </div>
        )
    }
    return (
        <>
            <Switch>
                <PrivateRoutes path="/users" component={<Users />} />
                <PrivateRoutes path="/roles" component={<Role />} />
                <PrivateRoutes path="/group-role" component={<GroupRole />} />
                <PrivateRoutes path="/projects" component={<Project />} />

                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/register">
                    <Register />
                </Route>
                <Route path="/" exact>
                    <div className="container mt-3">
                        <h1 className="text-center">Hi Everyone!!!</h1>
                    </div>
                </Route>
                <Route path="*">
                    <div className="container mt-3"><h1>404 Not Found</h1></div>
                </Route>
            </Switch>
        </>
    )
}

export default AppRoutes;
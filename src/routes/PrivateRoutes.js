import {Route, useHistory} from "react-router-dom";
import {useEffect} from "react";

const PrivateRoutes = (props) => {

    let history = useHistory();

    useEffect(() => {
        let session = sessionStorage.getItem("account");
        if (!session) {
            history.push("/login")
            window.location.reload();
        }
    }, []);

    return (
        <>
            <Route path={props.path}>
                {props.component}
            </Route>
        </>
    )
}

export default PrivateRoutes;
import React from "react";
import "./Login.scss";
import { useHistory } from "react-router-dom";

const Login = (props) => {

  const history = useHistory();

  const handleCreateNewAccount = () => {
    history.push("/register");
  }

  return (
    <div className="login-container">
      <div className="container">
        <div className="row px-3 px-sm-0">
          <div className="content-left col-12 d-none col-sm-7 d-sm-block">
            <div className="brand">
              Vu Duc Duy
            </div>
            <div className="detail">
              Cristiano Ronaldo is the greatest off all times
            </div>
          </div>
          <div className="right-container col-sm-5 col-12 d-flex flex-column">
            <div className="brand d-sm-none pb-3 pb-sm-0">
              Vu Duc Duy
            </div>
            <div className="content-right d-flex flex-column gap-3 p-3">
              <input className="form-control" placeholder="Email address or phone number" type="text"/>
              <input className="form-control" placeholder="Password" type="password"/>
              <button className="btn btn-primary">Login</button>
              <span className="text-center">
                <a className="forgot-password" href="#">Forgot your password?</a>
              </span>
              <hr/>
              <div className="text-center">
                <button className="btn btn-success" onClick={() => handleCreateNewAccount()}>Create New Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

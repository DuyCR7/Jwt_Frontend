import React from "react";
import "./Login.scss";

const Login = (props) => {
  return (
    <div className="login-container mt-3">
      <div className="container">
        <div className="row">
          <div className="content-left col-7">
            <div className="brand">
                Vu Duc Duy
            </div>
            <div className="detail">
                Cristiano Ronaldo is the greatest off all times
            </div>
          </div>
          <div className="content-right col-5 d-flex flex-column gap-3 py-3">
            <input className="form-control" placeholder="Email address or phone number" type="text"/>
            <input className="form-control" placeholder="Password" type="password"/>
            <button className="btn btn-primary">Login</button>
            <span className="text-center">Forgot your password?</span>
            <hr />
            <div className="text-center">
            <button className="btn btn-success">Create New Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

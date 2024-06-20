import React from "react";
import "./Register.scss";
import { useHistory } from "react-router-dom";

const Register = (props) => {

    const history = useHistory();

    const handleLogin = () => {
        history.push("/login");
    }

    return (
        <div className="register-container">
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
                            <div className="form-group">
                                <label className="form-label">Email:</label>
                                <input className="form-control" placeholder="Email address" type="text"/>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone number:</label>
                                <input className="form-control" placeholder="Phone number" type="text"/>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Username:</label>
                                <input className="form-control" placeholder="Username" type="text"/>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password:</label>
                                <input className="form-control" placeholder="Password" type="password"/>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm password:</label>
                                <input className="form-control" placeholder="Confirm password" type="password"/>
                            </div>

                            <button className="btn btn-primary">Register</button>
                            <hr/>
                            <div className="text-center">
                                <button className="btn btn-success" onClick={() => handleLogin()}>
                                    Already've an account. Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

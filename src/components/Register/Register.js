import React, {useContext, useEffect, useState} from "react";
import "./Register.scss";
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';
import { registerNewUser } from "../../services/userService";
import {UserContext} from "../../context/UserContext";
import { Spin } from 'antd';

const Register = (props) => {

    const {user} = useContext(UserContext);
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const defaultValidInput = {
        isEmail: true,
        isPhone: true,
        isPassword: true,
        isConfirmPassword: true,
    }
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    const handleLogin = () => {
        history.push("/login");
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const isValidInputs = () => {
        setObjCheckInput(defaultValidInput);

        if (!email) {
            toast.error("Email is required");
            setObjCheckInput({...defaultValidInput, isEmail: false});
            return false;
        }

        if (!validateEmail(email)) {
            toast.error("Please enter valid email");
            setObjCheckInput({...defaultValidInput, isEmail: false});
            return false;
        }

        if (!phone) {
            toast.error("Phone is required");
            setObjCheckInput({...defaultValidInput, isPhone: false});
            return false;
        }

        if (!password) {
            toast.error("Password is required");
            setObjCheckInput({...defaultValidInput, isPassword: false});
            return false;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            setObjCheckInput({...defaultValidInput, isConfirmPassword: false});
            return false;
        }

        return true;
    }

    const handleRegister = async () => {
        let check = isValidInputs();
        if (check === true) {
            setLoading(true);
            try {
                let res = await registerNewUser(email, phone, username, password);
                // console.log("Check res: ", res);

                if(res.EC === 0){
                    toast.success(res.EM);
                    history.push("/login");
                } else {
                    toast.error(res.EM);
                }
            } catch (error) {
                console.log("Error: ", error);
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        if(user && user.isAuthenticated) {
            history.push('/');
        }
    }, []);

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
                                <input className={objCheckInput.isEmail ? "form-control" : "form-control is-invalid"} placeholder="Email address" type="text"
                                    value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone number:</label>
                                <input className={objCheckInput.isPhone ? "form-control" : "form-control is-invalid"} placeholder="Phone number" type="text"
                                    value={phone} onChange={(e) => setPhone(e.target.value)}/>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Username:</label>
                                <input className="form-control" placeholder="Username" type="text"
                                    value={username} onChange={(e) => setUsername(e.target.value)}/>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password:</label>
                                <input className={objCheckInput.isPassword ? "form-control" : "form-control is-invalid"} placeholder="Password" type="password"
                                    value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm password:</label>
                                <input className={objCheckInput.isConfirmPassword ? "form-control" : "form-control is-invalid"} placeholder="Confirm password" type="password"
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                            </div>

                            <Spin spinning={loading} className="w-100">
                                <button className="btn btn-primary w-100" onClick={() => handleRegister()}>Register</button>
                            </Spin>
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

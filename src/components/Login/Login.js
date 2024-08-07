import React, {useContext, useEffect, useState} from "react";
import "./Login.scss";
import {Link, useHistory} from "react-router-dom";
import { toast } from 'react-toastify';
import { loginUser } from "../../services/userService";
import {UserContext} from "../../context/UserContext";
import { Spin } from 'antd';

const Login = (props) => {
  const { user, loginContext } = useContext(UserContext);

  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const [valueLogin, setValueLogin] = useState("");
  const [password, setPassword] = useState("");
  const defaultValidInput = {
    isValueInput: true,
    isPassword: true,
  }
  const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

  const isValidInputs = () => {
    setObjCheckInput(defaultValidInput);
    if(!valueLogin){
      setObjCheckInput({...defaultValidInput, isValueInput: false});
      toast.error("Please enter your email or phone number!")
      return false;
    }

    if(!password){
      setObjCheckInput({...defaultValidInput, isPassword: false});
      toast.error("Please enter your password");
      return false;
    }

    return true;
  }

  const handleLogin = async () => {
    let check = isValidInputs();
    if(check) {
      setLoading(true);
      try {
        let res = await loginUser(valueLogin, password);
        if (res && res.EC === 0) {
          let groupWithRoles = res.DT.groupWithRoles;
          let email = res.DT.email;
          let username = res.DT.username;
          let token = res.DT.access_token;
          let image = `data:image/jpeg;base64,${res.DT.image}`;

          let data = {
            isAuthenticated: true,
            token: token,
            account: {
              groupWithRoles,
              email,
              username,
              image
            }
          }

          localStorage.setItem("jwt", token);
          loginContext(data);
          history.push("/users");

        }
        if (res && res.EC !== 0) {
          toast.error(res.EM)
        }
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setLoading(false);
      }
    }
  }

  const handleCreateNewAccount = () => {
    history.push("/register");
  }

  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  }

  useEffect(() => {
      if (user && user.isAuthenticated) {
        history.push("/");
      }
  }, []);

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row px-3 px-sm-0">
          <div className="content-left col-12 d-none col-sm-7 d-sm-block">
            <div className="brand">
              <Link to={"/"} style={{textDecoration: 'none'}}> <span title={"Return to HomePage"}>Vu Duc Duy</span></Link>
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
              <input
                  className={objCheckInput.isValueInput ? "form-control" : "form-control is-invalid"}
                  placeholder="Email address or phone number"
                  type="text"
                  value={valueLogin}
                  onChange={(e) => setValueLogin(e.target.value)}
                  onKeyPress={(e) => handlePressEnter(e)}
              />
              <input
                  className={objCheckInput.isPassword ? "form-control" : "form-control is-invalid"}
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => handlePressEnter(e)}
              />
              {/*<button className="btn btn-primary" onClick={() => handleLogin()}>Login</button>*/}
              <Spin spinning={loading} className="w-100">
                <button className="btn btn-primary w-100" onClick={() => handleLogin()}>Login</button>
              </Spin>
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

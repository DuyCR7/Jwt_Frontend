import React, {useEffect, useState} from "react";
import "./Login.scss";
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';
import { loginUser } from "../../services/userService";

const Login = (props) => {

  const history = useHistory();

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
      let res = await loginUser(valueLogin, password);
      if (res && res.EC === 0) {
        let data = {
          isAuthenticated: true,
          token: 'fake token'
        }
        sessionStorage.setItem("account", JSON.stringify(data));
        history.push("/users");
        window.location.reload();
        // redux
      }
      if (res && res.EC !== 0) {
        toast.error(res.EM)
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
    let session = sessionStorage.getItem("account");
    if (session) {
      history.push("/")
      window.location.reload();
    }
  }, []);

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
              <button className="btn btn-primary" onClick={() => handleLogin()}>Login</button>
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

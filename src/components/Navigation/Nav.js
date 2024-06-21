import React, {useEffect, useState} from "react";
import "./Nav.scss";
import { NavLink } from "react-router-dom";

const Nav = (props) => {

    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        let session = sessionStorage.getItem("account");
        if (session) {
            setIsShow(true);
        }
    }, []);

  return (
      <>
          {isShow === true &&
          <div className="topnav">
              <NavLink to="/" exact>
                  Home
              </NavLink>
              <NavLink to="/users">Users</NavLink>
              <NavLink to="/projects">Projects</NavLink>
              <NavLink to="/about">About</NavLink>
          </div>
          }
      </>
  );
};

export default Nav;

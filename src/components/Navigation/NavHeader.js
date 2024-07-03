import React, {useContext, useEffect, useState} from "react";
import "./NavHeader.scss";
import {Link, NavLink, useHistory, useLocation} from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { logoutUser } from "../../services/userService";
import {toast} from "react-toastify";

const NavHeader = (props) => {
    const { user, logoutContext } = useContext(UserContext);
    const location = useLocation();
    const history = useHistory();

    const handleLogout = async () => {
        try {
            let data = await logoutUser(); // clear cookie
            localStorage.removeItem("jwt"); // clear local storage
            logoutContext(); // clear user in context
            if (data && data.EC === 0) {
                toast.success(data.EM);
                history.push("/login");
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const [navbarExpanded, setNavbarExpanded] = useState(false);
    const handleLinkClick = () => {
        setNavbarExpanded(false);
    }

    useEffect(() => {
        setNavbarExpanded(false);
    }, [user]);

    if(user && user.isAuthenticated === true || location.pathname === "/") {
        return (
            <>
                <div className="topnav">
                    <div className="nav-header">
                        <Navbar expand="lg" bg="header" className="bg-body-tertiary" expanded={navbarExpanded} onToggle={() => setNavbarExpanded(!navbarExpanded)}>
                            <Container>
                                <NavLink to="/" exact className="navbar-brand" onClick={handleLinkClick}>Home</NavLink>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="me-auto">
                                        {user && user.isAuthenticated === true &&
                                            <>
                                                <NavLink to="/users" className="nav-link" onClick={handleLinkClick}>Users</NavLink>
                                                <NavLink to="/roles" className="nav-link" onClick={handleLinkClick}>Roles</NavLink>
                                                <NavLink to="/group-role" className="nav-link" onClick={handleLinkClick}>Group-Role</NavLink>
                                                <NavLink to="/projects" className="nav-link" onClick={handleLinkClick}>Projects</NavLink>
                                                <NavLink to="/about" className="nav-link" onClick={handleLinkClick}>About</NavLink>
                                            </>
                                        }
                                    </Nav>
                                    <Nav>
                                        {user && user.isAuthenticated === true ?
                                            <>
                                                <Nav.Item className="nav-link">
                                                    Welcome <b>{user.account.username}!</b>
                                                </Nav.Item>
                                                <img src={user.account.image} width={40} height={40} className="rounded-circle"/>
                                                <NavDropdown title="Settings" id="basic-nav-dropdown">
                                                    <NavDropdown.Item onClick={handleLinkClick}>Change Password</NavDropdown.Item>
                                                    <NavDropdown.Divider />
                                                    <NavDropdown.Item onClick={() => handleLogout()}>
                                                        Log out
                                                    </NavDropdown.Item>
                                                </NavDropdown>
                                            </>
                                            :
                                            <Link to="/login" className="nav-link">
                                                Log in
                                            </Link>
                                        }
                                    </Nav>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <></>
        )
    }

};

export default NavHeader;

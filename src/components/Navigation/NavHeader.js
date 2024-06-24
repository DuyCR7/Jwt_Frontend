import React, { useContext } from "react";
import "./NavHeader.scss";
import {NavLink, useLocation} from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const NavHeader = (props) => {
    const { user } = useContext(UserContext);
    const location = useLocation();
    if(user && user.isAuthenticated === true || location.pathname === "/") {
        return (
            <>
                <div className="topnav">
                    <div className="nav-header">
                        <Navbar expand="lg" bg="header" className="bg-body-tertiary">
                            <Container>
                                <Navbar.Brand href="#home">React</Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="me-auto">
                                        <NavLink to="/" exact className="nav-link">
                                            Home
                                        </NavLink>
                                        <NavLink to="/users" className="nav-link">Users</NavLink>
                                        <NavLink to="/projects" className="nav-link">Projects</NavLink>
                                        <NavLink to="/about" className="nav-link">About</NavLink>
                                    </Nav>
                                    <Nav>
                                        <Nav.Item className="nav-link">
                                            Welcome Duy
                                        </Nav.Item>
                                        <NavDropdown title="Settings" id="basic-nav-dropdown">
                                            <NavDropdown.Item href="#action/3.1">Change Password</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item href="#action/3.4">
                                                Log out
                                            </NavDropdown.Item>
                                        </NavDropdown>
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

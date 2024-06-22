import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from "react";
import "./Users.scss";
import { fetchGroup } from "../../services/userService";
import {toast} from "react-toastify";
import _ from "lodash";

const ModalUser = (props) => {

    const [userGroup, setUserGroup] = useState([]);

    const defaultValidInput = {
        email: "",
        phone: "",
        username: "",
        password: "",
        sex: "",
        address: "",
        group: ""
    }
    const [userData, setUserData] = useState(defaultValidInput);

    const handleOnChangeInput = (value, name) => {
        let _userData = _.cloneDeep(userData);
        _userData[name] = value;
        setUserData(_userData);
    }

    useEffect(() => {
        getGroups();
    }, []);

    const getGroups = async () => {
        let res = await fetchGroup();
        if (res && res.data && res.data.EC === 0){
            setUserGroup(res.data.DT);
        } else {
            toast.error(res.data.EM);
        }
    }

    return (
        <>
            <Modal show={true} size={"lg"} className="modal-user">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>{props.title}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 col-sm-6 form-group">
                            <label>Email (<span className="red">*</span>):</label>
                            <input type="email" className="form-control" value={userData.email}
                                onChange={(e) => handleOnChangeInput(e.target.value, "email")}/>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Phone (<span className="red">*</span>):</label>
                            <input type="text" className="form-control" value={userData.phone}
                                   onChange={(e) => handleOnChangeInput(e.target.value, "phone")}/>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Username:</label>
                            <input type="text" className="form-control" value={userData.username}
                                   onChange={(e) => handleOnChangeInput(e.target.value, "username")}/>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Password (<span className="red">*</span>):</label>
                            <input type="password" className="form-control" value={userData.password}
                                   onChange={(e) => handleOnChangeInput(e.target.value, "password")}/>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Sex:</label>
                            <select className="form-select" aria-label="Default select example"
                                    onChange={(e) => handleOnChangeInput(e.target.value, "sex")}>
                                <option defaultValue="Male">Male</option>
                                <option value="Female">Famale</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Group (<span className="red">*</span>):</label>
                            <select className="form-select" aria-label="Default select example"
                                    onChange={(e) => handleOnChangeInput(e.target.value, "group")}>
                                {userGroup.length > 0 &&
                                userGroup.map((item, index) => {
                                    return (
                                        <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col-12 col-sm-12 form-group">
                            <label>Address:</label>
                            <input type="text" className="form-control" value={userData.address}
                                   onChange={(e) => handleOnChangeInput(e.target.value, "address")}/>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary">
                        Close
                    </Button>
                    <Button variant="primary">
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalUser;
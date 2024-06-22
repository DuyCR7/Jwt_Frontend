import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from "react";
import "./Users.scss";
import { fetchGroup, createUser } from "../../services/userService";
import {toast} from "react-toastify";
import _ from "lodash";

const ModalUser = (props) => {

    const [userGroup, setUserGroup] = useState([]);

    const defaultUserData = {
        email: "",
        phone: "",
        username: "",
        password: "",
        sex: "Male",
        address: "",
        groupId: ""
    }
    const [userData, setUserData] = useState(defaultUserData);

    const handleOnChangeInput = (value, name) => {
        let _userData = _.cloneDeep(userData);
        _userData[name] = value;
        setUserData(_userData);
    }

    const defaultValidInput = {
        email: true,
        phone: true,
        username: true,
        password: true,
        sex: true,
        address: true,
        groupId: true
    }

    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    const isValidInputs = () => {
        setObjCheckInput(defaultValidInput);

        let arr = ['email', 'phone', 'password', 'groupId'];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            if(!userData[arr[i]]){
                let _objCheckInput = _.cloneDeep(defaultValidInput);
                _objCheckInput[arr[i]] = false;
                setObjCheckInput(_objCheckInput);

                toast.error(`Please enter ${arr[i]}`);
                check = false;
                break;
            }
        }
        return check;
    }

    const handleSubmitCreate = async () => {
        let check = isValidInputs();
        if (check) {
            let res = await createUser(userData);
            if (res.data && res.data.EC === 0) {
                props.handleCloseModalUser();
                setUserData({...defaultUserData, groupId: userGroup[0].id});
                toast.success(res.data.EM);

                props.setCurrentPage(1);
                await props.fetchUsers(1);
            } else {
                toast.error(res.data.EM);
            }
        }
    }

    useEffect(() => {
        getGroups();
    }, []);

    const getGroups = async () => {
        let res = await fetchGroup();
        if (res && res.data && res.data.EC === 0){
            if (res.data.DT && res.data.DT.length > 0) {
                setUserGroup(res.data.DT);

                let groups = res.data.DT;
                setUserData({...userData, groupId: groups[0].id});
            }
        } else {
            toast.error(res.data.EM);
        }
    }

    return (
        <>
            <Modal show={props.isShowModalUser} onHide={props.handleCloseModalUser} size={"lg"} className="modal-user">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>{props.title}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 col-sm-6 form-group">
                            <label>Email (<span className="red">*</span>):</label>
                            <input type="email" className={objCheckInput.email ? "form-control" : "form-control is-invalid"} value={userData.email}
                                onChange={(e) => handleOnChangeInput(e.target.value, "email")}/>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Phone (<span className="red">*</span>):</label>
                            <input type="text" className={objCheckInput.phone ? "form-control" : "form-control is-invalid"} value={userData.phone}
                                   onChange={(e) => handleOnChangeInput(e.target.value, "phone")}/>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Username:</label>
                            <input type="text" className="form-control" value={userData.username}
                                   onChange={(e) => handleOnChangeInput(e.target.value, "username")}/>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Password (<span className="red">*</span>):</label>
                            <input type="password" className={objCheckInput.password ? "form-control" : "form-control is-invalid"} value={userData.password}
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
                            <select className={objCheckInput.groupId ? "form-select" : "form-select is-invalid"} aria-label="Default select example"
                                    onChange={(e) => handleOnChangeInput(e.target.value, "groupId")}>
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
                    <Button variant="secondary" onClick={props.handleCloseModalUser}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmitCreate()}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalUser;
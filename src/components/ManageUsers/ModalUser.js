import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useState, useEffect, useContext} from "react";
import "./Users.scss";
import {fetchGroup, createUser, updateUser} from "../../services/userService";
import {toast} from "react-toastify";
import _ from "lodash";
import { Spin } from 'antd';
import {UserContext} from "../../context/UserContext";

const ModalUser = (props) => {

    const { updateUserContext } = useContext(UserContext);

    const [userGroup, setUserGroup] = useState([]);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    const defaultUserData = {
        email: "",
        phone: "",
        username: "",
        password: "",
        sex: "Male",
        address: "",
        groupId: "",
    }
    const [userData, setUserData] = useState(defaultUserData);

    const handleOnChangeInput = (value, name) => {
        let _userData = _.cloneDeep(userData);
        _userData[name] = value;
        setUserData(_userData);
    }

    const handleUpLoadImage = (e) => {
        let _userData = _.cloneDeep(userData);

        if (e.target && e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
            _userData.image = e.target.files[0];
            setUserData(_userData);
        }
    }

    const defaultValidInput = {
        email: true,
        phone: true,
        username: true,
        password: true,
        sex: true,
        address: true,
        groupId: true,
        image: true,
    }

    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    const isValidInputs = () => {
        if(props.actionModalUser === "UPDATE") return true;

        setObjCheckInput(defaultValidInput);
        let arr = ['email', 'phone', 'password', 'groupId', 'image'];
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

    const handleSubmit = async () => {
        let check = isValidInputs();
        if (check) {
            setLoading(true);
            try {
                let res = props.actionModalUser === "CREATE" ?
                    await createUser(userData.email, userData.password, userData.username, userData.phone, image)
                    :
                    await updateUser(userData.id, userData.username, userData.address, userData.sex, userData.groupId, image);

                if (res && res.EC === 0) {
                    // console.log(res.DT);
                    props.handleCloseModalUser();
                    setUserData({...defaultUserData, groupId: userGroup[0].id});
                    setImage("");
                    setPreviewImage("");
                    toast.success(res.EM);

                    if(props.actionModalUser === "CREATE"){
                        props.setCurrentPage(1);
                        props.setSortConfig({ key: 'id', direction: 'DESC' });
                        await props.fetchUsers(1, props.numRows);
                    } else {
                        await props.fetchUsers(props.currentPage, props.numRows, props.searchKeyword, props.sortConfig);

                        updateUserContext(res.DT);
                    }

                } else {
                    toast.error(res.EM);

                    let _objCheckInput = _.cloneDeep(defaultValidInput);
                    _objCheckInput[res.DT] = false;
                    setObjCheckInput(_objCheckInput);
                }
            } catch (error) {
                console.log("Error: ", error);
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        getGroups();
    }, []);

    useEffect(() => {
        if(props.actionModalUser === "UPDATE"){
            // console.log(props.dataUpdate);
            setUserData({...props.dataUpdate,
                sex: props.dataUpdate.sex ? props.dataUpdate.sex: "Male",
                address: props.dataUpdate.address? props.dataUpdate.address : "",
                groupId: props.dataUpdate.Group ? props.dataUpdate.Group.id : userGroup[0].id});

            const imageData = props.dataUpdate.image ? `data:image/jpeg;base64,${props.dataUpdate.image}` : "";
            setPreviewImage(imageData);
        }
    }, [props.dataUpdate]);

    useEffect(() => {
        if(props.actionModalUser === "CREATE"){
            if(userGroup && userGroup.length > 0){
                setUserData({...defaultUserData, groupId: userGroup[0].id});
            }
        }
    }, [props.actionModalUser]);

    const getGroups = async () => {
        try {
            let res = await fetchGroup();
            if (res && res.EC === 0){
                if (res.DT && res.DT.length > 0) {
                    setUserGroup(res.DT);
                    let groups = res.DT;
                    setUserData({...userData, groupId: groups[0].id});
                }
            } else {
                // toast.error(res.EM);
            }
        } catch (error) {
            console.log("Error getGroups: ", error);
        }
    }

    const handleClickCloseModal = () => {
        props.handleCloseModalUser();
        setObjCheckInput(defaultValidInput);
        setUserData({...defaultUserData, groupId: userGroup[0].id});
        setImage("");
        setPreviewImage("");
    }

    return (
        <>
            <Modal show={props.isShowModalUser} onHide={() => handleClickCloseModal()} size={"lg"} className="modal-user" centered>
                <Spin spinning={loading}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>
                            {props.actionModalUser === 'CREATE' ? 'Create New User' : 'Edit User'}
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 col-sm-6 form-group">
                            <label>Email (<span className="red">*</span>):</label>
                            <input type="email"
                                   className={objCheckInput.email ? "form-control" : "form-control is-invalid"}
                                   value={userData.email || ""}
                                   onChange={(e) => handleOnChangeInput(e.target.value, "email")}
                                   disabled={props.actionModalUser === "CREATE" ? false : true}/>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Phone (<span className="red">*</span>):</label>
                            <input type="text"
                                   className={objCheckInput.phone ? "form-control" : "form-control is-invalid"}
                                   value={userData.phone || ""}
                                   onChange={(e) => handleOnChangeInput(e.target.value, "phone")}
                                   disabled={props.actionModalUser === "CREATE" ? false : true}/>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Username:</label>
                            <input type="text" className="form-control"
                                   value={userData.username || ""}
                                   onChange={(e) => handleOnChangeInput(e.target.value, "username")}/>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            {props.actionModalUser === "CREATE" &&
                                <>
                                    <label>Password (<span className="red">*</span>):</label>
                                    <input type="password"
                                           className={objCheckInput.password ? "form-control" : "form-control is-invalid"}
                                           value={userData.password || ""}
                                           onChange={(e) => handleOnChangeInput(e.target.value, "password")}/>
                                </>
                            }
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Sex:</label>
                            <select className="form-select" aria-label="Default select example"
                                    onChange={(e) => handleOnChangeInput(e.target.value, "sex")}
                                    value={userData.sex || ""}>
                                <option defaultValue="Male">Male</option>
                                <option value="Female">Famale</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Group (<span className="red">*</span>):</label>
                            <select className={objCheckInput.groupId ? "form-select" : "form-select is-invalid"}
                                    aria-label="Default select example"
                                    onChange={(e) => handleOnChangeInput(e.target.value, "groupId")}
                                    value={userData.groupId || ""}>
                                {userGroup.length > 0 &&
                                    userGroup.map((item, index) => {
                                        return (
                                            <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                        )
                                    })}
                            </select>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Address:</label>
                            <input type="text" className="form-control"
                                   value={userData.address || ""}
                                   onChange={(e) => handleOnChangeInput(e.target.value, "address")}/>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Image (<span className="red">*</span>):</label>
                            <input type="file" className="form-control"
                                   onChange={(e) => handleUpLoadImage(e)}/>
                        </div>
                        {previewImage === "" || previewImage === null ? ""
                            :
                            <div className="col-12 col-sm-12 form-group mt-3 text-center">
                                <img src={previewImage} width={110} height={110}/>
                            </div>
                        }
                    </div>
                </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClickCloseModal()}>
                        Close
                        </Button>
                        <Button variant="primary" onClick={() => handleSubmit()}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Spin>
            </Modal>
        </>
    )
}

export default ModalUser;
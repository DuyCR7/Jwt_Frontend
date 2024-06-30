import "./Role.scss";
import {useRef, useState} from "react";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import {toast} from "react-toastify";
import {createRoles, restoreManyRoles, restoreRole} from "../../services/roleService";
import TableRole from "./TableRole";
import { Spin } from 'antd';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import TrashRole from "./TrashRole";

const Role = (props) => {

    const childRef = useRef();
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState('manage-role');
    const [listRoles, setListRoles] = useState([]);

    const dataChildDefault = {
        url: '',
        description: '',
        isValidUrl: true
    }
    const [listChild, setListChild] = useState({
        child_1: dataChildDefault
    });

    const handleOnchangeInput = (name, value, key) => {
        let _listChild = _.cloneDeep(listChild);
        _listChild[key][name] = value;

        if(value && name === 'url'){
            _listChild[key].isValidUrl = true;
        }

        setListChild(_listChild);
    }

    const handleAddNewInput = () => {
        let _listChild = _.cloneDeep(listChild);
        _listChild[`child_${uuidv4()}`] = dataChildDefault;
        setListChild(_listChild);
    }

    const handleDeleteInput = (key) => {
        let _listChild = _.cloneDeep(listChild);
        delete _listChild[key];
        setListChild(_listChild);
    }

    const buildDataToPersist = () => {
        let _listChild = _.cloneDeep(listChild);
        let result = [];
        Object.entries(listChild).find(([key, child], index) => {
            result.push({
                url: child.url,
                description: child.description,
            })
        })
        return result;
    }

    const handleSave = async () => {

        let inValidObj = Object.entries(listChild).find(([key, child], index) => {
            return child && !child.url;
        })

        if(!inValidObj){
            // call api
            let data = buildDataToPersist();
            setLoading(true);
            try {
                let res = await createRoles(data);
                // console.log("Check res: ", res);
                if(res && res.EC === 0){
                    setListChild({child_1: dataChildDefault});
                    toast.success(res.EM);
                    childRef.current.fetchListRolesAgain();
                } else {
                    toast.error(res.EM);
                }
            } catch (error) {
                console.log("Error creating role: ", error);
            } finally {
                setLoading(false);
            }
            // console.log("Check data build: ", data);
        } else {
            // console.log(inValidObj);
            toast.error("Please enter URL!");
            let _listChild = _.cloneDeep(listChild);

            const key = inValidObj[0];
            _listChild[key]['isValidUrl'] = false;
            setListChild(_listChild);
        }
    }

    // console.log(listChild);

    const handleDeleteRoleSuccess = async () => {
        // Cập nhật lại listRoles trong state của Role component
        setListRoles(childRef.current.getListRoles());
        // Chuyển sang tab Thùng rác
        setKey('trash-role');
    };

    const handleRestoreRole = async (role) => {
        setLoading(true);
        try {
            let res = await restoreRole(role); // Hàm khôi phục vai trò từ API
            if (res && res.EC === 0) {
                toast.success(res.EM);

                setKey('manage-role');
                childRef.current.fetchListRolesAgain();
                setListRoles(childRef.current.getListRoles());
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            console.log("Error restoring role: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreManyRoles = async (ids) => {
        setLoading(true);
        try {
            let res = await restoreManyRoles(ids);
            if (res && res.EC === 0) {
                toast.success(res.EM);

                setKey('manage-role');
                childRef.current.fetchListRolesAgain();
                setListRoles(childRef.current.getListRoles());
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            console.log("Error restoring many roles: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Tabs
                id="role-tab"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
                fill
                variant={"underline"}
            >
                <Tab eventKey="manage-role" title="Manage Role">
                    <div className="role-container">
                        <div className="container">
                            <div className="mt-3">
                                <div className="title">
                                    <h4>Add a new role</h4>
                                </div>
                                <hr/>
                                <div className="role-parent">
                                    {
                                        Object.entries(listChild).map(([key, child], index) => {
                                            return (
                                                <div className="row role-child" key={`child-${key}`}>
                                                    <div className={`col-sm-6 col-12 form-group ${key}`}>
                                                        <label>URL:</label>
                                                        <input type="text"
                                                               className={child.isValidUrl ? "form-control" : "form-control is-invalid"}
                                                               value={child.url}
                                                               onChange={(e) => handleOnchangeInput("url", e.target.value, key)}/>
                                                    </div>
                                                    <div className="col-sm-6 col-12 form-group">
                                                        <label>Description:</label>
                                                        <input type="text" className="form-control"
                                                               value={child.description}
                                                               onChange={(e) => handleOnchangeInput("description", e.target.value, key)}/>
                                                    </div>
                                                    <div className="col-sm-12 col-12 mt-4 text-end">
                                                        <button
                                                            className={index >= 1 ? "btn btn-primary mx-2" : "btn btn-primary"}
                                                            onClick={() => handleAddNewInput()}>
                                                            <i className="fa fa-plus-circle"></i>
                                                        </button>
                                                        {index >= 1 &&
                                                            <button className="btn btn-warning"
                                                                    onClick={() => handleDeleteInput(key)}>
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className="text-center text-sm-end">
                                        <Spin spinning={loading}>
                                            <button className="btn btn-success mt-3" onClick={() => handleSave()}>Save
                                            </button>
                                        </Spin>
                                    </div>
                                </div>
                            </div>

                            <hr/>
                            <div className="mt-3">
                                <h4>List Current Roles</h4>
                                <TableRole ref={childRef} handleDeleteRoleSuccess={handleDeleteRoleSuccess}/>
                            </div>
                        </div>
                    </div>
                </Tab>

                <Tab eventKey="trash-role" title="Trash Role">
                    <div className="container">
                        <div className="mt-3">
                            <div className="title">
                                <h4>List Trash Roles</h4>
                                <TrashRole
                                    listRoles={listRoles}
                                    handleRestoreRole={handleRestoreRole}
                                    handleRestoreManyRoles={handleRestoreManyRoles}
                                />
                            </div>
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </>
    )
}

export default Role;
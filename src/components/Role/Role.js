import "./Role.scss";
import {useRef, useState} from "react";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import {toast} from "react-toastify";
import {createRoles} from "../../services/roleService";
import TableRole from "./TableRole";

const Role = (props) => {

    const childRef = useRef();

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
            let res = await createRoles(data);
            // console.log("Check res: ", res);
            if(res && res.EC === 0){
                setListChild({child_1: dataChildDefault});
                toast.success(res.EM);
                childRef.current.fetchListRolesAgain();
            } else {
                toast.error(res.EM);
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

    return (
        <>
            <div className="role-container">
                <div className="container">
                    <div className="mt-3">
                        <div className="title">
                            <h4>Add a new role</h4>
                        </div>
                        <div className="role-parent">
                            {
                                Object.entries(listChild).map(([key, child], index) => {
                                    return (
                                            <div className="row role-child" key={`child-${key}`}>
                                                <div className={`col-5 form-group ${key}`}>
                                                    <label>URL:</label>
                                                    <input type="text" className={child.isValidUrl ? "form-control" : "form-control is-invalid"} value={child.url}
                                                            onChange={(e) => handleOnchangeInput("url", e.target.value, key)}/>
                                                </div>
                                                <div className="col-5 form-group">
                                                    <label>Description:</label>
                                                    <input type="text" className="form-control" value={child.description}
                                                            onChange={(e) => handleOnchangeInput("description", e.target.value, key)}/>
                                                </div>
                                                <div className="col-2 mt-4">
                                                    <button className="btn btn-primary me-3" onClick={() => handleAddNewInput()}>
                                                        <i className="fa fa-plus-circle"></i>
                                                    </button>
                                                    {index >= 1 &&
                                                    <button className="btn btn-warning" onClick={() => handleDeleteInput(key)}>
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                    }
                                                </div>
                                            </div>
                                    )
                                })
                            }
                            <div>
                                <button className="btn btn-success mt-3" onClick={() => handleSave()}>Save</button>
                            </div>
                        </div>
                    </div>

                    <hr />
                    <div className="mt-3">
                        <h4>List Current Roles</h4>
                        <TableRole ref={childRef}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Role;
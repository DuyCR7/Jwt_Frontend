import "./GroupRole.scss";
import {useEffect, useState} from "react";
import {fetchGroup} from "../../services/userService";
import { getAllRoles, getRolesByGroup, assignRolesToGroup } from "../../services/roleService";
import {toast} from "react-toastify";
import _ from "lodash";
import { Spin } from "antd";

const GroupRole = (props) => {

    const [userGroup, setUserGroup] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [loading, setLoading] = useState(false);

    const [assignedRolesByGroup, setAssignedRolesByGroup] = useState([]);

    useEffect(() => {
        getGroups();
        fetchAllRoles();
    }, []);

    const getGroups = async () => {
        try {
            let res = await fetchGroup();
            if (res && res.EC === 0){
                if (res.DT && res.DT.length > 0) {
                    setUserGroup(res.DT);
                }
            } else {
                // toast.error(res.EM);
            }
        } catch (error) {
            console.log("Error getGroups: ", error);
        }
    }

    const fetchAllRoles = async () => {
        try {
            let res = await getAllRoles();
            if(res && res.EC === 0) {
                setListRoles(res.DT);
            }
        } catch (error) {
            console.log("Failed to fetch listRoles: ", error);
        }
    }

    const handleOnChangeGroup = async (value) => {
        setSelectedGroup(value);

        if(value){
            setLoading(true);
            try {
                let res = await getRolesByGroup(value);
                if(res && res.EC === 0) {
                    // console.log("List routes: ", listRoles);
                    // console.log("Check data role by group:" ,res.DT);
                    let result = buildDataRolesByGroup(res.DT.Roles, listRoles);
                    // console.log("Check result: ", result);
                    setAssignedRolesByGroup(result);
                }
            } catch (error) {
                console.log("Error getting roles: ", error);
            }
            finally {
                setLoading(false);
            }
        }
    }

    const buildDataRolesByGroup = (groupRoles, allRoles) => {
        let result = [];
        if(allRoles && allRoles.length > 0) {
            allRoles.map((role) => {
                let object = {};
                object.id = role.id;
                object.url = role.url;
                object.description = role.description;
                object.isAssigned = false;

                if(groupRoles && groupRoles.length > 0) {
                    object.isAssigned = groupRoles.some((item) => item.url === object.url);
                }

                result.push(object);
            })
        }
        return result;
    }

    const handleSelectRole = (value) => {
        // console.log(assignedRolesByGroup);
        let _assignedRolesByGroup = _.cloneDeep(assignedRolesByGroup);
        let foundIndex = _assignedRolesByGroup.findIndex(item => +item.id === +value);
        // console.log(foundIndex);
        if(foundIndex > -1) {
            _assignedRolesByGroup[foundIndex].isAssigned = !_assignedRolesByGroup[foundIndex].isAssigned;
        }
        setAssignedRolesByGroup(_assignedRolesByGroup);
    }

    const buildDataToSave = () => {
        // data = {groupId, groupRoles: [{}, {} ]}
        let _assignedRolesByGroup = _.cloneDeep(assignedRolesByGroup);
        let result = {};

        result.groupId = selectedGroup;

        let groupRolesFilter = _assignedRolesByGroup.filter(item => item.isAssigned === true);
        let finalGroupRoles = groupRolesFilter.map(item => {
            let itemFilter = {groupId: +selectedGroup, roleId: +item.id};
            return itemFilter;
        })
        result.groupRoles = finalGroupRoles;
        return result;
    }

    const handleSaveAssign = async () => {
        let data = buildDataToSave();
        // console.log("Check raw data", assignedRolesByGroup);
        // console.log("Check data build: ", data);
        setLoading(true);
        try {
            let res = await assignRolesToGroup(data);
            if(res && res.EC === 0){
                toast.success(res.EM);
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            console.log("Error assing roles to group:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="group-role-container">
            <div className="container">
                <div className="title mt-3">
                    <h4>Group Role</h4>
                </div>
                <div className="assign-group-role mt-3">
                    <div className="col-12 form-group">
                        <label>Select Group (<span className="red">*</span>):</label>
                        <select className="form-select mt-3" onChange={(e) => handleOnChangeGroup(e.target.value)}>
                            <option value="">--- Please select group ---</option>
                            {userGroup.length > 0 &&
                                userGroup.map((item, index) => {
                                    return (
                                        <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                    )
                                })}
                        </select>
                    </div>
                    <hr />

                    {selectedGroup &&
                        <Spin spinning={loading}>
                    <div className="roles">
                        <h5>Assign Roles</h5>
                        {
                            assignedRolesByGroup && assignedRolesByGroup.length > 0 &&
                            assignedRolesByGroup.map((item, index) => {
                                return (
                                    <div className="form-check" key={`list-role-${index}`}>
                                        <input className="form-check-input" type="checkbox" value={item.id}
                                               id={`list-role-${index}`}
                                               checked={item.isAssigned}
                                               onChange={(e) => handleSelectRole(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor={`list-role-${index}`}>
                                            {item.url} - <i style={{ color: 'green' }}>({item.description})</i>
                                        </label>
                                    </div>
                                )
                            })
                        }
                        <div className="mt-3">
                            <button className="btn btn-warning" onClick={() => handleSaveAssign()}>Save</button>
                        </div>
                    </div>
                        </Spin>
                    }
                </div>
            </div>
        </div>
    )
}

export default GroupRole;
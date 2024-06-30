import axios from "../config/axios";

const createRoles = (roles) => {
    return axios.post("/api/v1/role/create", [...roles]);
}

const getAllRoles = () => {
    return axios.get("/api/v1/role/read");
}

const fetchAllRolesWithPaginate = (page, limit) => {
    return axios.get(`/api/v1/role/read?page=${page}&limit=${limit}`);
}

const deleteRole = (data) => {
    return axios.put("/api/v1/role/delete", {...data});
}

const updateRole = (data) => {
    return axios.put("/api/v1/role/update", {...data});
}

const getRolesByGroup = (groupId) => {
    return axios.get(`/api/v1/role/by-group/${groupId}`);
}

const assignRolesToGroup = (data) => {
    return axios.post("/api/v1/role/assign-to-group", {data});
}

const deleteManyRoles = (selectedIds) => {
    return axios.post("/api/v1/role/delete-many", selectedIds);
}

const getAllTrash = () => {
    return axios.get("/api/v1/role/read-trash");
}

const restoreRole = (data) => {
    return axios.put("/api/v1/role/restore", {...data});
}

const restoreManyRoles = (selectedIds) => {
    return axios.post("/api/v1/role/restore-many", selectedIds);
}

export {
    createRoles,
    getAllRoles,
    deleteRole,
    fetchAllRolesWithPaginate,
    updateRole,
    getRolesByGroup,
    assignRolesToGroup,
    deleteManyRoles,
    getAllTrash,
    restoreRole,
    restoreManyRoles
}
// import axios from "axios";
import axios from "../config/axios";

const registerNewUser = (email, phone, username, password) => {
    return axios.post("/api/v1/register", {
        email, phone, username, password
    })
}

const loginUser = (valueLogin, password) => {
    return axios.post("/api/v1/login", {
        valueLogin, password
    })
}

const fetchAllUsers = (page, limit) => {
    return axios.get(`/api/v1/user/read?page=${page}&limit=${limit}`);
}

const deleteUser = (user) => {
    return axios.delete("/api/v1/user/delete", { data: {id: user.id} });
}

const fetchGroup = () => {
    return axios.get("/api/v1/group/read");
}

const createUser = (data) => {
    return axios.post("/api/v1/user/create", {...data});
}

const updateUser = (data) => {
    return axios.put("/api/v1/user/update", {...data});
}

const getUserAccount = () => {
    return axios.get("/api/v1/account");
}

const logoutUser = () => {
    return axios.post("/api/v1/logout");
}

const getUserById = (id) => {
    return axios.get(`/api/v1/user/get-by-id/${id}`);
}

const refreshToken = () => {
    return axios.post("/api/v1/refresh-token");
}

export {
    registerNewUser,
    loginUser,
    fetchAllUsers,
    deleteUser,
    fetchGroup,
    createUser,
    updateUser,
    getUserAccount,
    logoutUser,
    getUserById,
    refreshToken
}
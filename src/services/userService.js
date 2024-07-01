// import axios from "axios";
import axios from "../config/axios";

const registerNewUser = (email, phone, username, password) => {
    return axios.post("/api/v1/register", {
        email, phone, username, password
    })
}

const loginUser = (valueLogin, password) => {
    return axios.post("/api/v1/login", {
        valueLogin, password, delay: 2000
    });
}

const fetchAllUsers = (page, limit, search = "", sort = {}) => {
    let query = `/api/v1/user/read?page=${page}&limit=${limit}`;

    if (search) {
        query += `&search=${encodeURIComponent(search)}`;
    }

    if (sort && sort.key && sort.direction) {
        const sortQuery = JSON.stringify(sort);
        query += `&sort=${encodeURIComponent(sortQuery)}`;
    }

    return axios.get(query);
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
import axios from "axios";

const registerNewUser = (email, phone, username, password) => {
    return axios.post("http://localhost:8080/api/v1/register", {
        email, phone, username, password
    })
}

const loginUser = (valueLogin, password) => {
    return axios.post("http://localhost:8080/api/v1/login", {
        valueLogin, password
    })
}

const fetchAllUsers = (page, limit) => {
    return axios.get(`http://localhost:8080/api/v1/user/read?page=${page}&limit=${limit}`);
}

const deleteUser = (user) => {
    return axios.delete("http://localhost:8080/api/v1/user/delete", { data: {id: user.id} });
}

const fetchGroup = () => {
    return axios.get("http://localhost:8080/api/v1/group/read");
}

const createUser = (data) => {
    return axios.post("http://localhost:8080/api/v1/user/create", {...data});
}

const updateUser = (data) => {
    return axios.put("http://localhost:8080/api/v1/user/update", {...data});
}

export {
    registerNewUser,
    loginUser,
    fetchAllUsers,
    deleteUser,
    fetchGroup,
    createUser,
    updateUser
}
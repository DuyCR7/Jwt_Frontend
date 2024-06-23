import axios from 'axios';
import { toast } from "react-toastify";

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: 'http://localhost:8080'
});

// các request gửi lên server sẽ đính kèm cookie vào
instance.defaults.withCredentials = true;

// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = "AUTH_TOKEN";

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const status = error && error.response && error.response.status || 500;
    switch (status) {
        // authentication (token related issues)
        case 401: {
            toast.error("Unauthorized! Please login!");
            // window.location.href = "/login";
            return error.response.data;
        }

        // forbidden (permission related issues)
        case 403: {
            toast.error("You don't permission to access!");
            return error.response.data;
        }

        // bad request
        case 400: {
            return error.response.data;
        }

        // not found
        case 404: {
            return error.response.data;
        }

        // conflict
        case 409: {
            return error.response.data;
        }

        // unprocessable
        case 422: {
            return error.response.data;
        }

        // generic api error (server related) unexpected
        default: {
            return error.response.data;
        }
    }
});

export default instance;
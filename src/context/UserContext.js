import React, {useEffect, useState} from "react";
import { getUserAccount, getUserById } from "../services/userService";

const UserContext = React.createContext(null)

const UserProvider = ({ children }) => {
    // User is the name of the "data" that gets stored in context
    const userDefault = {
        isLoading: true,
        isAuthenticated: false,
        token: '',
        account: {},
    }
    const [user, setUser] = useState(userDefault);

    // Login updates the user data with a name parameter
    const loginContext = (userData) => {
        setUser({...userData, isLoading: false});
    };

    // Logout updates the user data to default
    const logoutContext = () => {
        setUser({...userDefault, isLoading: false});
    };

    const updateUserContext = (updatedUser) => {
        setUser((prevUser) => ({
            ...prevUser,
            account: {
                ...prevUser.account,
                username: updatedUser.username,
                sex: updatedUser.sex,
                address: updatedUser.address,
                groupId: updatedUser.groupId,
                image: `data:image/jpeg;base64,${updatedUser.image}`,
            },
        }));
    };

    const fetchUser = async () => {
        try {
            let res = await getUserAccount();
            if (res && res.EC === 0) {
                let groupWithRoles = res.DT.groupWithRoles;
                let email = res.DT.email;
                // let username = res.DT.username;
                let username = "";
                let image = "";
                let token = res.DT.access_token;
                let id = res.DT.id;
                let userFetch = await getUserById(id);
                if (userFetch && userFetch.EC === 0){
                    username = userFetch.DT.username;
                    image = `data:image/jpeg;base64,${userFetch.DT.image}`;
                } else {
                    username = res.DT.username;
                }

                let data = {
                    isAuthenticated: true,
                    token: token,
                    account: {
                        id,
                        groupWithRoles,
                        email,
                        username,
                        image,
                        isLoading: false
                    }
                }
                setUser(data);
            } else {
                setUser({...userDefault, isLoading: false});
            }
        } catch (error) {
            console.log("Error getting user data: ", error);
        }
    }

    useEffect(() => {
        // if(window.location.pathname !== '/' && window.location.pathname !== '/login'){
        //     fetchUser();
        // } else {
        //     setUser({...user, isLoading: false});
        // }
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loginContext, logoutContext, updateUserContext }}>
            {children}
        </UserContext.Provider>
    );
}

export {
    UserContext,
    UserProvider,
}
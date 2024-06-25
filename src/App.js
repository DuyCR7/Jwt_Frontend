import "./App.scss";
import NavHeader from "./components/Navigation/NavHeader";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useContext, useEffect, useState} from "react";
import AppRoutes from "./routes/AppRoutes";
import { Rings } from 'react-loader-spinner'
import {UserContext} from "./context/UserContext";
import { Scrollbars } from 'react-custom-scrollbars-2';

function App() {
    const { user } = useContext(UserContext);
    const [scrollHeight, setScrollHeight] = useState(0);

    useEffect(() => {
        let windowHeight = window.innerHeight;
        setScrollHeight(windowHeight);
    }, [user]);

  return (
      <>
          <Scrollbars autoHide style={{height: scrollHeight}}>
            <Router>
                {user && user.isLoading ?
                    <div className="loading-container">
                        <Rings
                            visible={true}
                            height="80"
                            width="80"
                            color="#1877f2"
                            ariaLabel="rings-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                        <div style={{color: "#1887f2", fontWeight: "bold"}}>Loading data...</div>
                    </div>
                    :
                    <>
                        <div className="app-header">
                            <NavHeader/>
                        </div>
                        <div className="app-container">
                            <AppRoutes/>
                        </div>
                    </>
                }
            </Router>

            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
          </Scrollbars>
      </>
  );
}

export default App;

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { backend_url } from "./AddDishForm";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isAuth, loginUser, logoutUser } = useContext(AuthContext); // Consume the AuthContext

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleTooltipToggle = () => {
    setShowTooltip(!showTooltip);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  if(isAuth==false && isAdmin==false){
    axios
      .post(`${backend_url}/admin/login`, { username, password })
      .then((res) => {
        // Check if login was successful
      //  console.log(res)
        if (res.data.token === "Admin-power") {
          setIsAdmin(true);
          loginUser()
          localStorage.setItem("token", res.data.token);
        }
      })
      .catch((err) => {
        // Handle login error
        console.log(err);
      });
    
    setUsername("");
    setPassword("");
  }else{
      setIsAdmin(false)
    }

  };

  const handleLogout = () => {
    // Implement a function to log out the admin
    axios
    .get(`${backend_url}/admin/logout`)
    .then((res) => {
      logoutUser(); // Update authentication state to false
      <Navigate to='/' />
    })
    .catch((err) => {
      console.log(err);
    });
   
    
  };

  return (
    <section class="section section-divider white blog" id="blog">
    <div class="container">
      {isAuth ? (
        <>
          <h2  className="h2 section-title">Welcome <span className="span">Admin!</span>  </h2>
          <button  className="btn btn-hover" onClick={handleLogout}>Logout</button>
        
        </>
      ) : (
        <>
          <h2 class="h2 section-title"> Login   <span class="span">Form</span>   </h2>
   
          <form className="login-form" onSubmit={handleSubmit} method="POST">
            <div className="input-wrapper">
              <label htmlFor="username">Username:</label>
              <input
              placeholder="username, admin"
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                required
                className="input-field"
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="password">
                Password:
                <span
                  className="info-icon"
                  onMouseEnter={handleTooltipToggle}
                  onMouseLeave={handleTooltipToggle}
                >
                  ℹ️
                  {showTooltip && (
                    <span className="tooltip">
                      <p>Username: admin</p>
                      <p>Password: admin</p>
                    </span>
                  )}
                </span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="input-field"
                placeholder="password, admin"
              />
            </div>
            <button type="submit" className="btn" >
              Login
            </button>
          </form>
        </>
      )}
    </div>
    </section>
  );
};

export default Login;

import { Link, useLocation } from "react-router-dom";
import React, { useContext, useEffect, useRef } from "react";
import Dishes from "./Dishes";
import { AuthContext } from "../context/AuthContext";
import { ChevronUp } from "react-ionicons";
import HeroBanner from "./homepage/HeroBanner";

const HomePage = () => {
  const { isAuth, loginUser, logoutUser } = useContext(AuthContext); // Consume the AuthContext
  const navbar = useRef(null);
  const header=useRef(null)
  const backTopBtn=useRef(null)
  const togglebutton=useRef(null)
  // Get the current location using the useLocation hook from react-router-dom
  const location = useLocation();
  function toggleNavbar() {
    navbar.current.classList.toggle("active");
    togglebutton.current.classList.toggle("active");
  }
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 100) {
        header.current.classList.add("active");
        backTopBtn.current.classList.add("active");
      } else {
        header.current.classList.remove("active");
        backTopBtn.current.classList.remove("active");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  
  return (
    <>
      <header className="header" ref={header} >
        <div className="container">
          <h1>
            <Link to="/" className="logo">
              TastyBites<span className="span">.</span>
            </Link>
          </h1>
          <nav className="navbar" ref={navbar}>
            <ul className="navbar-list">
              <li className="nav-item" onClick={toggleNavbar}>
                <Link
                  className="navbar-link"
                  to="/"
                  onClick={() =>
                    location.pathname === "/" && window.location.reload()
                  }
                >
                  Home
                </Link>
              </li>
              {!isAuth && (
                <li className="nav-item" onClick={toggleNavbar} >
                  <Link className="navbar-link" to="/login">
                    Login
                  </Link>
                </li>
              )}
              <li className="nav-item" onClick={toggleNavbar}>
                <Link className="navbar-link" to="/chatbot">
                  Chatbot
                </Link>
              </li>
              {isAuth && (
                <>
                  <li className="nav-item" onClick={toggleNavbar}>
                    <Link className="navbar-link" to="/add-dish">
                      Add Dish
                    </Link>
                  </li>
                  <li className="nav-item" onClick={toggleNavbar} >
                    <Link
                      className="navbar-link"
                      to="/login"
                      onClick={logoutUser}
                    >
                      Logout
                    </Link>
                  </li>
                </>
              )}
              <li className="nav-item" onClick={toggleNavbar}>
                <Link className="navbar-link" to="/feedback">
                  Feedback
                </Link>
              </li>
              {isAuth && (
                <li className="nav-item" onClick={toggleNavbar}>
                  <Link className="navbar-link" to="/menu">
                   Menu
                  </Link>
                </li>
              )}
               {isAuth && (
                <li className="nav-item" onClick={toggleNavbar}>
                  <Link className="navbar-link" to="/orders">
                    Order List
                  </Link>
                </li>
              )}
              <button className="btn btn-hover"> <li className="nav-item" onClick={toggleNavbar}>
                <Link className="navbar-link" to="/order">

                  Place Order
                  
                </Link>
              </li></button>   
           
           
            </ul>
          </nav>
          <div class="header-btn-group">
            {" "}
            <button
              className="nav-toggle-btn"
              aria-label="Toggle Menu"
              onClick={toggleNavbar}
              ref={togglebutton}
            >
              <span className="line top"></span>
              <span className="line middle"></span>
              <span className="line bottom"></span>
            </button>{" "}
          </div>
        </div>

      </header>
      <a href="#" className="back-top-btn" aria-label="Back to top" ref={backTopBtn}>
   
    <ChevronUp  color="#fff" />
  </a>
<HeroBanner/>
    </>
  );
};

export default HomePage;

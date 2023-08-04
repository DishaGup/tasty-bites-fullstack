import React from 'react'
import { LogoFacebook, LogoInstagram, LogoNodejs, LogoPinterest, LogoTwitter } from 'react-ionicons'
const Footer = () => {
  return (
    <footer className="footer">

    <div className="footer-top" style={{backgroundImage: "url('/Images/footer-illustration.png')"}}>
      <div className="container">

        <div className="footer-brand">

          <a href="" className="logo">TastyBites<span className="span">.</span></a>

          <p className="footer-text">
            Financial experts support or help you to to find out which way you can raise your funds more.
          </p>

          <ul className="social-list">

            <li>
              <a href="#" className="social-link">
                
                <LogoFacebook className="myButton"  color="#fff"  />
              </a>
            </li>

            <li>
              <a href="#" className="social-link">
                
                <LogoTwitter className="myButton" color="#fff" />
                
              </a>
            </li>

            <li>
              <a href="#" className="social-link">
               
                <LogoInstagram className="myButton"  color="#fff" />
              </a>
            </li>

            <li>
              <a href="#" className="social-link">
               
                <LogoPinterest className="myButton"  color="#fff"  />
              </a>
            </li>

          </ul>

        </div>

        <ul className="footer-list">

          <li>
            <p className="footer-list-title">Contact Info</p>
          </li>

          <li>
            <p className="footer-list-item">+91 (062) 109-2022</p>
          </li>

          <li>
            <p className="footer-list-item">Tastybite@notreal.com</p>
          </li>

          <li>
            <address className="footer-list-item">121/3 Opera House, Delhi</address>
          </li>

        </ul>

        <ul className="footer-list">

          <li>
            <p className="footer-list-title">Opening Hours</p>
          </li>

          <li>
            <p className="footer-list-item">Monday-Friday: 08:00-22:00</p>
          </li>

          <li>
            <p className="footer-list-item">Tuesday 4PM: Till Mid Night</p>
          </li>

          <li>
            <p className="footer-list-item">Saturday: 10:00-16:00</p>
          </li>

        </ul>


      </div>
    </div>


  </footer>



  )
}

export default Footer
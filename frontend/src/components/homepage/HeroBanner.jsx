import React from 'react'
import { Link, Navigate } from 'react-router-dom';

const HeroBanner = () => {


  
  return (
    <section className="hero" id="home" style={{backgroundImage: "url('/Images/hero-bg.jpg')"}}>
    <div className="container">

      <div className="hero-content">

        <p className="hero-subtitle">Eat Sleep And</p>

        <h2 className="h1 hero-title">Supper delicious Burger in town!</h2>

        <p className="hero-text">Food is any substance consumed to provide nutritional support for an organism.</p>

        <button className="btn"  ><Link to='/orders'>See Orders</Link> </button>

      </div>

      <figure className="hero-banner">
        <img src="/Images/hero-banner-bg.png" width="820" height="716" alt="hero-banner-bg" aria-hidden="true"
          className="w-100 hero-img-bg"   />

        <img src="/Images/hero-banner.png" width="700" height="637"  alt="Burger"
          className="w-100 hero-img" />
      </figure>

    </div>
  </section>

  )
}

export default HeroBanner
import React from 'react'

const Delivery = () => {
  return (
    <section className="section section-divider gray delivery">
    <div className="container">

      <div className="delivery-content">

        <h2 className="h2 section-title">
          A Moments Of Delivered On <span className="span">Right Time</span> & Place
        </h2>

        <p className="section-text">
          The restaurants in Hangzhou also catered to many northern Chinese who had fled south from Kaifeng during
          the Jurchen
          invasion of the 1120s, while it is also known that many restaurants were run by families.
        </p>

        <button className="btn btn-hover">Order Now</button>
      </div>

      <figure className="delivery-banner">
        <img src="/Images/delivery-banner-bg.png" width="700" height="602" loading="lazy" alt="clouds"
          className="w-100" />

        <img src="/Images/delivery-boy.svg" width="1000" height="880" loading="lazy" alt="delivery boy"
          className="w-100 delivery-img" data-delivery-boy />
      </figure>

    </div>
  </section>
  )
}

export default Delivery
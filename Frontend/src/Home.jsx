import "./Home.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import axios from "axios";

function Home() {

const navigate = useNavigate();

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  const toggleSound = () => {
    const video = document.getElementById("homeVideo");
    video.muted = !video.muted;
  };


  return (
    <div className="home">

  <section className="hero">
    <img
      src="/banner.jpeg"
      alt="HRX Banner"
      className="hero-img"
    />
  </section>


      <section className="collection">
       <div className="container">

        <div className="collection-top">
         <div>
                        <p className="collection-label">COLLECTION</p>
            <h2>REDEFINE YOUR FITNESS EXPERIENCE</h2>
          </div>
             <button className="view-btn" onClick={() => navigate("/productview")}>Shop More</button>
       </div>

          <Carousel
             responsive={responsive}
             infinite
             autoPlay
            autoPlaySpeed={3000}
            arrows
             itemClass="carousel-item"
           >
             <div className="product-carda">
               <img src="/slide1.png" alt="Apparel" />
               <h3>EYEWEAR</h3>
             </div>

             <div className="product-carda">
               <img src="/slide2.png" alt="Accessories" />
               <h3>WEARABLE</h3>
            </div>

           <div className="product-carda">
               <img src="/slide6.png" alt="Equipments" />
              <h3>BAG</h3>
             </div>

             <div className="product-carda">
               <img src="/slide7.png" alt="Eyewear" />
               <h3>CAP</h3>
             </div>

           </Carousel>
         </div>
       </section>

   
      <section className="video-section">
         <video
           id="homeVideo"
           src="/homev.mp4"
           autoPlay
           muted
           loop
           className="home-video"
        />

        <button className="sound-btn" onClick={toggleSound}>
           🔊
         </button>
       </section>



  <section className="brands">
  <div className="bcontainer">
    
    <div className="brand-header">
      <p className="brand-label">AFFILIATE BRANDS</p>
      <h2>OUR PROUD PARTNERS</h2>
    </div>

    <div className="slider">
  <div className="slide-track">
    <img src="/myntra.svg" className="brand-logo" alt="Myntra" />
    <img src="/cult.svg" className="brand-logo" alt="Cult" />
    <img src="/noise.svg" className="brand-logo" alt="Noise" />
    <img src="/flipkart.svg" className="brand-logo" alt="Flipkart" />
    <img src="/bakarose.svg" className="brand-logo" alt="Bakarose" />
    <img src="/eatfit.svg" className="brand-logo" alt="Eatfit" />
    <img src="/mindler.svg" className="brand-logo" alt="Mindler" />
    <img src="/noise.svg" className="brand-logo" alt="Noise" />
  </div>
</div>
  </div>
</section>

</div>




  );
}

export default Home;









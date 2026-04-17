import React, { useState } from "react";
import "./Connect.css";

function Connect() {
  const [activeCity, setActiveCity] = useState("Bangalore");
  const [activeCafeCity, setActiveCafeCity] = useState("Mumbai");

  const gymLocations = {
    Bangalore: {
      name: "HRX GYM",
      address: `3rd Floor, V n V Towers, Nimma Super Market,
11, 24th Main Rd, above 10, Paradise Colony,
JP Nagar 7th Phase, J. P. Nagar,
Bengaluru, Karnataka 560078`
    },
    Mumbai: { name: "HRX GYM", address: "Opening soon..." },
    Delhi: { name: "HRX GYM", address: "Opening soon..." },
    Kolkata: { name: "HRX GYM", address: "Opening soon..." },
    Gujarat: { name: "HRX GYM", address: "Opening soon..." },
    Pune: { name: "HRX GYM", address: "Opening soon..." }
  };

  const cafeCities = ["Mumbai", "Delhi", "Kolkata", "Gujarat", "Pune"];

  return (
    <div className="connect-page">
        <h1 className="main-heading">CONNECT WITH US</h1>
      
      <div className="cafes-section">

        <div className="cafes-left">
         
          <img src="/cafe.jpg" alt="HRX Cafe" />
        </div>

        <div className="cafes-right">
          <p className="tag">LOCATE US</p>
          <h1>HRX CAFES</h1>

          <p className="desc">
            Curious about HRX? feel free to get in touch with us via our social
            media handles or drop us a message via the contact form below.
            <br />
            We’ll get back to you godspeed. #KeepGoing.
          </p>

       
          <div className="city-buttons">
            {cafeCities.map((city) => (
              <button
                key={city}
                className={activeCafeCity === city ? "active" : ""}
                onClick={() => setActiveCafeCity(city)}
              >
                {city}
              </button>
            ))}
          </div>

          <h2 className="coming">OPENING SOON...</h2>
        </div>
      </div>


     
      <div className="gyms-section">

        <div className="gyms-left">
          <p className="tag">LOCATE US</p>
          <h1>HRX GYMS</h1>

          <p className="desc">
            Curious about HRX? feel free to get in touch with us via our social
            media handles or drop us a message via the contact form below.
            <br />
            We’ll get back to you godspeed. #KeepGoing.
          </p>

         
          <div className="city-buttons">
            {Object.keys(gymLocations).map((city) => (
              <button
                key={city}
                className={activeCity === city ? "active" : ""}
                onClick={() => setActiveCity(city)}
              >
                {city}
              </button>
            ))}
          </div>

     
          <div className="location-details">
            <h3>{gymLocations[activeCity].name}</h3>
            <p>{gymLocations[activeCity].address}</p>
          </div>
        </div>

        <div className="gyms-right">
          
          <img src="/gym.jpg" alt="HRX Gym" />
        </div>
      </div>

    </div>
  );
}

export default Connect;
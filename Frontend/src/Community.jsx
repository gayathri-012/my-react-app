import React from "react";
import "./Community.css";

function Community() {
  return (
    <div className="community">

      <div
        className="community-hero"
        style={{ backgroundImage: "url('/comb.png')" }}
      >
        <div className="overlay"></div>

        <div className="hero-content">
          <div className="red-box"></div>

          <div className="hero-text">
            <p className="hero-small">HRX COMMUNITY</p>
            <h1>BE A PART OF THE TRIBE</h1>
            <p className="hero-sub">Be a member of HRX squad</p>
          </div>
        </div>
      </div>

      
      <div className="community-content">

  
        <div className="content-left">
          <h2 className="content-heading">HIIT + Long Hill Repeats</h2>
          <p className="tagline">
            Be a part of the tribe that's limitless
          </p>

          <p className="description">
            HRX Running Sessions with the sole objective of creating and
            increasing awareness about running, HRX has always been part of
            every major marathon in the country. We held the first ever
            Virtual Marathon during the pandemic. Runners and communities
            across India participated enthusiastically.
          </p>

        </div>

        
        <div className="content-right">
          <div className="image-box">
            <img src="/com1.png" alt="Run 1" />
            <img src="/com2.png" alt="Run 2" />
          </div>
        </div>

      </div> 

    </div>

  );
}

export default Community;
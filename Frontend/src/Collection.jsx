import React, { useState } from "react";
import "./Collection.css";

function Collection() {
  return (
    <div className="collection-page">

      <section className="hero-section">
        
        <video
          className="hero-video"
          src="/collectionv.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-accent"></div>

          <div className="hero-text">
            <p className="hero-ii">HRX COLLECTION</p>
            <h1 className="hero-title">FIND YOUR EDGE</h1>
            <p className="hero-subtitle">
              Everything you need throughout your fitness journey
            </p>
          </div>
        </div>

      </section>


<section className="mindfuel-section">

  <div className="mindfuel-left">
    <p className="mindfuel-ii">HRX MIND FUEL</p>
    <h2 className="mindfuel-title">LEVEL UP YOUR FITNESS</h2>
    <p className="mindfuel-subtitle">
      CONTENT TO ENERGIZE YOUR BODY AND MIND
    </p>

    <p className="mindfuel-desc">
      Discover the latest content from Team HRX that will help you make your
      fitness journey exciting and engaging. Tune into content pieces like
      podcasts, Workout Videos and HRX Blogs to level up your knowledge and
      keep you in the zone.
    </p>

   <a
  href="https://www.cult.fit/workout/hrx-workout/22?workoutId=22&productType=FITNESS&pageType=cultworkoutv2"
  className="mindfuel-btn"
>
  FIND A WORKOUT
</a>
 
 
  </div>

  <div className="mindfuel-cards">
    <div className="mf-card">
      <img src="/f1.png" alt="XPOD" />
      <div className="mf-overlay">
        <span>XPOD</span>
        <h3>HRX PODCASTS</h3>
      </div>
    </div>

    <div className="mf-card">
      <img src="/f2.png" alt="Workouts" />
      <div className="mf-overlay">
        <span>WORKOUTS</span>
        <h3>HRX WORKOUTS</h3>
      </div>
    </div>

    <div className="mf-card">
      <img src="/f3.png" alt="Blogs" />
      <div className="mf-overlay">
        <span>BLOGS</span>
        <h3>HRX BLOGS</h3>
      </div>
    </div>
  </div>

</section>

    </div>
  );
}

export default Collection;
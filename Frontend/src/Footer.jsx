import './Footer.css';
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";


function Footer() {
    return (

<footer className="footer">
         <div className="footer-container">

           <div className="footer-logo">
             <img src="/hrx-logo.png" alt="HRX Logo" />
             <div className="social-icons">
                  <FaFacebookF />
                  <FaInstagram />
                  <FaXTwitter />
                  <FaYoutube />
            </div>
           </div>

           <div className="footer-links">
             <div>
               <h4>NAVIGATION</h4>
               <p>Terms & Conditions</p>
               <p>Terms of Use</p>
             </div>

             <div>
               <h4>COLLECTIONS</h4>
               <p>Featured</p>
             </div>

             <div>
               <h4>COMMUNITY</h4>
               <p>HRX Hub</p>
               <p>Workouts</p>
               <p>Podcasts</p>
               <p>HRX Community</p>
             </div>
           </div>

         </div>
       </footer>

    );
}

export default Footer;
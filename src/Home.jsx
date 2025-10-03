import React from 'react';
import './Home.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>
            <span className="text-green">Youth</span>
            <span className="text-white">In</span>
            <span className="text-orange">Action</span>
          </h1>
          <h2>Grow. Lead. Inspire.</h2>
          <motion.button 
            className="explore-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/events')}
          >
            Explore
          </motion.button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Join YouthInAction?</h2>
        <div className="features-grid">
          <motion.div 
            className="feature-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img src="https://scontent.fceb1-2.fna.fbcdn.net/v/t1.15752-9/553518723_647159281523351_8495693681126890399_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeGCBvl9ZnmuzQacjB_74RrxeyaPi95cWgt7Jo-L3lxaC_KkNMts3CaDy6_KP0KlRUTSVcOdMpbmIZ3aHqrhftyK&_nc_ohc=RMPLnaoPUGMQ7kNvwGpUKG0&_nc_oc=AdlfozwCAat9_OsEVz8IdNIEYwH5KAnlogBNJeshgIKcLF1KPMWVMXAIi0eVEFDWwjc&_nc_zt=23&_nc_ht=scontent.fceb1-2.fna&oh=03_Q7cD3gHWdWMJChPgkJ03wF18jf5uSb91yKf-9iP6tcK3eWpoyw&oe=6906C98E" alt="Leadership" />
            <h3>Barangay Recognition</h3>
            <p>Get acknowledged during barangay programs and events for your volunteer service</p>
          </motion.div>

          <motion.div 
            className="feature-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img src="https://scontent.fceb1-1.fna.fbcdn.net/v/t1.15752-9/553263797_24659062013757648_1030836118707155678_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeGW-xvUqeKfTUW9E2L9_TdWHgcsgZEWUEEeByyBkRZQQeQVf9ANe5ZyJvaD1SKtRgChrBwEKIqHYAzcIbipsyVa&_nc_ohc=T0nHkK-ejuAQ7kNvwG2jl9W&_nc_oc=AdmqTKJf_9Q5G5Aubtc2S9JqqYsxv4CW_2hE0d7I3i46sdvz0Dlgb4HULkhD_hppJR8&_nc_zt=23&_nc_ht=scontent.fceb1-1.fna&oh=03_Q7cD3gGN7he_hWelI4mE4htrieR7zyTievShlelN43z3LJszsQ&oe=6906AE0B" alt="Community" />
            <h3>Community Service</h3>
            <p>Be part of clean-up drives, tree planting, and activities that directly help our barangay</p>
          </motion.div>

          <motion.div 
            className="feature-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img src="https://scontent.fceb1-3.fna.fbcdn.net/v/t1.15752-9/294347428_1093207518295257_7853240213267225466_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeH5Nj63McHBEw58O93Z3EHF4Al0ml_c1QbgCXSaX9zVBraswIwU6KTNjO8SbB2PnSbbko8VpHKmV5w0rpS4-qP3&_nc_ohc=PFew8_NQJa0Q7kNvwH1keo6&_nc_oc=AdmPWMDM4i6Atm109KMGT-tAtjIZ2EmAVaRDnAb8Tyen2POjnewCVgkAbXM1ch4wJjA&_nc_zt=23&_nc_ht=scontent.fceb1-3.fna&oh=03_Q7cD3gE9MfMs-hDnAo5RYd-F97fLLBv9-xlqWDORk6FAavz8ZQ&oe=6906B4F0" alt="Network" />
            <h3>Local Training & Seminars</h3>
            <p>Join barangay-led workshops and seminars to learn more about leadership and personal growth$ git add .$ git add .</p>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact">
        <div className="impact-content">
          <h2>Our Youth Impact</h2>
          <div className="impact-stats">
            <div className="stat">
              <h3>500+</h3>
              <p>	Active Youth Volunteers</p>
            </div>
            <div className="stat">
              <h3>15+</h3>
              <p>	Communities Engaged</p>
            </div>
            <div className="stat">
              <h3>50+</h3>
              <p>	Youth-Led Projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Make an Impact?</h2>
        <p>YouthInAction: Empowering you to lead, inspire, and take action.</p>
        <motion.button 
          className="cta-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/join')}
        >
          Start Your Journey
        </motion.button>
      </section>
    </div>
  );
};

export default Home;

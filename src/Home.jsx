import React from 'react';
import './Home.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// Import local images
import meetingImage from './assets/meeting-presentation.jpg';


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
            <img src={meetingImage} alt="Local Training & Seminars" />
            <h3>Local Training & Seminars</h3>
            <p>Join barangay-led workshops and seminars to learn more about leadership and personal growth.</p>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact">
        <div className="impact-content">
          <h2>Join Our Growing Community</h2>
          <p className="impact-subtitle">Be part of something bigger - where every action creates real change</p>
          <div className="impact-benefits">
            <div className="benefit-item">
              <span className="benefit-icon">🏆</span>
              <span>Earn recognition & certificates</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📱</span>
              <span>Track your volunteer hours</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🤝</span>
              <span>Connect with like-minded youth</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🌟</span>
              <span>Build leadership skills</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Start Your Impact Journey?</h2>
        <p>Join hundreds of youth who are already making a difference in their communities. Your journey to leadership starts here!</p>
        <div className="cta-buttons">
          <motion.button 
            className="cta-button primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/join')}
          >
            Join YouthInAction Now
          </motion.button>
          <motion.button 
            className="cta-button secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/events')}
          >
            Explore Events
          </motion.button>
        </div>
        <div className="cta-features">
          <span className="feature-tag">✅ Free to Join</span>
          <span className="feature-tag">✅ No Experience Required</span>
          <span className="feature-tag">✅ Flexible Schedule</span>
        </div>
      </section>
    </div>
  );
};

export default Home;

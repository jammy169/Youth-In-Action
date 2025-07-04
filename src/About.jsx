import React from 'react';
import './About.css';
import jeffersonImage from './assets/JEP.jpg'; // Adjust the path as necessary
import glyzelImage from './assets/gly.jpg'; // Adjust the path as necessary
import kangImage from './assets/kang.jpg'; // Adjust the path as necessary
import zaynImage from './assets/zayn.jpg'; // Adjust the path as necessary
import zakImage from './assets/zak.jpg'; // Adjust the path as necessary

const About = () => {
  return (
    <div className="about-container">
      <section className="mission">
        <h1>Our Mission</h1>
       <h2><p>Empowering youth to lead, connect, and create meaningful change.</p></h2> 
      </section>
      <section className="vision">
        <h1>Our Vision</h1>
        <h2><p>Connecting young leaders to inspire action and spark change in their communities.</p></h2>
      </section>
      <section className="team">
        <h1>Meet Our Team</h1>
        <div className="team-members">
        <div className="team-member">
        <img 
              src={kangImage} 
              alt="Errika Laine Daplinan"    
              style={{ 
                width: '150px', // Set a fixed width
                height: '150px', // Set a fixed height to make it round
                borderRadius: '50%', // Make it circular
                objectFit: 'cover' // Ensure the image covers the area
              }} 
            />
            
            <h2>Erikka Laine Daplinan</h2>
            <p>Project Manager</p>
          </div>
          <div className="team-member">
          <img 
              src={zaynImage} 
              alt="Jam Floyd Estellore" 
              style={{ 
                width: '150px', // Set a fixed width
                height: '150px', // Set a fixed height to make it round
                borderRadius: '50%', // Make it circular
                objectFit: 'cover' // Ensure the image covers the area
              }} 
            />
            <h2>Jam Floyd Estellore</h2>
            <p>Programmer</p>
          </div>
          <div className="team-member">
          <img 
              src={glyzelImage} 
              alt="Glyzel Pialago"    
              style={{ 
                width: '150px', // Set a fixed width
                height: '150px', // Set a fixed height to make it round
                borderRadius: '50%', // Make it circular
                objectFit: 'cover' // Ensure the image covers the area
              }} 
            />
            
            <h2>Glyzell Pialago</h2>
            <p>Programmer</p>
          </div>
          <div className="team-member">
            <img 
              src={jeffersonImage} 
              alt="Jefferson Tingal" 
              style={{ 
                width: '150px', // Set a fixed width
                height: '150px', // Set a fixed height to make it round
                borderRadius: '50%', // Make it circular
                objectFit: 'cover' // Ensure the image covers the area
              }} 
            />
            <h2>Jefferson Tingal</h2>
            <p>System Analyst</p>
          </div>
          <div className="team-member">
          <img 
              src={zakImage} 
              alt="Zachary Jude Malabanan" 
              style={{ 
                width: '150px', // Set a fixed width
                height: '150px', // Set a fixed height to make it round
                borderRadius: '50%', // Make it circular
                objectFit: 'cover' // Ensure the image covers the area
              }} 
            />
            <h2>Zachary Jude Malabanan</h2>
            <p>Tester</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
import React, { useState } from 'react';
import './About.css';
import jeffersonImage from './assets/JEP.jpg';
import glyzelImage from './assets/gly.jpg';
import kangImage from './assets/kang.jpg';
import zaynImage from './assets/zayn.jpg';
import zakImage from './assets/zak.jpg';
import jamImage from './assets/jam.jpg';

const About = () => {
  const [hoveredMember, setHoveredMember] = useState(null);

  const teamMembers = [
    {
      id: 1,
      name: "Erikka Laine Daplinan",
      role: "Project Manager",
      image: kangImage,
      bio: "Leading our vision with strategic planning and team coordination.",
      skills: ["Leadership", "Strategy", "Management"],
      color: "#FF6B6B"
    },
    {
      id: 2,
      name: "Jam Floyd Estellore",
      role: "Lead Developer",
      image: jamImage,
      bio: "Building innovative solutions with cutting-edge technology.",
      skills: ["React", "Node.js", "Full-Stack"],
      color: "#4ECDC4"
    },
    {
      id: 3,
      name: "Glyzell Pialago",
      role: "Frontend Developer",
      image: glyzelImage,
      bio: "Creating beautiful and intuitive user experiences.",
      skills: ["UI/UX", "React", "Design"],
      color: "#45B7D1"
    },
    {
      id: 4,
      name: "Jefferson Tingal",
      role: "System Analyst",
      image: jeffersonImage,
      bio: "Analyzing systems and optimizing performance for better outcomes.",
      skills: ["Analysis", "Optimization", "Architecture"],
      color: "#96CEB4"
    },
    {
      id: 5,
      name: "Zachary Jude Malabanan",
      role: "Quality Assurance",
      image: zakImage,
      bio: "Ensuring excellence through rigorous testing and quality control.",
      skills: ["Testing", "QA", "Automation"],
      color: "#FFEAA7"
    }
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">About YouthInAction </span> 
          </h1>
          <p className="hero-subtitle">
          Grow. Lead. Inspire.
          </p>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="mission-vision-grid">
        <div className="mission-card">
          <div className="card-icon">🎯</div>
          <h2>Our Mission</h2>
          <p>Empowering youth to lead, connect, and create meaningful change through innovative technology solutions and collaborative platforms.</p>
        </div>
        
        <div className="vision-card">
          <div className="card-icon">🌟</div>
          <h2>Our Vision</h2>
          <p>Connecting young leaders to inspire action and spark transformative change in their communities through digital empowerment.</p>
        </div>
      </div>

      {/* Values Section */}
      <div className="values-section">
        <h2 className="section-title">Our Core Values</h2>
        <div className="values-grid">
          <div className="value-item">
            <div className="value-icon">💡</div>
            <h3>Innovation</h3>
            <p>Pushing boundaries with creative solutions</p>
          </div>
          <div className="value-item">
            <div className="value-icon">🤝</div>
            <h3>Collaboration</h3>
            <p>Working together for greater impact</p>
          </div>
          <div className="value-item">
            <div className="value-icon">🚀</div>
            <h3>Growth</h3>
            <p>Continuous learning and development</p>
          </div>
          <div className="value-item">
            <div className="value-icon">❤️</div>
            <h3>Impact</h3>
            <p>Making a positive difference in communities</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="team-section">
        <div className="team-header">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-subtitle">The passionate individuals behind YouthInAction</p>
        </div>
        
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div 
              key={member.id}
              className={`team-member ${hoveredMember === member.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
              style={{ '--member-color': member.color }}
            >
              <div className="member-image-container">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="member-image"
                />
              </div>
              
              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-bio">{member.bio}</p>
                
                <div className="member-skills">
                  {member.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>

      {/* Impact Section */}
      <div className="impact-section">
        <h2 className="section-title">What We Do</h2>
        <p className="impact-subtitle">Creating meaningful opportunities for youth to make a real difference in their communities</p>
        
        <div className="impact-grid">
          <div className="impact-card">
            <div className="impact-icon">🌱</div>
            <h3>Community Development</h3>
            <p>We organize clean-up drives, tree planting, and environmental projects that directly benefit local communities.</p>
          </div>
          
          <div className="impact-card">
            <div className="impact-icon">🎓</div>
            <h3>Youth Education</h3>
            <p>We provide workshops, seminars, and training programs to develop leadership and life skills.</p>
          </div>
          
          <div className="impact-card">
            <div className="impact-icon">🤝</div>
            <h3>Volunteer Network</h3>
            <p>We connect passionate youth with meaningful volunteer opportunities and community service projects.</p>
          </div>
          
          <div className="impact-card">
            <div className="impact-icon">🏆</div>
            <h3>Recognition & Growth</h3>
            <p>We track volunteer hours, provide certificates, and celebrate achievements to motivate continued service.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
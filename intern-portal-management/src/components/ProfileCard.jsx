import React, { useState } from 'react';
import defaultImage from '../assets/interns.jpg';
import './ProfileCard.css';

const ProfileCard = ({
  _id,
  name,
  image = defaultImage,
  description,
  skills = [],
  position,
  institution,
  duration,
  status,
  socialLinks = [],
  funFact,
  onEdit,
  onDelete,
}) => {
  const [showFunFact, setShowFunFact] = useState(false);

  const toggleFunFact = () => setShowFunFact(prev => !prev);

  return (
    <section className="profile-card">
      <header>
        <h2>{name}</h2>
        <img
          src={image}
          alt={`${name}'s profile`}
          className="profile-image"
        />
      </header>

      <p className="profile-description">{description}</p>

      <div className="profile-position">
        <strong>Position:</strong> {position}
      </div>

      <div className="profile-institution">
        <strong>Institution:</strong> {institution}
      </div>

      <div className="profile-duration">
        <strong>Duration:</strong> {duration}
      </div>

      <div className="profile-status">
        <strong>Status:</strong> {status}
      </div>

      <section className="profile-skills">
        <strong>Skills</strong>
        <ul>
          {skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </section>

      <section className="profile-social">
        <strong>Social Links</strong>
        <ul>
          {socialLinks.map((link, i) => (
            <li key={i}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.platform}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="profile-toggle">
        <span>{showFunFact ? "That's me!" : "Want to know something fun?"}</span>
        <div
          className={`toggle-switch ${showFunFact ? 'active' : ''}`}
          onClick={toggleFunFact}
        >
          <div className="switch-circle"></div>
        </div>
      </div>

      {showFunFact && (
        <aside className="fun-fact">
          💡 {funFact}
        </aside>
      )}

      <div className="profile-actions">
        <button
          className="edit-button"
          onClick={() =>
            onEdit({
              _id,
              name,
              image,
              description,
              skills,
              position,
              institution,
              duration,
              status,
              socialLinks,
              funFact,
            })
          }
        >
          ✏️ Edit
        </button>
        <button className="delete-button" onClick={() => onDelete(_id)}>
          🗑️ Delete
        </button>
      </div>
    </section>
  );
};

export default ProfileCard;

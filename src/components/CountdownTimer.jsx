import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';

const CountdownTimer = ({ targetDate, endDate = null, className = '', onComplete = null }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });
  const [isExpired, setIsExpired] = useState(false);
  const [eventStatus, setEventStatus] = useState('upcoming'); // 'upcoming', 'ongoing', 'finished'

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const startTime = new Date(targetDate).getTime();
      const endTime = endDate ? new Date(endDate).getTime() : null;
      
      // Determine event status
      if (now < startTime) {
        setEventStatus('upcoming');
        const difference = startTime - now;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return {
          days,
          hours,
          minutes,
          seconds,
          total: difference
        };
      } else if (endTime && now < endTime) {
        setEventStatus('ongoing');
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0
        };
      } else {
        setEventStatus('finished');
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0
        };
      }
    };

    const updateTimer = () => {
      const timeLeft = calculateTimeLeft();
      setTimeLeft(timeLeft);

      // Handle event status changes
      if (eventStatus === 'upcoming' && timeLeft.total <= 0) {
        setIsExpired(true);
        if (onComplete) {
          onComplete();
        }
      }
    };

    // Initial calculation
    updateTimer();

    // Update every second
    const timer = setInterval(updateTimer, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [targetDate, endDate, isExpired, onComplete, eventStatus]);

  // Show different messages based on event status
  if (eventStatus === 'ongoing') {
    return (
      <div className={`countdown-timer ongoing ${className}`}>
        <div className="countdown-ongoing">
          <span className="ongoing-icon">🚀</span>
          <span className="ongoing-text">Event Started!</span>
        </div>
      </div>
    );
  }

  if (eventStatus === 'finished') {
    return (
      <div className={`countdown-timer finished ${className}`}>
        <div className="countdown-finished">
          <span className="finished-icon">✅</span>
          <span className="finished-text">Event Finished</span>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className={`countdown-timer expired ${className}`}>
        <div className="countdown-expired">
          <span className="expired-icon">⏰</span>
          <span className="expired-text">Event Started!</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`countdown-timer ${className}`}>
      <div className="countdown-container">
        <div className="countdown-item">
          <div className="countdown-number">{timeLeft.days}</div>
          <div className="countdown-label">Days</div>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <div className="countdown-number">{timeLeft.hours.toString().padStart(2, '0')}</div>
          <div className="countdown-label">Hours</div>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <div className="countdown-number">{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <div className="countdown-label">Minutes</div>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <div className="countdown-number">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <div className="countdown-label">Seconds</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;



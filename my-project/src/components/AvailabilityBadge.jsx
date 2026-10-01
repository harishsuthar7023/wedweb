import React from 'react';

export default function AvailabilityBadge() {
  return (
    <div className="availability-pill-wrapper" role="status" aria-label="Engine status">
      <div className="availability-pill">
        {/* Availability Live Indicator */}
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span className="status-ping"></span>
        </div>

        {/* Badge Label */}
        <span className="badge-category">AI IMAGE GENERATOR</span>

        <span className="badge-divider" aria-hidden="true">•</span>

        {/* 3 Avatar Stack matching the reference image layout */}
        <div className="avatar-stack" aria-hidden="true">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
            alt="Creator 1" 
            className="avatar-img"
          />
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" 
            alt="Creator 2" 
            className="avatar-img"
          />
          <img 
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" 
            alt="Creator 3" 
            className="avatar-img"
          />
        </div>

        {/* Social Proof count matching reference "7,000+ people already subscribed" */}
        <span className="badge-text">
          <strong className="badge-count">14,000+</strong> creators active
        </span>
      </div>
    </div>
  );
}

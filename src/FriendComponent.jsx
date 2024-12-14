import React from 'react';
import { useSelector } from 'react-redux';

const FriendComponent = () => {
  // Select friend from Redux state
  const friend = useSelector((state) => state.friend);

  // Defensive check
  if (!friend) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>We are sorry, an error occurred.</h1>
        <p>Friend data is not available. Please try again later.</p>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '10px 20px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Return Home
        </button>
      </div>
    );
  }

  return <div>Friend's name: {friend.name}</div>;
};

export default FriendComponent;

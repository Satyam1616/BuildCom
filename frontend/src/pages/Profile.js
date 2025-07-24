import React from 'react';
import { useAuth } from '../App';

function Profile() {
  const { user } = useAuth();

  // In a real app, fetch more user info from backend using the token
  return (
    <div>
      <h2>User Profile</h2>
      {user ? (
        <>
          <p>Email: (from token)</p>
          <p>More profile info coming soon.</p>
        </>
      ) : (
        <p>Not logged in.</p>
      )}
    </div>
  );
}

export default Profile; 
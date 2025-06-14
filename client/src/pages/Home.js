import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#333' }}>Fitness Form Analyzer</h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
        Upload your workout video to get feedback on your form.
      </p>
      <Link to="/upload">
        <button style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Upload Video
        </button>
      </Link>
    </div>
  );
}

export default Home; 
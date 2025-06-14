import React from 'react';

function Result({ result }) {
  if (!result) return null;
  return (
    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
      <h3>Analysis Result</h3>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}

export default Result; 
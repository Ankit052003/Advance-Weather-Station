import React from 'react';

function TestApp() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 30%, #fdcb6e 70%, #e17055 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px'
    }}>
      <h1>Weather App Test - This should be visible!</h1>
    </div>
  );
}

export default TestApp;

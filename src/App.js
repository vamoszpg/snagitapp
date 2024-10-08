import React from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Snag It</h1>
      </header>
      <main className="main-content">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
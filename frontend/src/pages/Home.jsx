import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Trading Journal</h1>
        <p className="tagline">Track, Analyze, and Improve Your Trading Performance</p>
        
        <div className="hero-buttons">
          <Link to="/login" className="btn btn-primary">Sign In</Link>
          <Link to="/register" className="btn btn-outline">Create Account</Link>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Why Use Our Trading Journal?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Track All Your Trades</h3>
            <p>Record every trade with detailed information including entry/exit points, strategies, and outcomes.</p>
          </div>
          <div className="feature-card">
            <h3>Performance Analytics</h3>
            <p>Visualize your trading performance with intuitive charts and detailed statistics.</p>
          </div>
          <div className="feature-card">
            <h3>Strategy Development</h3>
            <p>Identify what works and what doesn't to refine your trading strategies.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Cloud Storage</h3>
            <p>Your data is securely stored and accessible from anywhere, anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

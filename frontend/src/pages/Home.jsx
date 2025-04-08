import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">Trading Journal</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track, Analyze, and Improve Your Trading Performance
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-outline">
              Create Account
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">Why Use Our Trading Journal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-primary mb-3">Track All Your Trades</h3>
              <p className="text-gray-600">Record every trade with detailed information including entry/exit points, strategies, and outcomes.</p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-primary mb-3">Performance Analytics</h3>
              <p className="text-gray-600">Visualize your trading performance with intuitive charts and detailed statistics.</p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-primary mb-3">Strategy Development</h3>
              <p className="text-gray-600">Identify what works and what doesn't to refine your trading strategies.</p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-primary mb-3">Secure Cloud Storage</h3>
              <p className="text-gray-600">Your data is securely stored and accessible from anywhere, anytime.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

const TailwindTest = () => {
  return (
    <div className="p-4 mb-4">
      <h2 className="text-2xl font-bold text-primary mb-2">Tailwind Test Component</h2>
      <p className="text-gray-600">If you can see this text in gray and the heading in blue, Tailwind is working!</p>
      <div className="mt-4 flex gap-2">
        <button className="bg-primary text-white px-4 py-2 rounded">Primary Button</button>
        <button className="bg-success text-white px-4 py-2 rounded">Success Button</button>
        <button className="bg-error text-white px-4 py-2 rounded">Error Button</button>
      </div>
    </div>
  );
};

export default TailwindTest;

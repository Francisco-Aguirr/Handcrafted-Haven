export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6 text-center">

      <div className="bg-white shadow-lg rounded-xl p-10 max-w-md">
        <h1 className="text-3xl font-bold mb-4">
          🛒 Cart – Under Construction
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Our shopping cart system is not available yet.  
          We are working hard to bring it to you soon!
        </p>

        <a
          href="/"
          className="inline-block mt-4 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Return to Home
        </a>
      </div>

      <p className="text-gray-400 mt-6">Handcrafted Haven © 2025</p>
    </div>
  );
}

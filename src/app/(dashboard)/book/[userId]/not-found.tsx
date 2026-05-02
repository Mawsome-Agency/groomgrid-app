import Link from 'next/link';

export default function BookingNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🐾</div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">
          Groomer Not Found
        </h1>
        <p className="text-stone-600 mb-6">
          This booking link doesn't seem to be valid. Please check the link
          and try again, or contact your groomer directly.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
        >
          Go to GroomGrid
        </Link>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-green-600">GroomGrid</h1>
          <p className="text-stone-600">AI-powered pet grooming business management</p>
        </div>
        
        <Link
          href="/signup"
          className="inline-block w-full px-6 py-4 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
        >
          Get Started — 14-Day Free Trial
        </Link>
        
        <p className="text-sm text-stone-500">No credit card required</p>
      </div>
    </div>
  );
}

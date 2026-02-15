import PolicyPlayground from '@/components/composer/PolicyPlayground';

export default function EvaluatePage() {
  return (
    <main className="min-h-screen bg-[var(--dark-gray)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Policy <span className="text-gradient-animated">Composer</span>
        </h1>
        <p className="text-white/40 mb-6 text-sm sm:text-base">
          Design and evaluate credit card policy workflows
        </p>
        <PolicyPlayground />
      </div>
    </main>
  );
}

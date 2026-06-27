import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <section className="border-b border-neutral-200 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Extract leads from Google Maps.<br />
            <span className="text-emerald-700">Nurture them on WhatsApp &amp; Email.</span>
          </h1>
          <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
            Search any category in any city. Get verified contact details automatically.
            Launch outreach sequences in minutes — no manual data entry.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/extract"
              className="rounded-md bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Start free search
            </Link>
            <Link
              href="#features"
              className="rounded-md border border-neutral-300 bg-white px-6 py-3 text-sm font-medium hover:bg-neutral-50"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Extract',
                desc: 'Search Google Places with 8+ filters — category, location, rating, open now, website, phone, price level, keywords.',
                icon: '🔍'
              },
              {
                title: 'Enrich',
                desc: 'Automatic website scraping + email/phone/WhatsApp detection. Deduplication by Place ID. Change detection jobs.',
                icon: '🔧'
              },
              {
                title: 'Nourish',
                desc: 'Kanban/table pipeline. WhatsApp deep-links + API logging. AI-drafted email sequences. Bulk actions. Team collaboration.',
                icon: '🌱'
              }
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-neutral-200 bg-white p-6 hover:border-emerald-300 transition-colors"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold">Ready to build your pipeline?</h2>
          <p className="mt-2 text-neutral-600">
            Free tier includes 100 searches/month. No credit card required.
          </p>
          <Link
            href="/extract"
            className="mt-6 inline-flex rounded-md bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Start extracting leads
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} customerly. Built for serious outbound teams.
        </div>
      </footer>
    </div>
  );
}

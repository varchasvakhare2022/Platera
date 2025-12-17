import Link from 'next/link';

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-stone-200 font-sans selection:bg-stone-800 selection:text-white pt-32 pb-24">
            <div className="container mx-auto max-w-3xl px-6">

                {/* Header */}
                <div className="mb-12">
                    <p className="text-amber-500 font-medium tracking-wide uppercase text-xs mb-3">Trust & Transparency</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-stone-500 text-lg leading-relaxed">
                        Your privacy is important to us. We believe in being transparent about what we collect and how we use it.
                    </p>
                    <p className="text-stone-600 text-sm mt-4">Last updated: December 2025</p>
                </div>

                {/* Content */}
                <div className="space-y-12">

                    {/* Data Collection */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">1. What We Collect</h2>
                        <ul className="list-disc list-inside space-y-2 text-stone-400 leading-relaxed text-sm marker:text-stone-600">
                            <li><span className="text-stone-200 font-medium">Profile Data:</span> Name, email, and profile picture (via Clerk authentication).</li>
                            <li><span className="text-stone-200 font-medium">Content:</span> Recipes, photos, and descriptions you upload.</li>
                            <li><span className="text-stone-200 font-medium">Usage:</span> Recipes you save, like, or review.</li>
                        </ul>
                    </section>

                    {/* Authentication */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">2. Authentication & Security</h2>
                        <p className="text-stone-400 leading-relaxed text-sm mb-4">
                            We don't store your passwords. We use <span className="text-stone-200">Clerk</span>, an industry-standard authentication provider, to handle your login securely. Key advantages:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-stone-400 leading-relaxed text-sm marker:text-stone-600">
                            <li>Secure, encrypted login sessions.</li>
                            <li>We only receive basic profile info (email/name) to create your account.</li>
                            <li>You can manage your connected accounts directly through Clerk.</li>
                        </ul>
                    </section>

                    {/* Visibility */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">3. Public vs. Private</h2>
                        <div className="bg-stone-900/30 border border-stone-800/50 rounded-xl p-6">
                            <p className="text-stone-300 text-sm leading-relaxed">
                                <span className="text-amber-500 font-medium block mb-2">Platera is a public platform.</span>
                                By default, recipes and reviews you post are visible to the community. Your "Saved Recipes" collection is private to you unless you choose to share it (feature coming soon).
                            </p>
                        </div>
                    </section>

                    {/* Ownership */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">4. Your Rights</h2>
                        <p className="text-stone-400 leading-relaxed text-sm mb-4">
                            It's your data. You have the right to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-stone-400 leading-relaxed text-sm marker:text-stone-600">
                            <li>Access all personal data we hold about you.</li>
                            <li>Update or delete your recipes at any time via your dashboard.</li>
                            <li>Delete your entire account and data (available in account settings).</li>
                        </ul>
                    </section>

                    {/* Analytics */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">5. Cookies & Analytics</h2>
                        <p className="text-stone-400 leading-relaxed text-sm">
                            We use minimal cookies strictly for authentication (keeping you logged in) and basic performance monitoring. We do not sell your personal data to third-party advertisers.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="border-t border-stone-800 pt-8 mt-12">
                        <p className="text-stone-500 text-sm mb-2">Have questions about your data?</p>
                        <a href="mailto:platerarecipes@gmail.com" className="text-white hover:text-amber-500 transition-colors underline decoration-stone-700 underline-offset-4">
                            platerarecipes@gmail.com
                        </a>
                    </section>

                </div>

                {/* Back to Home */}
                <div className="mt-20">
                    <Link href="/" className="text-stone-500 hover:text-white transition-colors text-sm flex items-center gap-2">
                        ← Back to Platera
                    </Link>
                </div>
            </div>
        </main>
    );
}

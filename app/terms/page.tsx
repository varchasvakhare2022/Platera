import Link from 'next/link';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-stone-200 font-sans selection:bg-stone-800 selection:text-white pt-32 pb-24">
            <div className="container mx-auto max-w-3xl px-6">

                {/* Header */}
                <div className="mb-12">
                    <p className="text-amber-500 font-medium tracking-wide uppercase text-xs mb-3">House Rules</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Terms & Conditions</h1>
                    <p className="text-stone-500 text-lg leading-relaxed">
                        By using Platera, you agree to these terms. We've kept them short and readable because nobody likes legalese.
                    </p>
                    <p className="text-stone-600 text-sm mt-4">Last updated: December 2025</p>
                </div>

                {/* Content */}
                <div className="space-y-12">

                    {/* Eligibility */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">1. Eligibility</h2>
                        <ul className="list-disc list-inside space-y-2 text-stone-400 leading-relaxed text-sm marker:text-stone-600">
                            <li>You must be at least 13 years old to use Platera.</li>
                            <li>You are responsible for keeping your account secure (though we help by using secure authentication).</li>
                        </ul>
                    </section>

                    {/* Ownership */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">2. Content Ownership</h2>
                        <div className="bg-stone-900/30 border border-stone-800/50 rounded-xl p-6 mb-4">
                            <p className="text-stone-300 text-sm leading-relaxed">
                                <span className="text-amber-500 font-medium block mb-2">You own your recipes.</span>
                                We do not claim ownership of the content you upload. However, by posting on Platera, you grant us a license to display, feature, and share your content on the platform.
                            </p>
                        </div>
                        <p className="text-stone-400 leading-relaxed text-sm">
                            Please only upload photos and recipes that you have created or have the right to use. Respect the intellectual property of other chefs.
                        </p>
                    </section>

                    {/* Prohibited Behavior */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">3. Code of Conduct</h2>
                        <p className="text-stone-400 leading-relaxed text-sm mb-4">
                            Platera is a positive community for food lovers. We have zero tolerance for:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-stone-400 leading-relaxed text-sm marker:text-stone-600">
                            <li>Hate speech found in comments, reviews, or recipe descriptions.</li>
                            <li>Spam or excessive self-promotion.</li>
                            <li>Uploading illegal, offensive, or clearly harmful content.</li>
                        </ul>
                        <p className="text-stone-500 text-xs mt-4">
                            We reserve the right to remove specific content or suspend accounts that violate these rules.
                        </p>
                    </section>

                    {/* Liability */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">4. Disclaimers</h2>
                        <ul className="list-disc list-inside space-y-2 text-stone-400 leading-relaxed text-sm marker:text-stone-600">
                            <li><span className="text-stone-200 font-medium">Availability:</span> We work hard to keep Platera online, but we cannot guarantee uninterrupted service.</li>
                            <li><span className="text-stone-200 font-medium">Safety:</span> We are not liable for any kitchen mishaps, allergies, or issues resulting from following recipes on the site. Cook responsibly!</li>
                        </ul>
                    </section>

                    {/* Changes */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">5. Changes to Terms</h2>
                        <p className="text-stone-400 leading-relaxed text-sm">
                            We may update these terms as Platera grows. If we make significant changes, we will notify you through the platform or via email.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="border-t border-stone-800 pt-8 mt-12">
                        <p className="text-stone-500 text-sm mb-2">Questions about the rules?</p>
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

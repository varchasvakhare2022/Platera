import React from 'react';
import { PageTransition } from '@/components/animations/PageTransition';

export default function PrivacyPage() {
    return (
        <PageTransition>
            <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-neutral-950 to-stone-950 pt-32 pb-20">
                <main className="container mx-auto px-4 max-w-4xl">
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Privacy Policy</h1>
                        <p className="text-neutral-400 text-lg">Last updated: December 2025</p>
                    </header>

                    <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-neutral-200 prose-p:text-neutral-400 prose-a:text-brand-500 prose-li:text-neutral-400">
                        <section className="mb-12">
                            <h2>1. Introduction</h2>
                            <p>
                                Welcome to Platera ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you as to how we look after your personal data when you visit our website
                                (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2>2. Data We Collect</h2>
                            <p>
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data</strong> includes email address.</li>
                                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, and operating system and platform.</li>
                                <li><strong>Profile Data</strong> includes your username, password (managed securely via Clerk), purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
                                <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2>3. How We Use Your Data</h2>
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                <li>Where we need to comply with a legal or regulatory obligation.</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2>4. Data Security</h2>
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                                In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2>5. Your Legal Rights</h2>
                            <p>
                                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2>6. Contact Us</h2>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at:
                            </p>
                            <p className="mt-4">
                                <strong>Email:</strong> privacy@platera.com
                            </p>
                        </section>
                    </div>
                </main>
            </div>
        </PageTransition>
    );
}

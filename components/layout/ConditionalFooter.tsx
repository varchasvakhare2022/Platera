'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export function ConditionalFooter() {
    const pathname = usePathname();
    const isHomepage = pathname === '/';

    // Don't show footer on homepage or auth pages
    if (isHomepage || pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up')) {
        return null;
    }

    return <Footer />;
}

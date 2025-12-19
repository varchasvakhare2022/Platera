"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { ChevronLeft, ListFilter } from "lucide-react";
import { dark } from "@clerk/themes";

const navLinks = [{ href: "/explore", label: "Explore" }];

function HeaderContent() {
  const pathname = usePathname();
  const router = useRouter();

  const { scrollY } = useScroll();

  // State
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(Date.now());
  const [isAtTop, setIsAtTop] = useState(true);

  const { isSignedIn } = useUser();

  // Check if we are on the main explore page (strictly /explore, not subpages)
  const isExplorePage = pathname === "/explore";
  // Check if we are on a recipe details page
  const isRecipePage =
    pathname?.startsWith("/explore/") && pathname.split("/").length > 2;

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setLastScrollTime(Date.now());
    const atTop = latest < 100;
    setIsAtTop(atTop);

    if (atTop) {
      setHideNav(false);
    } else {
      if (latest > previous && latest > 100) {
        setHideNav(true);
        // Close popups on scroll
      } else {
        setHideNav(false);
      }
    }
    setHasScrolled(latest > 20);
  });

  useEffect(() => {
    if (isAtTop) return;
    const interval = setInterval(() => {
      if (!hideNav && Date.now() - lastScrollTime > 3000) {
        setHideNav(true);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [hideNav, lastScrollTime, isAtTop]);

  // Filter nav links (Hide Explore on Home)
  const filteredNavLinks = navLinks.filter((link) => {
    if (pathname === "/" && link.href === "/explore") return false;
    return true;
  });

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 bg-transparent"
    >
      {/* Gradient Masked Blur Background */}
      <div
        className="absolute top-0 left-0 right-0 h-48 z-[-1] backdrop-blur-xl transition-all duration-300 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 25%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 25%, transparent 100%)'
        }}
      />
      <div className="container mx-auto max-w-7xl px-6">
        <nav className="flex items-center justify-between h-16 relative">
          {/* Left Section: Filter + Logo */}
          <div className="flex items-center gap-4">
            {isRecipePage && (
              <Link
                href="/explore"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/5"
                title="Back to Explore"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
            )}

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 relative">
                <Image
                  src="/icon.png"
                  alt="Platera"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-110"
                />
              </div>
              <span
                className="text-lg font-semibold text-white tracking-widest hidden sm:block"
                style={{
                  fontFamily: "Playfair Display, serif",
                  letterSpacing: "0.15em",
                }}
              >
                Platera
              </span>
            </Link>
          </div>

          {/* Center Navigation with Dark Background */}
          {filteredNavLinks.length > 0 && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full"
              animate={{
                backgroundColor:
                  hideNav || isAtTop
                    ? "rgba(0, 0, 0, 0)"
                    : "rgba(0, 0, 0, 0.75)",
                backdropFilter: hideNav || isAtTop ? "blur(0px)" : "blur(12px)",
              }}
              transition={{
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1.0],
              }}
            >
              <div className="flex items-center gap-8">
                {filteredNavLinks.map((link, index) => {
                  const isActive = pathname === link.href;

                  return (
                    <motion.div
                      key={link.href}
                      animate={{
                        opacity: hideNav ? 0 : 1,
                        y: hideNav ? -8 : 0,
                        filter: hideNav ? "blur(4px)" : "blur(0px)",
                      }}
                      transition={{
                        duration: 0.25,
                        delay: hideNav ? index * 0.02 : (2 - index) * 0.04,
                        ease: [0.25, 0.1, 0.25, 1.0],
                        filter: { duration: 0.2 },
                      }}
                      style={{
                        willChange: "opacity, transform, filter",
                      }}
                    >
                      <Link
                        href={link.href}
                        className="relative group hidden md:block"
                      >
                        <motion.span
                          className={`text-sm font-medium transition-colors duration-200 ${isActive
                            ? "text-white"
                            : "text-stone-400 hover:text-white"
                            }`}
                          animate={{
                            letterSpacing: hideNav ? "0.1em" : "0em",
                          }}
                          transition={{
                            duration: 0.25,
                            ease: [0.25, 0.1, 0.25, 1.0],
                          }}
                        >
                          {link.label}
                        </motion.span>
                        {isActive && (
                          <motion.div
                            layoutId="active-nav"
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-500"
                            animate={{
                              opacity: hideNav ? 0 : 1,
                              scaleX: hideNav ? 0.5 : 1,
                            }}
                            transition={{
                              duration: 0.2,
                              ease: [0.25, 0.1, 0.25, 1.0],
                            }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Auth + Sort (Right Side) */}
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-9 h-9 ring-2 ring-stone-800 transition-shadow hover:ring-amber-500",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="Dashboard"
                    labelIcon={
                      <ListFilter className="w-4 h-4 text-stone-500 group-hover:text-amber-500" />
                    }
                    onClick={() => router.push("/dashboard")}
                  />
                  <UserButton.Action label="manageAccount" />
                  <UserButton.Action label="signOut" />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <Link href="/sign-in">
                <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md transition-colors duration-200">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </motion.header>
  );
}

export function Header() {
  return (
    <Suspense fallback={null}>
      <HeaderContent />
    </Suspense>
  );
}

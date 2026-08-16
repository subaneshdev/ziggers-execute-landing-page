"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Activity, Globe, Compass, ArrowRight, LogOut, User } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const menuItems = {
    solutions: {
      label: 'Solutions',
      items: [
        { name: 'Product Sampling', desc: 'Direct-to-consumer physical trial pipelines', href: '/solutions/product-sampling', icon: <Compass size={18} /> },
        { name: 'Retail Activation', desc: 'In-store promotions & visual merchandising audits', href: '/solutions/retail-activation', icon: <Activity size={18} /> },
        { name: 'Roadshows & Events', desc: 'Mobile activation & experiential campaigns', href: '/solutions/roadshows-and-events', icon: <Globe size={18} /> }
      ]
    },
    industries: {
      label: 'Industries',
      items: [
        { name: 'FMCG & D2C', desc: 'Accelerated trade marketing & product seeding', href: '/industries/fmcg-and-d2c' },
        { name: 'Retail & Fashion', desc: 'Real-time shelf intelligence & merchandising audits', href: '/industries/retail-and-fashion' },
        { name: 'Tech & Finance', desc: 'Merchant acquisition & mobile app installs', href: '/industries/tech-and-finance' }
      ]
    },
    cities: {
      label: 'Locations',
      items: [
        { name: 'Chennai Hub', desc: 'Southern India operations & logistics', href: '/cities/chennai' },
        { name: 'Bangalore Hub', desc: 'Karnataka & technology center operations', href: '/cities/bangalore' },
        { name: 'Mumbai Hub', desc: 'Western India trade execution networks', href: '/cities/mumbai' }
      ]
    }
  };

  const { user, profile, signOut } = useAuth();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-250 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-espresso/5 shadow-soft py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group decoration-transparent">
          <div className="w-8 h-8 bg-espresso text-gold rounded-xl flex items-center justify-center font-black text-lg transition-transform group-hover:scale-105 shadow-sm">
            Z
          </div>
          <span className="font-extrabold text-xl tracking-tight text-espresso font-display">
            Ziggers <span className="text-gold font-normal italic">Execute</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {Object.keys(menuItems).map((key) => (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => setActiveDropdown(key)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1.5 text-sm font-semibold text-espresso/80 hover:text-espresso py-2 transition-colors cursor-pointer">
                <span>{menuItems[key].label}</span>
                <ChevronDown size={14} className={`transition-transform duration-250 ${activeDropdown === key ? 'rotate-180 text-gold' : ''}`} />
              </button>

              {activeDropdown === key && (
                <div className="absolute top-full left-0 w-80 bg-white border border-espresso/10 rounded-2xl p-3 shadow-strong mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex flex-col gap-1">
                    {menuItems[key].items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="group flex items-start gap-3 p-3 rounded-xl hover:bg-linen/40 transition-colors text-left decoration-transparent"
                      >
                        {item.icon && (
                          <div className="text-gold mt-0.5 p-2 bg-linen rounded-lg group-hover:bg-gold group-hover:text-espresso transition-colors">
                            {item.icon}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-espresso group-hover:text-gold transition-colors">{item.name}</div>
                          <p className="text-[11px] text-muted mt-0.5 leading-snug">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <Link href="/pricing" className="text-sm font-semibold text-espresso/80 hover:text-espresso transition-colors decoration-transparent">
            Pricing
          </Link>
          <Link href="/partners" className="text-sm font-semibold text-espresso/80 hover:text-espresso transition-colors decoration-transparent">
            Partners
          </Link>
          <Link href="/about" className="text-sm font-semibold text-espresso/80 hover:text-espresso transition-colors decoration-transparent">
            About
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold text-gold hover:text-espresso transition-colors decoration-transparent flex items-center gap-1 font-bold">
            <span>Console</span>
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3.5 py-2 bg-linen rounded-full border border-espresso/10 text-xs font-bold text-espresso hover:border-espresso/30 decoration-transparent"
              >
                <div className="w-5 h-5 rounded-full bg-espresso text-gold text-[9px] flex items-center justify-center font-bold font-mono">
                  {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                </div>
                <span>{profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Console'}</span>
              </Link>
              <button
                onClick={signOut}
                title="Sign out"
                className="p-2 text-muted hover:text-red-600 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold text-espresso/80 hover:text-espresso transition-colors decoration-transparent px-2">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1 bg-espresso hover:bg-muted text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-md transition-all hover:translate-y-[-1px] decoration-transparent uppercase tracking-wider"
              >
                <span>Launch Campaign</span>
                <ArrowRight size={13} className="text-gold" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-espresso p-1 hover:bg-linen/30 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-white z-40 border-t border-espresso/5 p-6 overflow-y-auto animate-in slide-in-from-right duration-250">
          <div className="flex flex-col gap-6">
            {Object.keys(menuItems).map((key) => (
              <div key={key} className="flex flex-col gap-2">
                <span className="text-xs font-bold tracking-widest text-muted uppercase">{menuItems[key].label}</span>
                <div className="flex flex-col gap-1 pl-2 border-l border-linen">
                  {menuItems[key].items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="py-2 text-sm font-bold text-espresso hover:text-gold transition-colors decoration-transparent"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <hr className="border-espresso/5" />

            <Link href="/pricing" onClick={() => setIsOpen(false)} className="text-base font-bold text-espresso decoration-transparent">
              Pricing
            </Link>
            <Link href="/partners" onClick={() => setIsOpen(false)} className="text-base font-bold text-espresso decoration-transparent">
              Partners
            </Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="text-base font-bold text-espresso decoration-transparent">
              About
            </Link>
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-base font-bold text-espresso decoration-transparent">
              Console
            </Link>

            <div className="flex flex-col gap-3 mt-4">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1 bg-espresso text-white font-bold py-3 rounded-full decoration-transparent"
                  >
                    <span>Open Campaign Console</span>
                    <ArrowRight size={14} />
                  </Link>
                  <button
                    onClick={() => { signOut(); setIsOpen(false); }}
                    className="py-2 text-xs font-bold text-red-600 border border-red-200 rounded-full"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center py-2.5 text-xs font-bold text-espresso border border-espresso/20 rounded-full"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1 bg-espresso text-white font-bold py-3 rounded-full decoration-transparent text-xs uppercase tracking-wider"
                  >
                    <span>Launch Campaign</span>
                    <ArrowRight size={13} className="text-gold" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

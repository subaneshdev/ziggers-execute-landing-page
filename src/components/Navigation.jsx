"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Activity, Globe, Compass, ArrowRight } from 'lucide-react';

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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-espresso/5 shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group decoration-transparent">
          <div className="w-8 h-8 bg-espresso text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-sm">
            Z
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-espresso leading-none">Ziggers</span>
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase mt-0.5 leading-none">Execute</span>
          </div>
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
              <button className="flex items-center gap-1 text-sm font-semibold text-espresso/80 hover:text-espresso py-2 transition-colors cursor-pointer">
                <span>{menuItems[key].label}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === key ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === key && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-80 bg-white border border-espresso/5 rounded-2xl p-4 shadow-xl mt-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex flex-col gap-1">
                    {menuItems[key].items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-linen/50 transition-all text-left decoration-transparent"
                      >
                        {item.icon && (
                          <div className="text-gold mt-0.5 p-1 bg-linen/30 rounded-lg group-hover:bg-linen transition-colors">
                            {item.icon}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-bold text-espresso group-hover:text-gold transition-colors">{item.name}</div>
                          <p className="text-xs text-muted/80 mt-0.5 leading-normal">{item.desc}</p>
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
          <Link href="/dashboard" className="text-sm font-semibold text-espresso/80 hover:text-espresso transition-colors decoration-transparent">
            Dashboard
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/contact" className="text-sm font-bold text-espresso/80 hover:text-espresso transition-colors decoration-transparent">
            Log In
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-1 bg-espresso hover:bg-muted text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-md transition-all hover:translate-y-[-1px] decoration-transparent"
          >
            <span>Request Demo</span>
            <ArrowRight size={14} />
          </Link>
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
            <Link href="/careers" onClick={() => setIsOpen(false)} className="text-base font-bold text-espresso decoration-transparent">
              Careers
            </Link>
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-base font-bold text-espresso decoration-transparent">
              Dashboard
            </Link>

            <div className="flex flex-col gap-3 mt-4">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1 bg-espresso text-white font-bold py-3 rounded-full decoration-transparent"
              >
                <span>Request Demo</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

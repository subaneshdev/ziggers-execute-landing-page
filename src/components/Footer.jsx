"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const links = {
    solutions: {
      title: 'Solutions',
      items: [
        { name: 'Product Sampling', href: '/solutions/product-sampling' },
        { name: 'Retail Activation', href: '/solutions/retail-activation' },
        { name: 'Roadshows & Events', href: '/solutions/roadshows-and-events' }
      ]
    },
    industries: {
      title: 'Industries',
      items: [
        { name: 'FMCG & D2C', href: '/industries/fmcg-and-d2c' },
        { name: 'Retail & Fashion', href: '/industries/retail-and-fashion' },
        { name: 'Tech & Finance', href: '/industries/tech-and-finance' }
      ]
    },
    cities: {
      title: 'Locations',
      items: [
        { name: 'Chennai Hub', href: '/cities/chennai' },
        { name: 'Bangalore Hub', href: '/cities/bangalore' },
        { name: 'Mumbai Hub', href: '/cities/mumbai' }
      ]
    },
    company: {
      title: 'Company',
      items: [
        { name: 'About Infrastructure', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Partner Program', href: '/partners' },
        { name: 'Contact Demo', href: '/contact' }
      ]
    }
  };

  return (
    <footer className="bg-espresso text-white pt-20 pb-12 border-t border-linen/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
          {/* Logo Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white text-espresso rounded-lg flex items-center justify-center font-bold text-lg">
                Z
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white leading-none">Ziggers</span>
                <span className="text-[10px] font-bold tracking-widest text-gold uppercase mt-0.5 leading-none">Execute</span>
              </div>
            </div>
            <p className="text-sm text-linen/70 leading-relaxed max-w-xs mb-6">
              India's definitive On-Ground Marketing Execution Platform. We build the physical and digital infrastructure for offline campaigns.
            </p>
            <p className="text-xs text-linen/50">
              An <a href="https://www.unfounded.in/" target="_blank" rel="noopener noreferrer" className="text-gold font-semibold hover:underline">Unfounded</a> Company
            </p>
          </div>

          {/* Links Grid */}
          {Object.keys(links).map((key) => (
            <div key={key}>
              <h4 className="text-sm font-bold tracking-wider text-gold uppercase mb-6">{links[key].title}</h4>
              <ul className="flex flex-col gap-4 text-sm text-linen/70">
                {links[key].items.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="hover:text-gold transition-colors decoration-transparent text-linen/70">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-linen/10 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-linen/40">
          <p>© {currentYear} Ziggers Limited. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://www.ziggers.in" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors text-linen/40 decoration-transparent">
              Ziggers Main Platform
            </a>
            <Link href="/about" className="hover:text-gold transition-colors text-linen/40 decoration-transparent">Privacy Policy</Link>
            <Link href="/about" className="hover:text-gold transition-colors text-linen/40 decoration-transparent">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

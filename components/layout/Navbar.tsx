'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWalletStore } from '@/store/walletStore';
import { WalletButton } from '@/components/wallet/WalletButton';
import { NetworkSelector } from '@/components/wallet/NetworkSelector';
import { Zap, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { address } = useWalletStore();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/intents', label: 'Intents' },
    { href: '/templates', label: 'Templates' },
    { href: '/analytics', label: 'Analytics' },
  ];

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      {/* Main Glass Pill */}
      <nav className="flex items-center gap-6 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="bg-gradient-to-r from-[#9200E1] to-[#4d65ff] p-2 rounded-full shadow-[0_0_20px_rgba(146,0,225,0.4)]">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white hidden md:block">
            SIP
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  isActive
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3 ml-4">
          {address && <NetworkSelector />}
          
          {/* Wallet Button - White CTA Style */}
          <WalletButton />
          
          {/* Notification Icon */}
          <button className="p-2 text-white/70 hover:text-white transition-colors">
            <Bell size={18} strokeWidth={2.5} />
          </button>
        </div>
      </nav>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWalletStore } from '@/store/walletStore';
import { WalletButton } from '@/components/wallet/WalletButton';
import { NetworkSelector } from '@/components/wallet/NetworkSelector';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { address } = useWalletStore();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/intents', label: 'Intents' },
    { href: '/templates', label: 'Templates' },
    { href: '/analytics', label: 'Analytics' },
  ];

  return (
    <nav className="border-b border-white/10 bg-[#030005]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-[#9200E1] to-[#4d65ff] p-2 rounded-xl shadow-[0_0_20px_rgba(146,0,225,0.4)]">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              STELLAR INTENT PROTOCOL
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all',
                    isActive
                      ? 'bg-white/[0.08] text-white border border-white/20'
                      : 'text-white/40 hover:text-white hover:bg-white/[0.05]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side - Wallet & Network */}
          <div className="flex items-center space-x-3">
            {address && <NetworkSelector />}
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

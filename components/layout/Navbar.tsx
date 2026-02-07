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
    <nav className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Stellar Intent Protocol
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
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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

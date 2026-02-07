'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  BookTemplate,
  BarChart3,
  Settings,
  Zap,
} from 'lucide-react';

const sidebarLinks = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/intents',
    label: 'Intents',
    icon: FileText,
  },
  {
    href: '/templates',
    label: 'Templates',
    icon: BookTemplate,
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4 hidden lg:block">
      <div className="space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900">
            Quick Stats
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Active Intents</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Completed</span>
            <span className="font-medium">0</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

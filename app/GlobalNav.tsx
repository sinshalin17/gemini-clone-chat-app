import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/auth', label: 'Logout' },
];

export default function GlobalNav() {
  const pathname = usePathname();
  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 shadow mb-6">
      <div className="flex items-center gap-6">
        <span className="font-bold text-lg tracking-tight">Gemini Chat</span>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${pathname === link.href ? 'bg-gray-200 dark:bg-gray-700 font-semibold' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <ThemeToggle />
    </nav>
  );
}

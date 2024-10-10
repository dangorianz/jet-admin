'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
    href: string;
    label: string;
    children: React.ReactNode;
}

export function NavItem({href, label, children}: Props) {
  const pathname = usePathname();

  return (
    <div>
        <Link
          href={href}
          className={clsx(
            'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
            {
              'bg-accent text-black': pathname === href
            }
          )}
        >
          {children}
          <span className="sr-only">{label}</span>
        </Link>
      
      
    </div>
  );
}

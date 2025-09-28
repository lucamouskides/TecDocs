import Link from 'next/link';
import { DocumentDuplicateIcon, HomeIcon, Cog6ToothIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Templates', href: '#', icon: DocumentDuplicateIcon }, // Placeholder
  { name: 'Billing', href: '#', icon: CreditCardIcon },      // Placeholder
  { name: 'Account', href: '#', icon: Cog6ToothIcon },     // Placeholder
];

export default function SideNav() {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-neutral-base-8 px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <h1 className="text-2xl font-space font-bold text-white">TecDocs</h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-neutral-base-4 hover:text-white hover:bg-neutral-base-7 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          {/* Add a logout button or user profile at the bottom if needed */}
        </ul>
      </nav>
    </div>
  );
}
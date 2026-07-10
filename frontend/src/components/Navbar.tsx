import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          📊 Project Tracker
        </Link>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-blue-200">
            Dashboard
          </Link>
          <Link href="/clients" className="hover:text-blue-200">
            Clients
          </Link>
          <Link href="/projects" className="hover:text-blue-200">
            Projects
          </Link>
          <Link href="/tasks" className="hover:text-blue-200">
            Tasks
          </Link>
        </div>
      </div>
    </nav>
  );
}
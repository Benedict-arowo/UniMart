'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Book, Laptop, ShoppingBag, User, MessageCircle, Heart } from 'lucide-react'

const sidebarItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Textbooks', href: '/category/textbooks', icon: Book },
  { name: 'Electronics', href: '/category/electronics', icon: Laptop },
  { name: 'All Categories', href: '/categories', icon: ShoppingBag },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Favorites', href: '/favorites', icon: Heart },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-gray-50 w-64 min-h-screen p-4 hidden md:block">
      <nav>
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center space-x-2 p-2 rounded-lg ${
                  pathname === item.href ? 'bg-primary text-primary-foreground' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}


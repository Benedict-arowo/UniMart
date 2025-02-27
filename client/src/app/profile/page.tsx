'use client'

import { useState, useEffect } from 'react'
import { UserProfile } from '../components/UserProfile'
import { ProductCard } from "../components/ProductCard"

interface Product {
  id: number
  name: string
  price: number
  discountedPrice?: number
  image: string
}
// Mock data - in a real app, you'd fetch this from an API
const mockUser = {
  name: "Alice Johnson",
  avatar: "/placeholder.svg?height=100&width=100",
  role: "buyer",
  interests: ["Computer Science", "Art History", "Environmental Studies"],
  location: "New York University"
}

export default function ProfilePage() {
  const [user, setUser] = useState(null)
const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Textbook: Introduction to Computer Science", price: 50, discountedPrice: 40, image: "/placeholder.svg?height=200&width=200" },
    { id: 2, name: "Laptop Backpack", price: 30, image: "/placeholder.svg?height=200&width=200" },
    { id: 3, name: "Scientific Calculator", price: 15, image: "/placeholder.svg?height=200&width=200" },
  ])

  useEffect(() => {
    // In a real app, you'd fetch the user data from an API here
    setUser(mockUser)
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile user={user} />
       <div className="grid grid-cols-1 mt-8 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item.id} className="relative">
              <ProductCard product={item}
            </div>
          ))}
        </div>
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { UserProfile } from '../../components/UserProfile'

// Mock data - in a real app, you'd fetch this from an API
const mockUsers = {
  buyer1: {
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "buyer",
    interests: ["Computer Science", "Art History", "Environmental Studies"],
    location: "New York University"
  },
  seller1: {
    name: "Bob Smith",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "seller",
    rating: 4.7,
    location: "Columbia University",
    productsCount: 15,
    verified: true,
    catalog: [
      { id: 1, name: "Introduction to AI", price: 50, image: "/placeholder.svg?height=200&width=200" },
      { id: 2, name: "History of Art Textbook", price: 40, image: "/placeholder.svg?height=200&width=200" },
      { id: 3, name: "Environmental Science Lab Manual", price: 30, image: "/placeholder.svg?height=200&width=200" },
    ]
  }
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // In a real app, you'd fetch the user data from an API here
    setUser(mockUsers[params.id])
  }, [params.id])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile user={user} />
    </div>
  )
}


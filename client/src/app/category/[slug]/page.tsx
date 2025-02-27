"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ProductCard } from "../../components/ProductCard"
import { ProductCardSkeleton } from "../../components/ProductCardSkeleton"

// Mock data for demonstration
const categoryItemsMock = [
  {
    id: 1,
    name: "Textbook: Introduction to Computer Science",
    price: 50,
    image: "/placeholder.svg?height=200&width=200",
  },
  { id: 2, name: "Textbook: Calculus I", price: 45, image: "/placeholder.svg?height=200&width=200" },
  { id: 3, name: "Textbook: Introduction to Psychology", price: 40, image: "/placeholder.svg?height=200&width=200" },
  { id: 4, name: "Textbook: World History", price: 55, image: "/placeholder.svg?height=200&width=200" },
]

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [categoryItems, setCategoryItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const categoryName = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  useEffect(() => {
    const fetchCategoryItems = async () => {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setCategoryItems(categoryItemsMock)
      setIsLoading(false)
    }
    fetchCategoryItems()
  }, [params.slug])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{categoryName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? [...Array(8)].map((_, index) => <ProductCardSkeleton key={index} />)
          : categoryItems.map((item) => <ProductCard key={item.id} product={item} />)}
      </div>
    </div>
  )
}


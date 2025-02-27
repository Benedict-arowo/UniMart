'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from 'next/image'

interface Product {
  id: number
  name: string
  price: number
  discountedPrice?: number
  image: string
  seller: string
  condition: string
}

export function ProductComparison({ products }: { products: Product[] }) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id.toString() === productId)
    if (product && !selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product])
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Compare Products</h2>
      <Select onValueChange={handleProductSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select a product to compare" />
        </SelectTrigger>
        <SelectContent>
          {products.map((product) => (
            <SelectItem key={product.id} value={product.id.toString()}>
              {product.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image src={product.image} alt={product.name} width={200} height={200} className="mb-4" />
              <p><strong>Price:</strong> ${product.discountedPrice || product.price}</p>
              <p><strong>Seller:</strong> {product.seller}</p>
              <p><strong>Condition:</strong> {product.condition}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from 'lucide-react'

interface Review {
  id: number
  customerName: string
  rating: number
  comment: string
  response?: string
}

const initialReviews: Review[] = [
  { id: 1, customerName: 'John Doe', rating: 4, comment: 'Great product, fast shipping!' },
  { id: 2, customerName: 'Jane Smith', rating: 5, comment: 'Excellent quality, highly recommended!' },
  { id: 3, customerName: 'Bob Johnson', rating: 3, comment: 'Good product, but arrived later than expected.' },
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)

  const handleRespond = (id: number, response: string) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, response } : review
    ))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Customer Reviews</h1>
      {reviews.map((review) => (
        <Card key={review.id} className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{review.customerName}</span>
              <span className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{review.comment}</p>
            {review.response ? (
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-semibold">Your response:</p>
                <p>{review.response}</p>
              </div>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault()
                const response = (e.target as HTMLFormElement).response.value
                handleRespond(review.id, response)
              }} className="flex gap-2">
                <Input name="response" placeholder="Type your response..." />
                <Button type="submit">Respond</Button>
              </form>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


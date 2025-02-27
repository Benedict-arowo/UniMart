'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Star } from 'lucide-react'

interface SellerRatingProps {
  sellerId: number;
  sellerName: string;
}

export function SellerRating({ sellerId, sellerName }: SellerRatingProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd send this rating to an API
    console.log(`Rating for seller ${sellerId}: ${rating} stars, comment: ${comment}`)
    // Reset form
    setRating(0)
    setComment('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate {sellerName}</CardTitle>
        <CardDescription>How was your experience with this seller?</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <Textarea
          placeholder="Leave a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={rating === 0}>Submit Rating</Button>
      </CardFooter>
    </Card>
  )
}


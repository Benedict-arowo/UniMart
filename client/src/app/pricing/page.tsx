'use client'

import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

const plans = [
  {
    name: "Free Trial",
    price: "N0",
    duration: "14 days",
    features: [
      "Basic product listings",
      "Limited message exchanges",
      "Standard search functionality",
      "Community forum access",
    ],
    cta: "Start Free Trial"
  },
  {
    name: "Basic",
    price: "N2,000",
    duration: "per month",
    features: [
      "Unlimited product listings",
      "Unlimited message exchanges",
      "Advanced search filters",
      "Priority community support",
      "Basic analytics dashboard",
    ],
    cta: "Choose Basic"
  },
  {
    name: "Premium",
    price: "N8,000",
    duration: "per month",
    features: [
      "All Basic features",
      "Featured product listings",
      "Verified seller badge",
      "Advanced analytics and insights",
      "Dedicated customer support",
      "Early access to new features",
    ],
    cta: "Choose Premium"
  }
]

export default function PricingPage() {
  const router = useRouter()

  const handlePlanSelection = (planName: string) => {
    // Here you would typically send a request to your API to set the user's plan
    console.log(`Selected plan: ${planName}`)
    // After plan selection, redirect to store setup
    router.push('/store-setup')
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.duration !== "14 days" && <span className="text-sm">/{plan.duration}</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handlePlanSelection(plan.name)}>{plan.cta}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}


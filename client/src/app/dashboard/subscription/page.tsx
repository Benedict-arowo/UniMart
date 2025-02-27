import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SubscriptionPage() {
  const currentPlan = "Basic"

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Subscription</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Plan: {currentPlan}</CardTitle>
          <CardDescription>Your subscription renews on July 1, 2023</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            <li>Unlimited product listings</li>
            <li>Basic analytics</li>
            <li>Email support</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button>Upgrade Plan</Button>
        </CardFooter>
      </Card>
      <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic</CardTitle>
            <CardDescription>$19.99/month</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              <li>Unlimited product listings</li>
              <li>Basic analytics</li>
              <li>Email support</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled>Current Plan</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>$49.99/month</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              <li>All Basic features</li>
              <li>Advanced analytics</li>
              <li>Priority support</li>
              <li>5 boosted products</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button>Upgrade to Pro</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>$99.99/month</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              <li>All Pro features</li>
              <li>All Pro features</li>
              <li>Unlimited boosted products</li>
              <li>Dedicated account manager</li>
              <li>Custom integrations</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button>Upgrade to Enterprise</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


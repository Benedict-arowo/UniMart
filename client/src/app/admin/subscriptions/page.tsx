'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash, CreditCard } from 'lucide-react'

interface Subscription {
  id: number
  user: string
  plan: string
  status: 'active' | 'cancelled' | 'expired'
  startDate: string
  endDate: string
}

const initialSubscriptions: Subscription[] = [
  { id: 1, user: 'John Doe', plan: 'Basic', status: 'active', startDate: '2023-01-01', endDate: '2023-12-31' },
  { id: 2, user: 'Jane Smith', plan: 'Pro', status: 'active', startDate: '2023-03-15', endDate: '2024-03-14' },
  { id: 3, user: 'Bob Johnson', plan: 'Enterprise', status: 'cancelled', startDate: '2023-02-01', endDate: '2023-08-01' },
]

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions)

  const handleDelete = (id: number) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Subscriptions</h1>
        <Button>
          <CreditCard className="mr-2 h-4 w-4" /> Add Subscription
        </Button>
      </div>
      <div className="mb-4">
        <Input placeholder="Search subscriptions..." />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell>{subscription.user}</TableCell>
              <TableCell>{subscription.plan}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                  subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {subscription.status}
                </span>
              </TableCell>
              <TableCell>{subscription.startDate}</TableCell>
              <TableCell>{subscription.endDate}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(subscription.id)} className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


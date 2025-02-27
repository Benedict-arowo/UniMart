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
import { MoreHorizontal, Eye, MessageSquare, CheckCircle } from 'lucide-react'

interface SupportTicket {
  id: number
  user: string
  subject: string
  date: string
  status: 'open' | 'in progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
}

const initialTickets: SupportTicket[] = [
  { id: 1, user: 'John Doe', subject: 'Payment issue', date: '2023-06-15', status: 'open', priority: 'high' },
  { id: 2, user: 'Jane Smith', subject: 'Account access problem', date: '2023-06-14', status: 'in progress', priority: 'medium' },
  { id: 3, user: 'Bob Johnson', subject: 'Product inquiry', date: '2023-06-13', status: 'resolved', priority: 'low' },
]

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets)

  const handleStatusChange = (id: number, newStatus: 'open' | 'in progress' | 'resolved') => {
    setTickets(tickets.map(ticket =>
      ticket.id === id ? { ...ticket, status: newStatus } : ticket
    ))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" /> New Ticket
        </Button>
      </div>
      <div className="mb-4">
        <Input placeholder="Search tickets..." />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.user}</TableCell>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>{ticket.date}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                  ticket.status === 'in progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {ticket.status}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  ticket.priority === 'low' ? 'bg-blue-100 text-blue-800' :
                  ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {ticket.priority}
                </span>
              </TableCell>
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
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" /> Reply
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'resolved')}>
                      <CheckCircle className="mr-2 h-4 w-4" /> Mark as Resolved
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


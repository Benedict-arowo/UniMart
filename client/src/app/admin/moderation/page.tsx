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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MoreHorizontal, Check, X, AlertTriangle } from 'lucide-react'

interface ModerationItem {
  id: number
  type: 'product' | 'review' | 'user'
  content: string
  reportedBy: string
  status: 'pending' | 'approved' | 'rejected'
  details: string
}

const initialModerationItems: ModerationItem[] = [
  { id: 1, type: 'product', content: 'Suspicious product listing', reportedBy: 'user123', status: 'pending', details: 'This product listing contains potentially misleading information about its origin and materials.' },
  { id: 2, type: 'review', content: 'Inappropriate language in review', reportedBy: 'user456', status: 'pending', details: 'The review contains profanity and personal attacks against the seller.' },
  { id: 3, type: 'user', content: 'Potential spam account', reportedBy: 'user789', status: 'pending', details: 'This account has posted a large number of similar, low-quality product listings in a short time period.' },
]

export default function ModerationPage() {
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>(initialModerationItems)
  const [viewingItem, setViewingItem] = useState<ModerationItem | null>(null)

  const handleStatusChange = (id: number, newStatus: 'approved' | 'rejected') => {
    setModerationItems(items =>
      items.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    )
  }

  const handleViewDetails = (item: ModerationItem) => {
    setViewingItem(item)
  }

  return (
    <div>
      <Dialog>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Content Moderation</h1>
        </div>
        <div className="mb-4">
          <Input placeholder="Search moderation items..." />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {moderationItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.content}</TableCell>
                <TableCell>{item.reportedBy}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
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
                      <DropdownMenuItem onClick={() => handleStatusChange(item.id, 'approved')}>
                        <Check className="mr-2 h-4 w-4" /> Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(item.id, 'rejected')}>
                        <X className="mr-2 h-4 w-4" /> Reject
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleViewDetails(item); }}>
                          <AlertTriangle className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                      </DialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Moderation Item Details</DialogTitle>
          </DialogHeader>
          {viewingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type:</Label>
                <div className="col-span-3">{viewingItem.type}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Content:</Label>
                <div className="col-span-3">{viewingItem.content}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Reported By:</Label>
                <div className="col-span-3">{viewingItem.reportedBy}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status:</Label>
                <div className="col-span-3">{viewingItem.status}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Details:</Label>
                <Textarea
                  value={viewingItem.details}
                  readOnly
                  className="col-span-3"
                  rows={4}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


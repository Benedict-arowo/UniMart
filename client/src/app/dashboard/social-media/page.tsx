'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Facebook, Twitter, Instagram } from 'lucide-react'

interface SocialPost {
  id: number
  platform: 'facebook' | 'twitter' | 'instagram'
  content: string
  image?: string
  scheduledTime?: string
}

const initialPosts: SocialPost[] = [
  { id: 1, platform: 'facebook', content: 'Check out our new summer collection!', scheduledTime: '2023-06-20 10:00' },
  { id: 2, platform: 'twitter', content: 'Flash sale! 20% off all items for the next 24 hours. #summersale', scheduledTime: '2023-06-21 09:00' },
  { id: 3, platform: 'instagram', content: 'Behind the scenes look at our latest photoshoot. Stay tuned for the full collection reveal!', image: '/photoshoot.jpg' },
]

export default function SocialMediaPage() {
  const [posts, setPosts] = useState<SocialPost[]>(initialPosts)
  const [newPost, setNewPost] = useState<SocialPost>({
    id: 0,
    platform: 'facebook',
    content: '',
  })

  const handlePostChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewPost(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPosts(prev => [...prev, { ...newPost, id: Math.max(...prev.map(p => p.id)) + 1 }])
    setNewPost({ id: 0, platform: 'facebook', content: '' })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Social Media Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700">Platform</label>
              <select
                id="platform"
                name="platform"
                value={newPost.platform}
                onChange={handlePostChange as React.ChangeEventHandler<HTMLSelectElement>}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
              <Textarea
                id="content"
                name="content"
                value={newPost.content}
                onChange={handlePostChange}
                rows={3}
                className="mt-1 block w-full"
                placeholder="Write your post content here..."
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
              <Input
                type="text"
                id="image"
                name="image"
                value={newPost.image || ''}
                onChange={handlePostChange}
                className="mt-1 block w-full"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700">Schedule Post (optional)</label>
              <Input
                type="datetime-local"
                id="scheduledTime"
                name="scheduledTime"
                value={newPost.scheduledTime || ''}
                onChange={handlePostChange}
                className="mt-1 block w-full"
              />
            </div>
            <Button type="submit">Create Post</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="facebook">Facebook</TabsTrigger>
              <TabsTrigger value="twitter">Twitter</TabsTrigger>
              <TabsTrigger value="instagram">Instagram</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {posts.map(post => (
                <div key={post.id} className="mb-4 p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    {post.platform === 'facebook' && <Facebook className="mr-2" />}
                    {post.platform === 'twitter' && <Twitter className="mr-2" />}
                    {post.platform === 'instagram' && <Instagram className="mr-2" />}
                    <span className="font-semibold">{post.platform}</span>
                  </div>
                  <p>{post.content}</p>
                  {post.image && <img src={post.image} alt="Post image" className="mt-2 max-w-full h-auto" />}
                  {post.scheduledTime && <p className="text-sm text-gray-500 mt-2">Scheduled for: {post.scheduledTime}</p>}
                </div>
              ))}
            </TabsContent>
            <TabsContent value="facebook">
              {posts.filter(post => post.platform === 'facebook').map(post => (
                <div key={post.id} className="mb-4 p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Facebook className="mr-2" />
                    <span className="font-semibold">Facebook</span>
                  </div>
                  <p>{post.content}</p>
                  {post.image && <img src={post.image} alt="Post image" className="mt-2 max-w-full h-auto" />}
                  {post.scheduledTime && <p className="text-sm text-gray-500 mt-2">Scheduled for: {post.scheduledTime}</p>}
                </div>
              ))}
            </TabsContent>
            <TabsContent value="twitter">
              {posts.filter(post => post.platform === 'twitter').map(post => (
                <div key={post.id} className="mb-4 p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Twitter className="mr-2" />
                    <span className="font-semibold">Twitter</span>
                  </div>
                  <p>{post.content}</p>
                  {post.image && <img src={post.image} alt="Post image" className="mt-2 max-w-full h-auto" />}
                  {post.scheduledTime && <p className="text-sm text-gray-500 mt-2">Scheduled for: {post.scheduledTime}</p>}
                </div>
              ))}
            </TabsContent>
            <TabsContent value="instagram">
              {posts.filter(post => post.platform === 'instagram').map(post => (
                <div key={post.id} className="mb-4 p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Instagram className="mr-2" />
                    <span className="font-semibold">Instagram</span>
                  </div>
                  <p>{post.content}</p>
                  {post.image && <img src={post.image} alt="Post image" className="mt-2 max-w-full h-auto" />}
                  {post.scheduledTime && <p className="text-sm text-gray-500 mt-2">Scheduled for: {post.scheduledTime}</p>}
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


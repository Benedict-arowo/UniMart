'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Settings {
  siteName: string
  siteDescription: string
  contactEmail: string
  enableRegistration: boolean
  enableMessaging: boolean
  maintenanceMode: boolean
}

const initialSettings: Settings = {
  siteName: 'My Marketplace',
  siteDescription: 'A platform for buying and selling products',
  contactEmail: 'contact@mymarketplace.com',
  enableRegistration: true,
  enableMessaging: true,
  maintenanceMode: false,
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(initialSettings)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleToggle = (name: keyof Settings) => {
    setSettings(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated settings to your API
    console.log('Updated settings:', settings)
    alert('Settings updated successfully!')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Settings</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage your marketplace settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableRegistration"
                checked={settings.enableRegistration}
                onCheckedChange={() => handleToggle('enableRegistration')}
              />
              <Label htmlFor="enableRegistration">Enable User Registration</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableMessaging"
                checked={settings.enableMessaging}
                onCheckedChange={() => handleToggle('enableMessaging')}
              />
              <Label htmlFor="enableMessaging">Enable Messaging System</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={() => handleToggle('maintenanceMode')}
              />
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}


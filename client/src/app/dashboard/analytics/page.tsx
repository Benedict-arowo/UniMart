'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
]

const popularProductsData = [
  { name: 'Product A', value: 400 },
  { name: 'Product B', value: 300 },
  { name: 'Product C', value: 300 },
  { name: 'Product D', value: 200 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const customerBehaviorData = [
  { name: 'Mon', visits: 1000, purchases: 400 },
  { name: 'Tue', visits: 1200, purchases: 300 },
  { name: 'Wed', visits: 1500, purchases: 500 },
  { name: 'Thu', visits: 1300, purchases: 450 },
  { name: 'Fri', visits: 1400, purchases: 600 },
  { name: 'Sat', visits: 1800, purchases: 750 },
  { name: 'Sun', visits: 2000, purchases: 800 },
]

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Popular Products</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={popularProductsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {popularProductsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Most Clicked Products</h3>
                <ol className="list-decimal list-inside">
                  <li>Product A - 1,200 clicks</li>
                  <li>Product B - 950 clicks</li>
                  <li>Product C - 820 clicks</li>
                  <li>Product D - 750 clicks</li>
                  <li>Product E - 600 clicks</li>
                </ol>
                <h3 className="text-lg font-semibold">Top Selling Products</h3>
                <ol className="list-decimal list-inside">
                  <li>Product B - 500 units</li>
                  <li>Product A - 450 units</li>
                  <li>Product E - 400 units</li>
                  <li>Product C - 350 units</li>
                  <li>Product D - 300 units</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Behavior</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={customerBehaviorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="visits" stroke="#8884d8" />
                    <Line yAxisId="right" type="monotone" dataKey="purchases" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Browsing Habits</h3>
                  <ul className="list-disc list-inside">
                    <li>Average session duration: 8 minutes</li>
                    <li>Most active browsing time: 7 PM - 9 PM</li>
                    <li>Top categories viewed: Electronics, Clothing, Home Decor</li>
                  </ul>
                  <h3 className="text-lg font-semibold">Purchasing Trends</h3>
                  <ul className="list-disc list-inside">
                    <li>Average order value: $75</li>
                    <li>Most popular payment method: Credit Card</li>
                    <li>Repeat purchase rate: 35%</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


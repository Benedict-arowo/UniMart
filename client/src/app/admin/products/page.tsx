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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { MoreHorizontal, Edit, Trash, Package, Zap } from 'lucide-react'
import { FileUploader } from "@/components/FileUploader"

interface Product {
  id: number
  name: string
  store: string
  price: number
  discountedPrice?: number
  stock: number
  status: 'active' | 'inactive'
  isBoosted: boolean
  images: string[]
  videos: string[]
}

interface Store {
  id: number
  name: string
  owner: string
}

const initialProducts: Product[] = [
  { id: 1, name: 'Smartphone X', store: 'Tech Haven', price: 599.99, stock: 100, status: 'active', isBoosted: true, images: [], videos: [] },
  { id: 2, name: 'Designer Jeans', store: 'Fashion Frenzy', price: 89.99, discountedPrice: 79.99, stock: 50, status: 'active', isBoosted: false, images: [], videos: [] },
  { id: 3, name: 'Coffee Maker', store: 'Home Essentials', price: 49.99, stock: 25, status: 'inactive', isBoosted: false, images: [], videos: [] },
]

const stores: Store[] = [
  { id: 1, name: 'Tech Haven', owner: 'John Doe' },
  { id: 2, name: 'Fashion Frenzy', owner: 'Jane Smith' },
  { id: 3, name: 'Home Essentials', owner: 'Bob Johnson' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleStatusToggle = (id: number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' } : product
    ))
  }

  const handleDelete = (id: number) => {
    setProducts(products.filter(product => product.id !== id))
  }

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product })
  }

  const handleSave = () => {
    if (editingProduct) {
      setProducts(products.map(product => product.id === editingProduct.id ? editingProduct : product))
      setEditingProduct(null)
    }
  }

  const handleBoostToggle = (id: number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, isBoosted: !product.isBoosted } : product
    ))
  }

  return (
    <Dialog>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Button>
          <Package className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
      <div className="mb-4">
        <Input placeholder="Search products..." />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Boosted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className={product.isBoosted ? "bg-yellow-50" : ""}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.store}</TableCell>
              <TableCell>
                ${product.price.toFixed(2)}
                {product.discountedPrice && (
                  <span className="ml-2 text-sm text-green-600">
                    ${product.discountedPrice.toFixed(2)}
                  </span>
                )}
              </TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Button
                  variant={product.status === 'active' ? 'default' : 'secondary'}
                  onClick={() => handleStatusToggle(product.id)}
                >
                  {product.status === 'active' ? 'Active' : 'Inactive'}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => handleBoostToggle(product.id)}
                >
                  {product.isBoosted ? <Zap className="h-4 w-4 text-yellow-500" /> : <Zap className="h-4 w-4" />}
                </Button>
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
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleEdit(product); }}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => handleDelete(product.id)} className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        </DialogHeader>
        {editingProduct && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Product Name
              </Label>
              <Input
                id="name"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="store" className="text-right">
                Store
              </Label>
              <Select
                value={editingProduct.store}
                onValueChange={(value) => setEditingProduct({ ...editingProduct, store: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.name}>{store.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountedPrice" className="text-right">
                Discounted Price
              </Label>
              <Input
                id="discountedPrice"
                type="number"
                value={editingProduct.discountedPrice || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, discountedPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                value={editingProduct.stock}
                onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={editingProduct.status}
                onValueChange={(value: 'active' | 'inactive') => setEditingProduct({ ...editingProduct, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="boosted" className="text-right">
                Boosted
              </Label>
              <Switch
                id="boosted"
                checked={editingProduct.isBoosted}
                onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, isBoosted: checked })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Images
              </Label>
              <div className="col-span-3">
                <FileUploader
                  id="images"
                  accept="image/*"
                  onFileSelect={(file) => setEditingProduct({ ...editingProduct, images: [...editingProduct.images, URL.createObjectURL(file)] })}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {editingProduct.images.map((image, index) => (
                    <img key={index} src={image || "/placeholder.svg"} alt={`Product ${index + 1}`} className="h-20 w-20 object-cover" />
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Videos
              </Label>
              <div className="col-span-3">
                <FileUploader
                  id="videos"
                  accept="video/*"
                  onFileSelect={(file) => setEditingProduct({ ...editingProduct, videos: [...editingProduct.videos, URL.createObjectURL(file)] })}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {editingProduct.videos.map((video, index) => (
                    <video key={index} src={video} className="h-20 w-20 object-cover" controls />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <Button onClick={handleSave}>Save changes</Button>
      </DialogContent>
    </Dialog>
  )
}


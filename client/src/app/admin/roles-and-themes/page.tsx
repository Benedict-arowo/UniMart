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
import { MoreHorizontal, Edit, Trash, UserPlus, Palette } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Role {
  id: number
  name: string
  permissions: string[]
}

interface Theme {
  id: number
  name: string
  primaryColor: string
  secondaryColor: string
  textColor: string
}

const initialRoles: Role[] = [
  { id: 1, name: 'Admin', permissions: ['manage_users', 'manage_stores', 'manage_products', 'manage_themes'] },
  { id: 2, name: 'Store Owner', permissions: ['manage_own_store', 'manage_own_products'] },
  { id: 3, name: 'Customer', permissions: ['view_products', 'make_purchases'] },
]

const initialThemes: Theme[] = [
  { id: 1, name: 'Light', primaryColor: '#ffffff', secondaryColor: '#f1f5f9', textColor: '#000000' },
  { id: 2, name: 'Dark', primaryColor: '#1e293b', secondaryColor: '#334155', textColor: '#ffffff' },
  { id: 3, name: 'Blue', primaryColor: '#e0f2fe', secondaryColor: '#bae6fd', textColor: '#0c4a6e' },
]

export default function RolesAndThemesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [themes, setThemes] = useState<Theme[]>(initialThemes)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null)

  const handleDeleteRole = (id: number) => {
    setRoles(roles.filter(role => role.id !== id))
  }

  const handleEditRole = (role: Role) => {
    setEditingRole({ ...role })
  }

  const handleSaveRole = () => {
    if (editingRole) {
      setRoles(roles.map(role => role.id === editingRole.id ? editingRole : role))
      setEditingRole(null)
    }
  }

  const handleDeleteTheme = (id: number) => {
    setThemes(themes.filter(theme => theme.id !== id))
  }

  const handleEditTheme = (theme: Theme) => {
    setEditingTheme({ ...theme })
  }

  const handleSaveTheme = () => {
    if (editingTheme) {
      setThemes(themes.map(theme => theme.id === editingTheme.id ? editingTheme : theme))
      setEditingTheme(null)
    }
  }

  return (
    <Dialog>
      <Tabs defaultValue="roles">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Roles and Themes</h1>
          <TabsList>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="roles">
          <div className="flex justify-between items-center mb-4">
            <Input placeholder="Search roles..." className="max-w-sm" />
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Add Role
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.permissions.join(', ')}</TableCell>
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
                          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleEditRole(role); }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => handleDeleteRole(role.id)} className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="themes">
          <div className="flex justify-between items-center mb-4">
            <Input placeholder="Search themes..." className="max-w-sm" />
            <Button>
              <Palette className="mr-2 h-4 w-4" /> Add Theme
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Theme Name</TableHead>
                <TableHead>Primary Color</TableHead>
                <TableHead>Secondary Color</TableHead>
                <TableHead>Text Color</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {themes.map((theme) => (
                <TableRow key={theme.id}>
                  <TableCell>{theme.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: theme.primaryColor }}></div>
                      {theme.primaryColor}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: theme.secondaryColor }}></div>
                      {theme.secondaryColor}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: theme.textColor }}></div>
                      {theme.textColor}
                    </div>
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
                          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleEditTheme(theme); }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => handleDeleteTheme(theme.id)} className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingRole ? 'Edit Role' : editingTheme ? 'Edit Theme' : 'Add Role/Theme'}</DialogTitle>
        </DialogHeader>
        {editingRole && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roleName" className="text-right">
                Role Name
              </Label>
              <Input
                id="roleName"
                value={editingRole.name}
                onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="permissions" className="text-right">
                Permissions
              </Label>
              <Select
                value={editingRole.permissions.join(',')}
                onValueChange={(value) => setEditingRole({ ...editingRole, permissions: value.split(',') })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select permissions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manage_users">Manage Users</SelectItem>
                  <SelectItem value="manage_stores">Manage Stores</SelectItem>
                  <SelectItem value="manage_products">Manage Products</SelectItem>
                  <SelectItem value="manage_themes">Manage Themes</SelectItem>
                  <SelectItem value="manage_own_store">Manage Own Store</SelectItem>
                  <SelectItem value="manage_own_products">Manage Own Products</SelectItem>
                  <SelectItem value="view_products">View Products</SelectItem>
                  <SelectItem value="make_purchases">Make Purchases</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        {editingTheme && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="themeName" className="text-right">
                Theme Name
              </Label>
              <Input
                id="themeName"
                value={editingTheme.name}
                onChange={(e) => setEditingTheme({ ...editingTheme, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="primaryColor" className="text-right">
                Primary Color
              </Label>
              <Input
                id="primaryColor"
                type="color"
                value={editingTheme.primaryColor}
                onChange={(e) => setEditingTheme({ ...editingTheme, primaryColor: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="secondaryColor" className="text-right">
                Secondary Color
              </Label>
              <Input
                id="secondaryColor"
                type="color"
                value={editingTheme.secondaryColor}
                onChange={(e) => setEditingTheme({ ...editingTheme, secondaryColor: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="textColor" className="text-right">
                Text Color
              </Label>
              <Input
                id="textColor"
                type="color"
                value={editingTheme.textColor}
                onChange={(e) => setEditingTheme({ ...editingTheme, textColor: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
        )}
        <Button onClick={editingRole ? handleSaveRole : handleSaveTheme}>Save changes</Button>
      </DialogContent>
    </Dialog>
  )
}


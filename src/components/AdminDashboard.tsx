import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Plus, Edit, Trash2, LogOut, ShoppingBag, Eye, Save, X, UploadCloud, Image as ImageIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Badge } from './ui/badge'
import toast from 'react-hot-toast'
import { Product } from '../App'

interface AdminDashboardProps {
  products: Product[]
  onAddProduct: (product: Omit<Product, 'id'>) => void
  onUpdateProduct: (id: string, product: Omit<Product, 'id'>) => void
  onDeleteProduct: (id: string) => void
  onLogout: () => void
  isLoggedIn: boolean
}

const AdminDashboard = ({ 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct, 
  onLogout,
  isLoggedIn 
}: AdminDashboardProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '', // Will store base64 string or existing URL
    price: ''
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image)
    } else {
      setImagePreview(null)
    }
  }, [formData.image])

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', image: '', price: '' })
    setImagePreview(null)
    // Clear file input if it exists (programmatically tricky, often handled by form reset or key change)
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    const editFileInput = document.getElementById('edit-image-upload') as HTMLInputElement;
    if (editFileInput) editFileInput.value = "";
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.image || !formData.price) {
      toast.error('Please fill in all fields, including the image.')
      return
    }

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, formData)
      toast.success('Product updated successfully!')
      setEditingProduct(null) // This will close the edit dialog
    } else {
      onAddProduct(formData)
      toast.success('Product added successfully!')
      setIsAddDialogOpen(false) // This will close the add dialog
    }
    
    resetForm()
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      description: product.description,
      image: product.image, // This could be a URL or base64
      price: product.price
    })
    setImagePreview(product.image) // Set initial preview for editing
  }

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDeleteProduct(id)
      toast.success('Product deleted successfully!')
    }
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout()
      toast.success('Logged out successfully!')
    }
  }

  const commonFormFields = (isEditing: boolean) => (
    <>
      <div>
        <Label htmlFor={isEditing ? 'edit-title' : 'title'}>Product Title</Label>
        <Input
          id={isEditing ? 'edit-title' : 'title'}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter product title"
          required
        />
      </div>
      <div>
        <Label htmlFor={isEditing ? 'edit-description' : 'description'}>Description</Label>
        <Textarea
          id={isEditing ? 'edit-description' : 'description'}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter product description"
          rows={3}
          required
        />
      </div>
      <div>
        <Label htmlFor={isEditing ? 'edit-image-upload' : 'image-upload'}>Product Image</Label>
        <Input
          id={isEditing ? 'edit-image-upload' : 'image-upload'}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          required={!isEditing || !formData.image} // Required if adding, or if editing and no current image
        />
        {imagePreview && (
          <div className="mt-3 p-2 border rounded-md bg-gray-50">
            <Label className="text-xs text-gray-500">Image Preview</Label>
            <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-40 object-contain rounded mt-1" />
          </div>
        )}
        {!imagePreview && (
            <div className="mt-3 p-4 border rounded-md bg-gray-50 text-center text-gray-400">
                <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                <p className="text-sm">No image selected</p>
            </div>
        )}
      </div>
      <div>
        <Label htmlFor={isEditing ? 'edit-price' : 'price'}>Price</Label>
        <Input
          id={isEditing ? 'edit-price' : 'price'}
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="$99"
          required
        />
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your digital products</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {products.length} Products
              </Badge>
              <Button
                onClick={() => window.open('/', '_blank')}
                variant="outline"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Store
              </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Product Button */}
        <div className="mb-8">
          <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => {
            setIsAddDialogOpen(isOpen)
            if (!isOpen) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new digital product to your store.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                {commonFormFields(false)}
                <DialogFooter className="pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddDialogOpen(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <UploadCloud className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <CardTitle className="text-xl text-gray-700 mb-2">No Products Yet</CardTitle>
              <CardDescription>
                Start by adding your first digital product to the store
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader className="p-0">
                  <div className="aspect-video overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center">
                    {product.image ? (
                        <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <ImageIcon className="w-16 h-16 text-gray-300" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Digital Product
                    </Badge>
                    <span className="text-lg font-bold text-green-600">{product.price}</span>
                  </div>
                  <CardTitle className="text-base mb-2 line-clamp-2 font-semibold">
                    {product.title}
                  </CardTitle>
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {product.description}
                  </p>
                </CardContent>
                <div className="p-4 pt-0 flex space-x-2 border-t mt-auto">
                  <Button
                    onClick={() => handleEdit(product)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(product.id, product.title)}
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <Dialog open={!!editingProduct} onOpenChange={(isOpen) => {
            setEditingProduct(isOpen ? editingProduct : null)
            if (!isOpen) resetForm()
          }}>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>
                  Update the details of "{editingProduct.title}"
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                {commonFormFields(true)}
                <DialogFooter className="pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setEditingProduct(null)
                      resetForm()
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
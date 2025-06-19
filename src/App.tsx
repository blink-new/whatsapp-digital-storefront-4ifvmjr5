import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import Storefront from './components/Storefront'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import { supabase } from './lib/supabaseClient'
import toast from 'react-hot-toast'

export interface Product {
  id: string // UUID from Supabase
  title: string
  description: string
  image: string // Base64 string or URL
  price: string
  created_at?: string
}

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  // Fetch products from Supabase
  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        toast.error('Error fetching products: ' + error.message)
        console.error('Error fetching products:', error)
        setProducts([]) // Set to empty array on error
      } else {
        setProducts(data || [])
      }
    } catch (error) {
      toast.error('An unexpected error occurred while fetching products.')
      console.error('Unexpected error fetching products:', error)
      setProducts([]) // Set to empty array on error
    }
    setIsLoadingProducts(false)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Admin Auth
  useEffect(() => {
    const adminStatus = localStorage.getItem('adminLoggedIn')
    if (adminStatus === 'true') {
      setIsAdminLoggedIn(true)
    }
  }, [])

  const handleAdminLogin = (username: string, password: string) => {
    if (username === 'nida' && password === 'Rcc1478c@') {
      setIsAdminLoggedIn(true)
      localStorage.setItem('adminLoggedIn', 'true')
      return true
    }
    return false
  }

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false)
    localStorage.removeItem('adminLoggedIn')
  }

  // Product CRUD operations with Supabase
  const addProduct = async (productData: Omit<Product, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()

      if (error) {
        toast.error('Error adding product: ' + error.message)
        console.error('Error adding product:', error)
        return null
      } 
      if (data && data.length > 0) {
        // Optimistically update UI or refetch
        // setProducts(prev => [data[0], ...prev]) 
        await fetchProducts() // Refetch to ensure data consistency and order
        return data[0]
      }
      return null
    } catch (error) {
      toast.error('An unexpected error occurred while adding product.')
      console.error('Unexpected error adding product:', error)
      return null
    }
  }

  const updateProduct = async (id: string, updatedProductData: Omit<Product, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updatedProductData)
        .eq('id', id)
        .select()

      if (error) {
        toast.error('Error updating product: ' + error.message)
        console.error('Error updating product:', error)
        return false
      }
      if (data && data.length > 0) {
        // setProducts(prev => prev.map(p => (p.id === id ? data[0] : p)))
        await fetchProducts() // Refetch for consistency
        return true
      }
      return false
    } catch (error) {
      toast.error('An unexpected error occurred while updating product.')
      console.error('Unexpected error updating product:', error)
      return false
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        toast.error('Error deleting product: ' + error.message)
        console.error('Error deleting product:', error)
        return false
      }
      // setProducts(prev => prev.filter(p => p.id !== id))
      await fetchProducts() // Refetch for consistency
      return true
    } catch (error) {
      toast.error('An unexpected error occurred while deleting product.')
      console.error('Unexpected error deleting product:', error)
      return false
    }
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isLoadingProducts && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-lg text-purple-700 font-semibold">Loading Products...</p>
            </div>
          </div>
        )}
        <Routes>
          <Route 
            path="/" 
            element={<Storefront products={products} />} 
          />
          <Route 
            path="/admin/login" 
            element={
              <AdminLogin 
                onLogin={handleAdminLogin} 
                isLoggedIn={isAdminLoggedIn}
              />
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminDashboard 
                products={products}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
                onDeleteProduct={deleteProduct}
                onLogout={handleAdminLogout}
                isLoggedIn={isAdminLoggedIn}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
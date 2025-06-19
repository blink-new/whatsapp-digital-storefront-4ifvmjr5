import { MessageCircle, ShoppingBag, Star } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Product } from '../App'

interface StorefrontProps {
  products: Product[]
}

const Storefront = ({ products }: StorefrontProps) => {
  const handleWhatsAppClick = (product: Product) => {
    const message = `Hi! I'm interested in purchasing "${product.title}" for ${product.price}. Could you please provide more details?`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/16727631836?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-green-500 p-2 rounded-xl">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Digital Store</h1>
                <p className="text-sm text-gray-600">Premium Digital Products</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <MessageCircle className="h-3 w-3 mr-1" />
              WhatsApp Store
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Premium Digital Products
            <span className="text-green-600"> Just a Chat Away</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our curated collection of digital products. Click "Buy Now" to connect with us instantly on WhatsApp for secure purchase and immediate delivery.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 text-green-500 mr-1" />
              <span>Instant Support</span>
            </div>
            <div className="flex items-center">
              <ShoppingBag className="h-4 w-4 text-blue-500 mr-1" />
              <span>Secure Purchase</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each product comes with instant download access after purchase confirmation through WhatsApp
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Available</h3>
              <p className="text-gray-500">Check back soon for amazing digital products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
                  <CardHeader className="p-0">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Digital Product
                      </Badge>
                      <span className="text-2xl font-bold text-green-600">{product.price}</span>
                    </div>
                    <CardTitle className="text-xl mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 line-clamp-3">
                      {product.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      onClick={() => handleWhatsAppClick(product)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:shadow-lg"
                      size="lg"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Buy Now on WhatsApp
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-green-500 p-2 rounded-xl">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">WhatsApp Digital Store</span>
          </div>
          <p className="text-gray-600 mb-4">
            Secure purchases through WhatsApp chat • Instant digital delivery • Premium support
          </p>
          <div className="text-sm text-gray-500">
            <p>Contact us: +1 672-763-1836 | All purchases are processed securely</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Storefront
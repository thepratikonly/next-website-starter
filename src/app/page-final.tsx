"use client";

import { useState, useEffect } from "react";
import { InventoryDashboardFinal } from "../components/inventory-dashboard-final";
import { ProductFormDynamic } from "../components/product-form-dynamic";
import { Product } from "../types/product";
import { ProductStorage } from "../lib/storage";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadProducts = () => {
      const storedProducts = ProductStorage.getProducts();
      if (storedProducts.length === 0) {
        // Initialize with sample data
        const sampleProducts: Product[] = [
          {
            id: "1",
            name: "Wireless Earbuds Pro",
            sku: "WEP-001",
            marketplace: "amazon",
            category: "Electronics",
            price: 2999,
            costPrice: 1800,
            stock: 45,
            minStock: 10,
            maxStock: 100,
            description: "Premium wireless earbuds with noise cancellation",
            images: [],
            supplier: "TechSupplier Co.",
            weight: 50,
            dimensions: { length: 5, width: 3, height: 2 },
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "2",
            name: "Smart Watch Ultra",
            sku: "SWU-002",
            marketplace: "flipkart",
            category: "Electronics",
            price: 15999,
            costPrice: 12000,
            stock: 12,
            minStock: 5,
            maxStock: 50,
            description: "Advanced smartwatch with health monitoring",
            images: [],
            supplier: "GadgetWorld",
            weight: 80,
            dimensions: { length: 4, width: 4, height: 1 },
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
        ProductStorage.saveProducts(sampleProducts);
        setProducts(sampleProducts);
      } else {
        setProducts(storedProducts);
      }
    };

    loadProducts();
  }, []);

  const handleProductUpdate = () => {
    setProducts(ProductStorage.getProducts());
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      ProductStorage.deleteProduct(id);
      handleProductUpdate();
    }
  };

  const handleSaveProduct = () => {
    setShowForm(false);
    setEditingProduct(null);
    handleProductUpdate();
  };

  const getMarketplaceColor = (marketplace: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-yellow-100 text-yellow-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-red-100 text-red-800",
      "bg-indigo-100 text-indigo-800",
      "bg-orange-100 text-orange-800",
      "bg-teal-100 text-teal-800",
      "bg-cyan-100 text-cyan-800"
    ];
    const index = marketplace.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const calculateStats = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockItems = products.filter(p => p.stock <= p.minStock).length;
    const outOfStockItems = products.filter(p => p.stock === 0).length;
    
    const marketplaceDistribution: Record<string, number> = {};
    products.forEach(product => {
      marketplaceDistribution[product.marketplace] = (marketplaceDistribution[product.marketplace] || 0) + 1;
    });

    return {
      totalProducts,
      totalValue,
      lowStockItems,
      outOfStockItems,
      marketplaceDistribution,
    };
  };

  const stats = calculateStats();
  const uniqueMarketplaces = Object.keys(stats.marketplaceDistribution);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Inventory Management Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your products across any marketplace with dynamic marketplace support
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
            <p className="text-2xl font-bold text-gray-900">₹{stats.totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
            <p className="text-2xl font-bold text-orange-600">{stats.lowStockItems}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Out of Stock</h3>
            <p className="text-2xl font-bold text-red-600">{stats.outOfStockItems}</p>
          </div>
        </div>

        {/* Marketplace Distribution */}
        {uniqueMarketplaces.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Marketplace Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {uniqueMarketplaces.map((mp) => (
                <div key={mp} className="bg-gray-50 p-3 rounded-lg text-center">
                  <h4 className="text-xs font-medium text-gray-500 mb-1 capitalize">{mp}</h4>
                  <p className="text-lg font-bold">{stats.marketplaceDistribution[mp]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <button
            onClick={handleAddProduct}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Add New Product
          </button>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marketplace
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => {
                  const stockStatus = product.stock === 0 ? { text: "Out of Stock", color: "text-red-600" } : 
                                    product.stock <= product.minStock ? { text: "Low Stock", color: "text-orange-600" } : 
                                    { text: "In Stock", color: "text-green-600" };
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMarketplaceColor(product.marketplace)}`}>
                          {product.marketplace}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.stock}</div>
                        <div className={`text-xs ${stockStatus.color}`}>{stockStatus.text}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{(product.price * product.stock).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <ProductFormDynamic
                  product={editingProduct}
                  onSave={handleSaveProduct}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Product } from "../types/product";
import { ProductList } from "./product-list-updated";
import { ProductStorage } from "../lib/storage";
import { ProductForm } from "./product-form-dynamic";

interface InventoryDashboardProps {
  products: Product[];
  onProductUpdate: () => void;
}

export function InventoryDashboard({ products, onProductUpdate }: InventoryDashboardProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [purchaseType, setPurchaseType] = useState<"new" | "return" | null>(null);
  const [marketplaces, setMarketplaces] = useState<string[]>(["amazon", "flipkart", "jiomart"]);

  const calculateStats = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockItems = products.filter(p => p.stock <= p.minStock).length;
    const outOfStockItems = products.filter(p => p.stock === 0).length;
    
    const marketplaceDistribution: Record<string, number> = {};
    products.forEach(product => {
      marketplaceDistribution[product.marketplace] = (marketplaceDistribution[product.marketplace] || 0) + 1;
    });

    const totalPurchased = products.reduce((sum, p) => sum + (p.stock > 0 ? p.stock : 0), 0);

    return {
      totalProducts,
      totalValue,
      lowStockItems,
      outOfStockItems,
      marketplaceDistribution,
      totalPurchased,
    };
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
      onProductUpdate();
    }
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    setShowForm(false);
    setEditingProduct(null);

    if (purchaseType === "new") {
      ProductStorage.addProduct(updatedProduct);
    } else if (purchaseType === "return") {
      const product = products.find(p => p.id === updatedProduct.id);
      if (product) {
        let newStock = product.stock - updatedProduct.stock;
        if (newStock < 0) newStock = 0;
        product.stock = newStock;
        ProductStorage.updateProduct(product.id, product);
      }
    } else {
      // Default add or update
      const product = products.find(p => p.id === updatedProduct.id);
      if (product) {
        ProductStorage.updateProduct(product.id, updatedProduct);
      } else {
        ProductStorage.addProduct(updatedProduct);
      }
    }

    onProductUpdate();
    setPurchaseType(null);
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

  const stats = calculateStats();
  const uniqueMarketplaces = Object.keys(stats.marketplaceDistribution);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Purchased</h3>
          <p className="text-2xl font-bold text-green-600">{stats.totalPurchased || 0}</p>
        </div>
      </div>

      {/* Marketplace Distribution */}
      {uniqueMarketplaces.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
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
      <div className="flex justify-between items-center space-x-4">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <button
          onClick={() => {
            setPurchaseType("new");
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          New Purchase
        </button>
        <button
          onClick={() => {
            setPurchaseType("return");
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Return Product
        </button>
      </div>

      {/* Product List */}
      <ProductList
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

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
              <ProductForm
                product={editingProduct}
                purchaseType={purchaseType}
                onSave={handleSaveProduct}
                onCancel={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                  setPurchaseType(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

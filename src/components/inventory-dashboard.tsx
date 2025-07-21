"use client";

import { useState } from "react";
import { Product, InventoryStats } from "../types/product";
import { ProductList } from "./product-list";
import { ProductForm } from "./product-form-with-photos";
import { ProductStorage } from "../lib/storage";

interface InventoryDashboardProps {
  products: Product[];
  onProductUpdate: () => void;
}

export function InventoryDashboard({ products, onProductUpdate }: InventoryDashboardProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const calculateStats = (): InventoryStats => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockItems = products.filter(p => p.stock <= p.minStock).length;
    const outOfStockItems = products.filter(p => p.stock === 0).length;
    
    const marketplaceDistribution = {
      amazon: products.filter(p => p.marketplace === "amazon").length,
      flipkart: products.filter(p => p.marketplace === "flipkart").length,
      jiomart: products.filter(p => p.marketplace === "jiomart").length,
      meesho: products.filter(p => p.marketplace === "meesho").length,
      nykaa: products.filter(p => p.marketplace === "nykaa").length,
      myntra: products.filter(p => p.marketplace === "myntra").length,
      ajio: products.filter(p => p.marketplace === "ajio").length,
      snapdeal: products.filter(p => p.marketplace === "snapdeal").length,
      shopclues: products.filter(p => p.marketplace === "shopclues").length,
      paytmmall: products.filter(p => p.marketplace === "paytmmall").length,
    };

    return {
      totalProducts,
      totalValue,
      lowStockItems,
      outOfStockItems,
      marketplaceDistribution,
    };
  };

  const stats = calculateStats();

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

  const handleSaveProduct = () => {
    setShowForm(false);
    setEditingProduct(null);
    onProductUpdate();
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h4 className="text-xs font-medium text-gray-500 mb-1">Amazon</h4>
          <p className="text-lg font-bold text-blue-600">{stats.marketplaceDistribution.amazon}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h4 className="text-xs font-medium text-gray-500 mb-1">Flipkart</h4>
          <p className="text-lg font-bold text-yellow-600">{stats.marketplaceDistribution.flipkart}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h4 className="text-xs font-medium text-gray-500 mb-1">JioMart</h4>
          <p className="text-lg font-bold text-green-600">{stats.marketplaceDistribution.jiomart}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h4 className="text-xs font-medium text-gray-500 mb-1">Meesho</h4>
          <p className="text-lg font-bold text-purple-600">{stats.marketplaceDistribution.meesho}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h4 className="text-xs font-medium text-gray-500 mb-1">Nykaa</h4>
          <p className="text-lg font-bold text-pink-600">{stats.marketplaceDistribution.nykaa}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h4 className="text-xs font-medium text-gray-500 mb-1">Myntra</h4>
          <p className="text-lg font-bold text-red-600">{stats.marketplaceDistribution.myntra}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h4 className="text-xs font-medium text-gray-500 mb-1">Ajio</h4>
          <p className="text-lg font-bold text-indigo-600">{stats.marketplaceDistribution.ajio}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h4 className="text-xs font-medium text-gray-500 mb-1">Snapdeal</h4>
          <p className="text-lg font-bold text-orange-600">{stats.marketplaceDistribution.snapdeal}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h4 className="text-xs font-medium text-gray-500 mb-1">Shopclues</h4>
          <p className="text-lg font-bold text-teal-600">{stats.marketplaceDistribution.shopclues}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h4 className="text-xs font-medium text-gray-500 mb-1">Paytm Mall</h4>
          <p className="text-lg font-bold text-cyan-600">{stats.marketplaceDistribution.paytmmall}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <button
          onClick={handleAddProduct}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Add New Product
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
  );
}

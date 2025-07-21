"use client";

import { useState, useEffect } from "react";
import { Product, InventoryStats } from "../types/product";
import { ProductList } from "./product-list-updated";
import { ProductForm } from "./product-form-with-photos";
import { ProductStorage } from "../lib/storage";

interface InventoryDashboardProps {
  products: Product[];
  onProductUpdate: () => void;
}

export function InventoryDashboard({ products, onProductUpdate }: InventoryDashboardProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [marketplaces, setMarketplaces] = useState<string[]>(["amazon", "flipkart", "jiomart"]);
  const [newMarketplace, setNewMarketplace] = useState("");

  const calculateStats = (): InventoryStats => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockItems = products.filter(p => p.stock <= p.minStock).length;
    const outOfStockItems = products.filter(p => p.stock === 0).length;
    
    const marketplaceDistribution: Record<string, number> = {};
    marketplaces.forEach(mp => {
      marketplaceDistribution[mp] = products.filter(p => p.marketplace === mp).length;
    });

    return {
      totalProducts,
      totalValue,
      lowStockItems,
      outOfStockItems,
      marketplaceDistribution,
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

  const handleSaveProduct = () => {
    setShowForm(false);
    setEditingProduct(null);
    onProductUpdate();
  };

  const handleAddMarketplace = () => {
    if (newMarketplace.trim() && !marketplaces.includes(newMarketplace.toLowerCase())) {
      setMarketplaces([...marketplaces, newMarketplace.toLowerCase()]);
      setNewMarketplace("");
    }
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
    const index = marketplaces.indexOf(marketplace) % colors.length;
    return colors[index];
  };

  const stats = calculateStats();

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

      {/* Marketplace Management */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Manage Marketplaces</h3>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newMarketplace}
            onChange={(e) => setNewMarketplace(e.target.value)}
            placeholder="Enter new marketplace name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            onClick={handleAddMarketplace}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add Marketplace
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {marketplaces.map((mp) => (
            <span
              key={mp}
              className={`px-3 py-1 text-sm font-semibold rounded-full ${getMarketplaceColor(mp)}`}
            >
              {mp}
            </span>
          ))}
        </div>
      </div>

      {/* Marketplace Distribution */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {marketplaces.map((mp) => (
          <div key={mp} className="bg-white p-3 rounded-lg shadow text-center">
            <h4 className="text-xs font-medium text-gray-500 mb-1 capitalize">{mp}</h4>
            <p className="text-lg font-bold">{stats.marketplaceDistribution[mp] || 0}</p>
          </div>
        ))}
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
        marketplaces={marketplaces}
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
                marketplaces={marketplaces}
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

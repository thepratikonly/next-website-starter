"use client";

import { useState, useEffect } from "react";
import { Product } from "../types/product";
import { ProductStorage } from "../lib/storage";
import { ImageUpload } from "./image-upload";

interface ProductFormProps {
  product?: Product | null;
  onSave: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    marketplace: "",
    category: "",
    price: 0,
    costPrice: 0,
    stock: 0,
    minStock: 0,
    maxStock: 100,
    description: "",
    supplier: "",
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    images: [] as string[],
  });

  const [marketplaceInput, setMarketplaceInput] = useState("");
  const [existingMarketplaces, setExistingMarketplaces] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        marketplace: product.marketplace,
        category: product.category,
        price: product.price,
        costPrice: product.costPrice,
        stock: product.stock,
        minStock: product.minStock,
        maxStock: product.maxStock,
        description: product.description,
        supplier: product.supplier,
        weight: product.weight,
        dimensions: product.dimensions,
        images: product.images,
      });
      setMarketplaceInput(product.marketplace);
    }

    // Load existing marketplaces from products
    const products = ProductStorage.getProducts();
    const uniqueMarketplaces = [...new Set(products.map(p => p.marketplace))];
    setExistingMarketplaces(uniqueMarketplaces);
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct: Product = {
      id: product?.id || Date.now().toString(),
      ...formData,
      marketplace: marketplaceInput,
      isActive: true,
      createdAt: product?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (product) {
      ProductStorage.updateProduct(product.id, newProduct);
    } else {
      ProductStorage.addProduct(newProduct);
    }

    onSave();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("dimensions.")) {
      const dimensionKey = name.split(".")[1] as keyof typeof formData.dimensions;
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimensionKey]: Number(value),
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === "price" || name === "costPrice" || name === "stock" || name === "minStock" || name === "maxStock" || name === "weight" ? Number(value) : value,
      }));
    }
  };

  const handleMarketplaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMarketplaceInput(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SKU *
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marketplace *
          </label>
          <input
            type="text"
            name="marketplace"
            value={marketplaceInput}
            onChange={handleMarketplaceChange}
            required
            list="marketplaces"
            placeholder="Enter marketplace name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          <datalist id="marketplaces">
            {existingMarketplaces.map((mp) => (
              <option key={mp} value={mp} />
            ))}
          </datalist>
          <p className="text-xs text-gray-500 mt-1">Type any marketplace name or select from existing</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selling Price *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cost Price *
          </label>
          <input
            type="number"
            name="costPrice"
            value={formData.costPrice}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Stock *
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Stock *
          </label>
          <input
            type="number"
            name="minStock"
            value={formData.minStock}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Stock *
          </label>
          <input
            type="number"
            name="maxStock"
            value={formData.maxStock}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supplier
          </label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight (g)
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Length (cm)
          </label>
          <input
            type="number"
            name="dimensions.length"
            value={formData.dimensions.length}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Width (cm)
          </label>
          <input
            type="number"
            name="dimensions.width"
            value={formData.dimensions.width}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Height (cm)
          </label>
          <input
            type="number"
            name="dimensions.height"
            value={formData.dimensions.height}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      <div>
        <ImageUpload
          images={formData.images}
          onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          {product ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
}

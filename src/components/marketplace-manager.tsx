"use client";

import { useState } from "react";

interface MarketplaceManagerProps {
  onClose: () => void;
}

export function MarketplaceManager({ onClose }: MarketplaceManagerProps) {
  const [newMarketplace, setNewMarketplace] = useState("");
  const [marketplaces, setMarketplaces] = useState([
    "amazon", "flipkart", "jiomart", "meesho", "nykaa", 
    "myntra", "ajio", "snapdeal", "shopclues", "paytmmall"
  ]);

  const handleAddMarketplace = () => {
    if (newMarketplace.trim() && !marketplaces.includes(newMarketplace.toLowerCase())) {
      setMarketplaces([...marketplaces, newMarketplace.toLowerCase()]);
      setNewMarketplace("");
    }
  };

  const handleRemoveMarketplace = (marketplace: string) => {
    setMarketplaces(marketplaces.filter(m => m !== marketplace));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Manage Marketplaces</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add New Marketplace
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMarketplace}
                onChange={(e) => setNewMarketplace(e.target.value)}
                placeholder="Enter marketplace name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={handleAddMarketplace}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Marketplaces</h4>
            <div className="space-y-2">
              {marketplaces.map((marketplace) => (
                <div key={marketplace} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm capitalize">{marketplace}</span>
                  <button
                    onClick={() => handleRemoveMarketplace(marketplace)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

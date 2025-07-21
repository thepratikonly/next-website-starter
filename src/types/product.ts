export interface Product {
  id: string;
  name: string;
  sku: string;
  marketplace: 'amazon' | 'flipkart' | 'jiomart' | 'meesho' | 'nykaa' | 'myntra' | 'ajio' | 'snapdeal' | 'shopclues' | 'paytmmall';
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  maxStock: number;
  description: string;
  images: string[];
  supplier: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  marketplaceDistribution: {
    amazon: number;
    flipkart: number;
    jiomart: number;
    meesho: number;
    nykaa: number;
    myntra: number;
    ajio: number;
    snapdeal: number;
    shopclues: number;
    paytmmall: number;
  };
}

export interface ProductFilters {
  marketplace?: string;
  category?: string;
  search?: string;
  lowStock?: boolean;
  outOfStock?: boolean;
}

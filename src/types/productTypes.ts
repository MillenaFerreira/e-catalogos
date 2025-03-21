export type SKU = {
    id: number;
    size: string;
    stock: number;
    open_grid: boolean;
    min_quantity: number;
  };
  
  export type Product = {
    id: number;
    name: string;
    reference: string;
    gender: string;
    category: string;
    subcategory: string | null;
    prompt_delivery: boolean;
    skus: SKU[];
    companies: {
      key: number;
    };
    brand: string;
    price: number;
    colors: string[];
    images: { id: number; order: number; path: string }[];
  };
  
  export type ProductData = {
    products: Product[];
  };
  
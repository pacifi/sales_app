export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  code: string;
  stock: number;
  isActive: boolean;
  category: {
    id: string;
    name: string;
  };
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  code: string;
  stock: number;
  isActive: boolean;
  categoryId: string;
}

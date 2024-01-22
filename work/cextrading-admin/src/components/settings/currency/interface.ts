export interface Currency {
  id: string;
  name: string;
  description: string;
  currency: string;
  imageUrl: string;
  ownerCreated: string;
  status: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCurrency {
  name: string;
  description: string;
  currency: string;
  imageUrl: string;
}
export interface UpdateOrderCurrency {
  id: string;
  order: number;
}

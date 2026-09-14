export type ProductCategory =
  | 'Birthday Cakes'
  | 'Cheesecakes'
  | 'Cupcakes'
  | 'Cookies'
  | 'Pastries'
  | 'Custom Cakes'
  | 'Brownies'
  | 'Special Desserts';

export interface CakeSizeOption {
  size: string; // e.g. "0.5 kg", "1 kg", "1.5 kg", "2 kg", "Box of 4", "Box of 6"
  price: number;
}

export interface Product {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  image: string;
  category: ProductCategory;
  price: number; // Base price
  sizes: CakeSizeOption[];
  flavours: string[];
  ingredients: string[];
  allergens: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  badge?: string; // e.g., "Best Seller", "Chef's Special", "New"
}

export interface CartCustomization {
  size: string;
  flavour?: string;
  customMessage?: string;
  specialInstructions?: string;
}

export interface CartItem {
  id: string; // generated unique cart line ID
  productId: string;
  name: string;
  image: string;
  category: ProductCategory;
  unitPrice: number;
  quantity: number;
  customization: CartCustomization;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'UPI' | 'Online Payment' | 'Cash on Delivery';

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
}

export interface DeliveryAddress {
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string; // e.g. "CNC-84920"
  userId?: string;
  customer: CustomerInfo;
  address: DeliveryAddress;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryDate: string;
  deliveryTimeSlot: string;
  specialInstructions?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId?: string;
  customerName: string;
  avatar?: string;
  productId: string;
  productName: string;
  rating: number; // 1-5
  comment: string;
  image?: string;
  date: string;
  isApproved: boolean;
  isFeatured: boolean;
}

export interface CustomCakeRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  cakeType: string;
  cakeSize: string;
  flavour: string;
  preferredDate: string;
  preferredTime: string;
  theme: string;
  customMessage?: string;
  specialRequirements?: string;
  referenceImage?: string;
  status: 'New' | 'Reviewing' | 'Quoted' | 'In Baking' | 'Completed' | 'Declined';
  estimatedQuote?: number;
  createdAt: string;
}

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  savedAddress?: DeliveryAddress;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

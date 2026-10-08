export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  price: number; // in PKR
  originalPrice?: number; // in PKR
  discountPercent?: number;
  image: string;
  galleryImages: string[];
  category: 'Lawn' | '3-Piece' | '2-Piece' | 'Festive Wear' | 'Formal Wear' | 'Casual Wear' | 'Eid Collection' | 'Embroidered';
  dressType: 'Shalwar Qameez' | '3 Piece Suit' | '2 Piece Suit' | 'Kurti & Dupatta' | 'Peshwas & Trouser';
  fabric: 'Lawn' | 'Chiffon' | 'Cotton' | 'Silk' | 'Khaddar' | 'Organza' | 'Velvet';
  work: 'Embroidery' | 'Tilla & Zardozi' | 'Digital Print' | 'Hand Embellished' | 'Schiffli' | 'Block Print';
  occasion: 'Casual' | 'Formal' | 'Festive' | 'Wedding' | 'Eid';
  color: string;
  colorHex: string;
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL')[];
  description: string;
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewCount: number;
  productCode: string;
  careInstructions?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  orderNotes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: 'COD' | 'Bank Transfer' | 'Online Card';
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orderCount: number;
  totalSpent: number;
  registeredDate: string;
}

export interface CustomerFeedback {
  id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  city: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

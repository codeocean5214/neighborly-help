export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  verified: boolean;
  avatar?: string;
  rating: number;
  totalHelped: number;
  totalRequests: number;
  joinedDate: Date;
  bio?: string;
  googleId?: string;
  preferredLanguage?: string;
  stripeCustomerId?: string;
  stripeAccountId?: string;
  paymentMethods?: PaymentMethod[];
}

export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: Category;
  urgency: 'low' | 'medium' | 'high';
  location: string;
  latitude?: number;
  longitude?: number;
  requesterId: string;
  requester: User;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  offers: HelpOffer[];
  acceptedOffer?: string;
  originalLanguage?: string;
  translations?: Record<string, { title: string; description: string; }>;
  paymentType: 'free' | 'paid' | 'donation';
  suggestedAmount?: number;
  currency?: string;
  paymentRequired?: boolean;
}

export interface HelpOffer {
  id: string;
  requestId: string;
  helperId: string;
  helper: User;
  message: string;
  createdAt: Date;
  status: 'pending' | 'accepted' | 'declined';
  proposedAmount?: number;
  currency?: string;
}

export interface Payment {
  id: string;
  requestId: string;
  payerId: string;
  receiverId: string;
  amount: number;
  currency: string;
  type: 'service' | 'donation' | 'tip';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  createdAt: Date;
  completedAt?: Date;
  description: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  requestId?: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Rating {
  id: string;
  raterId: string;
  ratedUserId: string;
  requestId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export type Category = 'education' | 'errands' | 'donations' | 'skills' | 'elder-care';

export interface Filter {
  category?: Category;
  radius?: number;
  urgency?: 'low' | 'medium' | 'high';
  status?: 'open' | 'in-progress' | 'completed';
  paymentType?: 'free' | 'paid' | 'donation';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}
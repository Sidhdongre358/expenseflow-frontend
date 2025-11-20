
export enum ExpenseCategory {
  Travel = 'Travel',
  Software = 'Software',
  OfficeSupplies = 'Office Supplies',
  Food = 'Food',
  Other = 'Other',
  Marketing = 'Marketing',
  TeamEvents = 'Team Events',
  Training = 'Training'
}

export enum ExpenseStatus {
  Approved = 'Approved',
  Pending = 'Pending',
  Rejected = 'Rejected'
}

export type OrgRole = 'admin' | 'member' | 'viewer';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  billingEmail?: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  currency: CurrencyCode;
  categories?: string[];
}

export interface OrgMember {
  userId: string;
  name: string;
  email: string;
  role: OrgRole;
  avatar: string;
  status: 'active' | 'invited';
  joinedAt: string;
}

export interface Expense {
  id: string;
  orgId: string; // Multi-tenant linkage
  merchant: string;
  date: string;
  category: ExpenseCategory | string;
  amount: number;
  status: ExpenseStatus | string;
  receiptUrl?: string;
  description?: string;
  userId: string; // Who created it
  userName?: string; // Display helper
}

export interface Budget {
  id: number;
  orgId: string; // Multi-tenant linkage
  category: string;
  spent: number;
  total: number;
  period: string;
  icon?: string;
  color?: string;
  bg?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  defaultOrgId?: string;
  role?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

export interface AppNotification {
  id: string;
  orgId: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  read: boolean;
}

export interface Invoice {
    id: string;
    date: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Overdue';
}

export interface PaymentMethod {
    id: string;
    type: 'Visa' | 'Mastercard' | 'Amex';
    last4: string;
    expiry: string;
}

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR' | 'CAD' | 'AUD';

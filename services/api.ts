
import { Budget, Expense, UserProfile, AppNotification, Organization, OrgMember, Invoice, PaymentMethod } from '../types';

// Utility to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Mock Database Structure ---

interface MockDBState {
  organizations: Record<string, Organization>;
  members: Record<string, OrgMember[]>; // orgId -> members[]
  expenses: Record<string, Expense[]>; // orgId -> expenses[]
  budgets: Record<string, Budget[]>; // orgId -> budgets[]
  notifications: Record<string, AppNotification[]>; // orgId -> notifications[]
  invoices: Record<string, Invoice[]>;
  paymentMethods: Record<string, PaymentMethod[]>;
  user: UserProfile;
}

const DB: MockDBState = {
  user: {
    id: 'u1',
    name: 'Eleanor Pena',
    email: 'eleanor@expenseflow.com', // Updated to match default login
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaCW9ApT-LOl3Y8MjK67KDgi0WXUo0Jk8z-KBiyg6UTRhftITBHqdNe5D0rt4OUTA8dyIu5h-YOLx_bDuuoLQ0XW0LVLH7tYWg4isvWm94ysrzeSWIqg-69CY1SlxMjy1LiWnTT0op-2fRJeXbrz86g9f1Bu88bjXdEXwchJwdlqZIBC4frlER-b4Sj3BQG9IgsHxNiCcQeoZ836j0wQtGosHx-A_2nGzBlj332SRGsbCuUQQi7rwaahiasJ8pKBqyiGchQxLZp4s',
    defaultOrgId: 'org1',
    role: 'Finance Manager',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Finance enthusiast looking to streamline operations.'
  },
  organizations: {
    'org1': { 
        id: 'org1', 
        name: 'Acme Corp', 
        slug: 'acme', 
        plan: 'Pro', 
        currency: 'USD', 
        logo: '',
        billingEmail: 'billing@acme.com',
        categories: ['Software', 'Travel', 'Office Supplies', 'Marketing', 'Food']
    },
    'org2': { 
        id: 'org2', 
        name: 'Blueberry Labs', 
        slug: 'blueberry', 
        plan: 'Free', 
        currency: 'EUR', 
        logo: '',
        billingEmail: 'accounts@blueberry.io',
        categories: ['Software', 'Hosting', 'Contractors']
    }
  },
  members: {
    'org1': [
      { userId: 'u1', name: 'Eleanor Pena', email: 'eleanor@expenseflow.com', role: 'admin', status: 'active', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaCW9ApT-LOl3Y8MjK67KDgi0WXUo0Jk8z-KBiyg6UTRhftITBHqdNe5D0rt4OUTA8dyIu5h-YOLx_bDuuoLQ0XW0LVLH7tYWg4isvWm94ysrzeSWIqg-69CY1SlxMjy1LiWnTT0op-2fRJeXbrz86g9f1Bu88bjXdEXwchJwdlqZIBC4frlER-b4Sj3BQG9IgsHxNiCcQeoZ836j0wQtGosHx-A_2nGzBlj332SRGsbCuUQQi7rwaahiasJ8pKBqyiGchQxLZp4s', joinedAt: '2023-01-01' },
      { userId: 'u2', name: 'John Doe', email: 'john@acme.com', role: 'member', status: 'active', avatar: '', joinedAt: '2023-02-15' }
    ],
    'org2': [
      { userId: 'u1', name: 'Eleanor Pena', email: 'eleanor@expenseflow.com', role: 'member', status: 'active', avatar: '', joinedAt: '2023-05-01' }
    ]
  },
  expenses: {
    'org1': [
      { id: '1', orgId: 'org1', date: 'Aug 28, 2024', merchant: 'Figma', category: 'Software', amount: 144.00, status: 'Approved', userId: 'u1', userName: 'Eleanor Pena' },
      { id: '2', orgId: 'org1', date: 'Aug 27, 2024', merchant: 'United Airlines', category: 'Travel', amount: 853.20, status: 'Pending', userId: 'u2', userName: 'John Doe' },
      { id: '3', orgId: 'org1', date: 'Aug 25, 2024', merchant: 'Amazon', category: 'Office Supplies', amount: 78.99, status: 'Rejected', userId: 'u1', userName: 'Eleanor Pena' },
    ],
    'org2': [
       { id: '4', orgId: 'org2', date: 'Aug 22, 2024', merchant: 'Slack', category: 'Software', amount: 25.00, status: 'Approved', userId: 'u1', userName: 'Eleanor Pena' },
    ]
  },
  budgets: {
    'org1': [
      { id: 1, orgId: 'org1', category: 'Software', spent: 5200, total: 8000, icon: 'dns', color: 'text-blue-500', bg: 'bg-blue-500', period: 'Monthly' },
      { id: 2, orgId: 'org1', category: 'Travel', spent: 8400, total: 12000, icon: 'flight', color: 'text-purple-500', bg: 'bg-purple-500', period: 'Monthly' },
    ],
    'org2': [
      { id: 3, orgId: 'org2', category: 'Software', spent: 25, total: 100, icon: 'dns', color: 'text-green-500', bg: 'bg-green-500', period: 'Monthly' },
    ]
  },
  notifications: {
    'org1': [
       { id: '1', orgId: 'org1', title: 'Expense Approved', description: 'Figma Subscription approved.', timestamp: new Date().toISOString(), type: 'success', read: false },
    ],
    'org2': []
  },
  invoices: {
      'org1': [
          { id: 'INV-2023-001', date: 'Oct 01, 2023', amount: 29.00, status: 'Paid' },
          { id: 'INV-2023-002', date: 'Sep 01, 2023', amount: 29.00, status: 'Paid' },
      ]
  },
  paymentMethods: {
      'org1': [
          { id: 'pm_1', type: 'Visa', last4: '4242', expiry: '12/24' }
      ]
  }
};

// --- API Methods ---

export const api = {
  auth: {
    login: async (email: string): Promise<{ token: string, user: UserProfile }> => {
        await delay(800);
        // Simulating checking against the single user in mock DB
        if (email === DB.user.email || email === 'demo@expenseflow.com') {
            return { token: 'mock-jwt-token', user: DB.user };
        }
        throw new Error('Invalid credentials');
    },
    logout: async (): Promise<void> => {
        await delay(300);
    }
  },

  orgs: {
    listMyOrgs: async (): Promise<Organization[]> => {
        await delay(400);
        // Return orgs where user is a member
        const myOrgs = Object.values(DB.organizations).filter(org => 
            DB.members[org.id]?.some(m => m.userId === DB.user.id)
        );
        return myOrgs;
    },
    create: async (name: string, slug: string): Promise<Organization> => {
        await delay(800);
        const id = 'org-' + Math.random().toString(36).substr(2, 9);
        const newOrg: Organization = {
            id,
            name,
            slug,
            plan: 'Free',
            currency: 'USD',
            logo: '',
            categories: ['Software', 'Travel', 'Office Supplies'],
            billingEmail: DB.user.email
        };
        DB.organizations[id] = newOrg;
        // Add creator as admin
        DB.members[id] = [{
            userId: DB.user.id,
            name: DB.user.name,
            email: DB.user.email,
            role: 'admin',
            status: 'active',
            avatar: DB.user.avatar,
            joinedAt: new Date().toISOString()
        }];
        // Initialize empty data
        DB.expenses[id] = [];
        DB.budgets[id] = [];
        DB.notifications[id] = [{
            id: 'welcome',
            orgId: id,
            title: 'Welcome to ' + name,
            description: 'Organization created successfully.',
            type: 'success',
            read: false,
            timestamp: new Date().toISOString()
        }];
        return newOrg;
    },
    getMembers: async (orgId: string): Promise<OrgMember[]> => {
        await delay(300);
        return DB.members[orgId] || [];
    },
    inviteMember: async (orgId: string, email: string, role: string): Promise<OrgMember> => {
        await delay(600);
        const newMember: OrgMember = {
            userId: 'u-' + Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0],
            email,
            role: role as any,
            status: 'invited',
            avatar: '',
            joinedAt: new Date().toISOString()
        };
        if (!DB.members[orgId]) DB.members[orgId] = [];
        DB.members[orgId].push(newMember);
        return newMember;
    },
    removeMember: async (orgId: string, userId: string): Promise<string> => {
        await delay(500);
        if (DB.members[orgId]) {
            DB.members[orgId] = DB.members[orgId].filter(m => m.userId !== userId);
        }
        return userId;
    },
    updateMemberRole: async (orgId: string, userId: string, role: string): Promise<OrgMember> => {
        await delay(400);
        const member = DB.members[orgId]?.find(m => m.userId === userId);
        if (member) {
            member.role = role as any;
            return member;
        }
        throw new Error('Member not found');
    },
    updateSettings: async (orgId: string, updates: Partial<Organization>): Promise<Organization> => {
        await delay(500);
        DB.organizations[orgId] = { ...DB.organizations[orgId], ...updates };
        return DB.organizations[orgId];
    },
    addCategory: async (orgId: string, category: string): Promise<string> => {
        await delay(300);
        const org = DB.organizations[orgId];
        if (org) {
            const cats = org.categories || [];
            if (!cats.includes(category)) {
                org.categories = [...cats, category];
            }
            return category;
        }
        throw new Error("Org not found");
    },
    removeCategory: async (orgId: string, category: string): Promise<string> => {
        await delay(300);
        const org = DB.organizations[orgId];
        if (org && org.categories) {
            org.categories = org.categories.filter(c => c !== category);
            return category;
        }
        return category;
    }
  },
  expenses: {
    list: async (orgId: string): Promise<Expense[]> => {
      await delay(600);
      return [...(DB.expenses[orgId] || [])];
    },
    create: async (orgId: string, expense: Omit<Expense, 'id' | 'orgId' | 'userId'>): Promise<Expense> => {
      await delay(600);
      const newExpense = { 
          ...expense, 
          id: Math.random().toString(36).substr(2, 9),
          orgId,
          userId: DB.user.id,
          userName: DB.user.name 
      };
      if (!DB.expenses[orgId]) DB.expenses[orgId] = [];
      DB.expenses[orgId] = [newExpense, ...DB.expenses[orgId]];
      return newExpense;
    },
    update: async (orgId: string, id: string, updates: Partial<Expense>): Promise<Expense> => {
      await delay(600);
      const list = DB.expenses[orgId];
      const index = list.findIndex(e => e.id === id);
      if (index !== -1) {
          list[index] = { ...list[index], ...updates };
          return list[index];
      }
      throw new Error("Expense not found");
    },
    delete: async (orgId: string, id: string): Promise<string> => {
      await delay(600);
      DB.expenses[orgId] = (DB.expenses[orgId] || []).filter(e => e.id !== id);
      return id;
    }
  },

  budgets: {
    list: async (orgId: string): Promise<Budget[]> => {
      await delay(600);
      return [...(DB.budgets[orgId] || [])];
    },
    create: async (orgId: string, budget: Omit<Budget, 'id' | 'orgId'>): Promise<Budget> => {
      await delay(600);
      const newBudget = { ...budget, id: Math.floor(Math.random() * 10000), orgId };
      if (!DB.budgets[orgId]) DB.budgets[orgId] = [];
      DB.budgets[orgId].push(newBudget);
      return newBudget;
    },
    update: async (orgId: string, id: number, updates: Partial<Budget>): Promise<Budget> => {
      await delay(600);
      const list = DB.budgets[orgId];
      const index = list.findIndex(b => b.id === id);
      if (index !== -1) {
          list[index] = { ...list[index], ...updates };
          return list[index];
      }
      throw new Error("Budget not found");
    },
    delete: async (orgId: string, id: number): Promise<number> => {
      await delay(600);
      DB.budgets[orgId] = (DB.budgets[orgId] || []).filter(b => b.id !== id);
      return id;
    }
  },

  user: {
    get: async (): Promise<UserProfile> => {
      await delay(400);
      return { ...DB.user };
    },
    update: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
      await delay(800);
      DB.user = { ...DB.user, ...updates };
      return DB.user;
    }
  },

  notifications: {
    list: async (orgId: string): Promise<AppNotification[]> => {
      await delay(400);
      return [...(DB.notifications[orgId] || [])];
    },
    markRead: async (orgId: string, id: string): Promise<string> => {
      await delay(200);
      const list = DB.notifications[orgId] || [];
      const index = list.findIndex(n => n.id === id);
      if (index !== -1) list[index].read = true;
      return id;
    },
    markAllRead: async (orgId: string): Promise<boolean> => {
      await delay(500);
      if (DB.notifications[orgId]) {
          DB.notifications[orgId].forEach(n => n.read = true);
      }
      return true;
    }
  },
  
  billing: {
      getInvoices: async (orgId: string): Promise<Invoice[]> => {
          await delay(500);
          return DB.invoices[orgId] || [];
      },
      getPaymentMethods: async (orgId: string): Promise<PaymentMethod[]> => {
          await delay(400);
          return DB.paymentMethods[orgId] || [];
      }
  }
};

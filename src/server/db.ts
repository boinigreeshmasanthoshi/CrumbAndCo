import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Product, Review, Order, CustomCakeRequest, User } from '../types.js';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_ORDERS } from '../data/initialData.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'bakery-store.json');

export interface StoredUser extends User {
  passwordHash: string;
  salt: string;
}

export interface BakeryDatabase {
  users: StoredUser[];
  products: Product[];
  orders: Order[];
  reviews: Review[];
  customCakes: CustomCakeRequest[];
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return testHash === hash;
}

// In-memory working cache
let dbCache: BakeryDatabase | null = null;

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getInitialDatabase(): BakeryDatabase {
  const adminCredentials = hashPassword('admin123');
  const customerCredentials = hashPassword('sweet123');

  const defaultUsers: StoredUser[] = [
    {
      id: 'usr-admin-1',
      name: 'Eleanor Vance (Owner)',
      email: 'admin@crumbandco.com',
      phone: '+91 98888 12345',
      role: 'admin',
      createdAt: '2026-01-01T00:00:00.000Z',
      passwordHash: adminCredentials.hash,
      salt: adminCredentials.salt,
    },
    {
      id: 'usr-cust-1',
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '+91 98201 44521',
      role: 'customer',
      savedAddress: {
        houseFlat: 'Apt 402, Lotus Orchid',
        street: '14th Cross, Indiranagar',
        area: 'Indiranagar 1st Stage',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038'
      },
      createdAt: '2026-08-15T00:00:00.000Z',
      passwordHash: customerCredentials.hash,
      salt: customerCredentials.salt,
    }
  ];

  const defaultCustomCakes: CustomCakeRequest[] = [
    {
      id: 'CC-101',
      name: 'Maya Sengupta',
      phone: '+91 98450 11223',
      email: 'maya.s@example.com',
      cakeType: 'Tiered Vintage Lambeth Birthday Cake',
      cakeSize: '2.5 kg (2-Tier)',
      flavour: 'Raspberry Champagne & White Truffle',
      preferredDate: '2026-09-20',
      preferredTime: '15:00',
      theme: 'Pastel Lavender & Soft Peaches with edible pearls and ribbon ruffles',
      customMessage: 'Celebrating 30 years of Maya ✨',
      specialRequirements: '100% Eggless, low sugar Swiss buttercream',
      referenceImage: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80',
      status: 'Quoted',
      estimatedQuote: 3200,
      createdAt: '2026-09-13T10:00:00.000Z'
    }
  ];

  return {
    users: defaultUsers,
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
    reviews: INITIAL_REVIEWS,
    customCakes: defaultCustomCakes
  };
}

export function loadDatabase(): BakeryDatabase {
  if (dbCache) return dbCache;

  ensureDataDirectory();
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(data);
      if (dbCache) {
        // Ensure all collections exist
        if (!dbCache.users) dbCache.users = [];
        if (!dbCache.products) dbCache.products = INITIAL_PRODUCTS;
        if (!dbCache.orders) dbCache.orders = INITIAL_ORDERS;
        if (!dbCache.reviews) dbCache.reviews = INITIAL_REVIEWS;
        if (!dbCache.customCakes) dbCache.customCakes = [];
        return dbCache;
      }
    }
  } catch (err) {
    console.error('Error reading database file, resetting to initial seed:', err);
  }

  dbCache = getInitialDatabase();
  saveDatabase(dbCache);
  return dbCache;
}

export function saveDatabase(data?: BakeryDatabase): void {
  ensureDataDirectory();
  const dbToSave = data || dbCache;
  if (!dbToSave) return;
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(dbToSave, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to persist database file:', err);
  }
}

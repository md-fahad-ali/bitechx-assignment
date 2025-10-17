import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeStore = {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useThemePref = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-preference',
    }
  )
)

// Products store for simple state management
type Product = {
  id: string;
  name: string;
  description: string;
  slug: string;
  images: string[];
  price: number;
  categoryId: string;
  category?: { id: string; name: string };
}

type Category = { id: string; name: string }

type ProductsStore = {
  products: Product[]
  categories: Category[]
  loading: boolean
  setProducts: (products: Product[]) => void
  setCategories: (categories: Category[]) => void
  setLoading: (loading: boolean) => void
  addProduct: (product: Product) => void
  updateProduct: (product: Product) => void
  removeProduct: (id: string) => void
}

export const useProductsStore = create<ProductsStore>((set) => ({
  products: [],
  categories: [],
  loading: false,
  setProducts: (products) => set({ products }),
  setCategories: (categories) => set({ categories }),
  setLoading: (loading) => set({ loading }),
  addProduct: (product) => set((state) => ({ 
    products: [...state.products, product] 
  })),
  updateProduct: (product) => set((state) => ({ 
    products: state.products.map(p => p.id === product.id ? product : p) 
  })),
  removeProduct: (id) => set((state) => ({ 
    products: state.products.filter(p => p.id !== id) 
  })),
}));

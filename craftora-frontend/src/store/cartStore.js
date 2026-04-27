import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, quantity = 1, customDetails = null) => {
        set((state) => {
          const existing = state.items.find((i) => i._id === product._id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i._id === product._id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                _id: product._id,
                title: product.title,
                price: product.discountPrice || product.price,
                image: product.images?.[0]?.url || '',
                stock: product.stock,
                seller: product.seller,
                quantity,
                isCustomOrder: !!customDetails,
                customDetails,
              },
            ],
          };
        });
      },

      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i._id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity < 1) { get().removeItem(id); return; }
        set((s) => ({
          items: s.items.map((i) => (i._id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),

      // Computed values
      get totalItems() { return get().items.reduce((s, i) => s + i.quantity, 0); },
      get subtotal()   { return get().items.reduce((s, i) => s + i.price * i.quantity, 0); },
      get shippingCost() { const sub = get().subtotal; return sub === 0 ? 0 : sub > 1000 ? 0 : 99; },
      get tax()  { return Math.round(get().subtotal * 0.18 * 100) / 100; },
      get total(){ return get().subtotal + get().shippingCost + get().tax; },
    }),
    {
      name: 'craftora_cart',
      partialize: (s) => ({ items: s.items }),
    }
  )
);

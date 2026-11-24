import { z } from "zod";

export const CART_KEY = "birthday-wishlist-cart-v1";
export const CART_CHANGE_EVENT = "birthday-wishlist-cart-change";
const cartItemSchema = z.object({ id: z.string(), giftId: z.string(), title: z.string(), imageUrl: z.string().optional(), quantity: z.number().int().positive(), maxQuantity: z.number().int().positive(), availability: z.enum(["available", "limited", "planned"]), selections: z.record(z.string(), z.string()), customizations: z.record(z.string(), z.string()) });
const cartSchema = z.array(cartItemSchema);
export type CartItem = z.infer<typeof cartItemSchema>;
export type CartItemInput = Omit<CartItem, "id">;

export function parseCart(value: string): CartItem[] {
  try { const parsed = cartSchema.safeParse(JSON.parse(value)); return parsed.success ? parsed.data : []; }
  catch { return []; }
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  return parseCart(localStorage.getItem(CART_KEY) ?? "[]");
}
function writeCart(items: CartItem[]) { localStorage.setItem(CART_KEY, JSON.stringify(items)); window.dispatchEvent(new Event(CART_CHANGE_EVENT)); return items; }
function canonical(record: Record<string, string>) { return JSON.stringify(Object.entries(record).sort(([a], [b]) => a.localeCompare(b))); }
function sameConfiguration(a: CartItem, b: CartItemInput) { return a.giftId === b.giftId && canonical(a.selections) === canonical(b.selections) && canonical(a.customizations) === canonical(b.customizations); }
export function addCartItem(input: CartItemInput) {
  const items = readCart();
  const currentTotal = items.filter((item) => item.giftId === input.giftId).reduce((total, item) => total + item.quantity, 0);
  const added = Math.min(input.quantity, Math.max(0, input.maxQuantity - currentTotal));
  if (!added) return { items, added };
  const existing = items.find((item) => sameConfiguration(item, input));
  if (existing) existing.quantity += added;
  else items.push({ ...input, quantity: added, id: globalThis.crypto?.randomUUID?.() ?? `${input.giftId}-${Date.now()}` });
  return { items: writeCart(items), added };
}
export function updateCartQuantity(id: string, quantity: number) {
  const items = readCart();
  const target = items.find((item) => item.id === id);
  if (!target) return items;
  const otherQuantity = items.filter((item) => item.giftId === target.giftId && item.id !== id).reduce((total, item) => total + item.quantity, 0);
  target.quantity = Math.max(1, Math.min(target.maxQuantity - otherQuantity, quantity));
  return writeCart(items);
}
export function removeCartItem(id: string) { return writeCart(readCart().filter((item) => item.id !== id)); }
export function clearCart() { return writeCart([]); }
export function subscribeToCart(onChange: () => void) { window.addEventListener("storage", onChange); window.addEventListener(CART_CHANGE_EVENT, onChange); return () => { window.removeEventListener("storage", onChange); window.removeEventListener(CART_CHANGE_EVENT, onChange); }; }

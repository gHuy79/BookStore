// lib/cart.ts
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { CartItem } from '@/types/order';

export async function addToCart(userId: string, item: CartItem) {
  const ref = doc(db, 'users', userId, 'cart', item.bookId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const existing = snap.data() as CartItem;
    await updateDoc(ref, { quantity: existing.quantity + item.quantity });
  } else {
    await setDoc(ref, item);
  }
}

export async function getCartItems(userId: string): Promise<CartItem[]> {
  const snap = await getDocs(collection(db, 'users', userId, 'cart'));
  return snap.docs.map(doc => doc.data() as CartItem);
}

export async function clearCart(userId: string) {
  const snap = await getDocs(collection(db, 'users', userId, 'cart'));
  const promises = snap.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(promises);
}

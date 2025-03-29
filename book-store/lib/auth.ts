import {
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider
  } from 'firebase/auth';
  import { auth } from './firebase';
  import { FirebaseError } from 'firebase/app'; // ✅ THÊM DÒNG NÀY
  
  export async function loginWithEmail(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      const firebaseError = error as FirebaseError; // ✅ Chuyển kiểu rõ ràng
      throw new Error(firebaseError.message);
    }
  }
  
  export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      const firebaseError = error as FirebaseError; // ✅ Chuyển kiểu rõ ràng
      throw new Error(firebaseError.message);
    }
  }
  
  export async function logout() {
    await signOut(auth);
  }
  
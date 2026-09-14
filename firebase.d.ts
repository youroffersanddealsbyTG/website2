declare module '@firebase/app';
declare module '@firebase/auth' {
  export interface User {
    uid: string;
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
    phoneNumber?: string | null;
  }
  export function getAuth(app?: any): any;
  export function onAuthStateChanged(auth: any, callback: (user: User | null) => void): () => void;
  export function signInWithPopup(auth: any, provider: any): Promise<any>;
  export function signInWithEmailAndPassword(auth: any, email: string, pass: string): Promise<any>;
  export function createUserWithEmailAndPassword(auth: any, email: string, pass: string): Promise<any>;
  export function signOut(auth: any): Promise<void>;
  export class GoogleAuthProvider {}
}
declare module '@firebase/firestore';
declare module '@firebase/analytics';

declare module 'firebase/app';
declare module 'firebase/auth' {
  export interface User {
    uid: string;
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
    phoneNumber?: string | null;
  }
}
declare module 'firebase/firestore';
declare module 'firebase/analytics';




// src/services/firebase/FirebaseService.ts
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { 
  getFirestore, 
  collection, 
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  DocumentData,
  QueryConstraint,
  WithFieldValue,
  DocumentReference
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';

/**
 * Firebase configuration object
 */
const firebaseConfig = {
  apiKey: "AIzaSyAp2LEL7nqRmpmXXLaeyv0kB8FC0jrRuQw",
  authDomain: "dndrecap-e3913.firebaseapp.com",
  projectId: "dndrecap-e3913",
  storageBucket: "dndrecap-e3913.firebasestorage.app",
  messagingSenderId: "392483147732",
  appId: "1:392483147732:web:ad1c51052c6c122040d041",
  measurementId: "G-PXN0WPT4YD"
};

/**
 * FirebaseService class provides a centralized way to interact with Firebase services
 */
class FirebaseService {
  private static instance: FirebaseService;
  private app;
  private analytics;
  private db;
  private auth;

  private constructor() {
    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }

  public getAuth() {
    return this.auth;
  }

  /**
   * Get singleton instance of FirebaseService
   */
  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  /**
   * Get the current authenticated user
   */
  public getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Sign in with email and password
   */
  public async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    return userCredential.user;
  }

  /**
   * Create a new user account
   */
  public async signUp(email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    return userCredential.user;
  }

  /**
   * Sign out the current user
   */
  public async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  /**
   * Create or update a document in a collection
   */
  public async setDocument<T extends DocumentData>(
    collectionName: string,
    documentId: string,
    data: WithFieldValue<T>
  ): Promise<void> {
    const docRef = doc(this.db, collectionName, documentId) as DocumentReference<T>;
    await setDoc(docRef, data as DocumentData);
  }

  /**
   * Update specific fields in a document
   */
  public async updateDocument<T extends DocumentData>(
    collectionName: string,
    documentId: string,
    data: Partial<WithFieldValue<T>>
  ): Promise<void> {
    const docRef = doc(this.db, collectionName, documentId) as DocumentReference<T>;
    await updateDoc(docRef, data as Partial<DocumentData>);
  }

  /**
   * Get a document by ID
   */
  public async getDocument<T>(
    collectionName: string,
    documentId: string
  ): Promise<T | null> {
    const docRef = doc(this.db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as T) : null;
  }

  /**
   * Get all documents in a collection
   */
  public async getCollection<T>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    const collectionRef = collection(this.db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as T));
  }

  /**
   * Delete a document
   */
  public async deleteDocument(
    collectionName: string,
    documentId: string
  ): Promise<void> {
    const docRef = doc(this.db, collectionName, documentId);
    await deleteDoc(docRef);
  }

  /**
   * Query documents in a collection
   */
  public async queryDocuments<T>(
    collectionName: string,
    field: string,
    operator: '==' | '!=' | '>' | '<' | '>=' | '<=',
    value: any
  ): Promise<T[]> {
    const collectionRef = collection(this.db, collectionName);
    const q = query(collectionRef, where(field, operator, value));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as T));
  }
}

export default FirebaseService;
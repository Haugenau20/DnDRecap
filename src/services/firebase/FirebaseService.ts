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
  DocumentReference,
  runTransaction,
  serverTimestamp, 
  writeBatch
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import { PlayerProfile, UsernameDocument, UsernameValidationResult, AllowedUser } from '../../types/user';

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
   * Check if an email is allowed to register
   */
  public async isEmailAllowed(email: string): Promise<boolean> {
    try {
      const q = query(
        collection(this.db, 'allowedUsers'),
        where('email', '==', email.toLowerCase())
      );
      
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (err) {
      console.error('Error checking allowed email:', err);
      return false;
    }
  }

  /**
   * Sign in with email and password
   */
  public async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      
      // Update last login date
      const userDoc = doc(this.db, 'users', userCredential.user.uid);
      await updateDoc(userDoc, {
        lastLogin: new Date()
      });
      
      return userCredential.user;
    } catch (error) {
      // Make sure this only catches actual authentication errors
      console.error("Sign in error:", error);
      throw error;
    }
  }

  /**
   * Create a new user account with username
   */
  public async signUp(email: string, password: string, username: string): Promise<User> {
    // First, check if email is allowed to register
    const isAllowed = await this.isEmailAllowed(email);
    if (!isAllowed) {
      throw new Error('This email is not authorized to create an account. Please contact your administrator.');
    }
    
    // Then, validate the username
    const validation = await this.validateUsername(username);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    if (!validation.isAvailable) {
      throw new Error('Username is already taken');
    }

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Create user profile and reserve username in a transaction
      await this.createPlayerProfile(user.uid, email, username);
      
      // Update the allowed user record to mark as registered
      await this.markUserAsRegistered(email);
      
      return user;
    } catch (error) {
      // If any step fails, clean up and throw
      throw error;
    }
  }

  /**
 * Completely removes a user from the system including:
 * - Removing from allowed users list
 * - Removing user data from 'users' collection
 * - Removing username reservation from 'usernames' collection
 * 
 * @param email Email of the user to remove
 */
public async removeUserCompletely(email: string): Promise<void> {
  const lowercaseEmail = email.toLowerCase();
  
  try {
    // Get the user document by querying for this email
    const usersQuery = query(
      collection(this.db, 'users'), 
      where('email', '==', lowercaseEmail)
    );
    
    const userSnapshots = await getDocs(usersQuery);
    
    if (!userSnapshots.empty) {
      // If we found a user, get their data and start batch delete operation
      const userDoc = userSnapshots.docs[0];
      const userData = userDoc.data() as PlayerProfile;
      const uid = userDoc.id;
      
      // Start a batch for atomic operations
      const batch = writeBatch(this.db);
      
      // Delete username reservation
      if (userData.username) {
        const usernameDoc = doc(this.db, 'usernames', userData.username.toLowerCase());
        batch.delete(usernameDoc);
      }
      
      // Delete user profile
      batch.delete(doc(this.db, 'users', uid));
      
      // Delete from allowed users
      batch.delete(doc(this.db, 'allowedUsers', lowercaseEmail));
      
      // Commit all the deletions
      await batch.commit();
    } else {
      // If no user exists, just remove from allowed users
      await this.removeAllowedUser(email);
    }
  } catch (error) {
    console.error("Error removing user completely:", error);
    throw error;
  }
}

  /**
   * Mark an allowed user as registered
   */
  private async markUserAsRegistered(email: string): Promise<void> {
    const q = query(
      collection(this.db, 'allowedUsers'),
      where('email', '==', email.toLowerCase())
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        hasRegistered: true,
        registeredAt: new Date()
      });
    }
  }

  /**
   * Add a user to the allowed users list (admin only)
   */
  public async addAllowedUser(email: string, notes: string = '', adminUid: string): Promise<void> {
    // Create a document with email as the ID
    const docId = email.toLowerCase();
    const allowedUserRef = doc(this.db, 'allowedUsers', docId);
    
    const allowedUser: AllowedUser = {
      email: email.toLowerCase(),
      notes,
      addedAt: new Date(),
      addedBy: adminUid,
      hasRegistered: false
    };
    
    await setDoc(allowedUserRef, allowedUser);
  }

  /**
   * Remove a user from the allowed users list (admin only)
   */
  public async removeAllowedUser(email: string): Promise<void> {
    const docId = email.toLowerCase();
    await deleteDoc(doc(this.db, 'allowedUsers', docId));
  }

  /**
   * Get all allowed users (admin only)
   */
  public async getAllowedUsers(): Promise<AllowedUser[]> {
    const allowedUsersCollection = collection(this.db, 'allowedUsers');
    const snapshot = await getDocs(allowedUsersCollection);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      
      // Convert Firestore Timestamp to JavaScript Date
      return {
        ...data,
        addedAt: data.addedAt && typeof data.addedAt.toDate === 'function' 
          ? data.addedAt.toDate() 
          : data.addedAt,
        registeredAt: data.registeredAt && typeof data.registeredAt.toDate === 'function' 
          ? data.registeredAt.toDate() 
          : data.registeredAt
      } as AllowedUser;
    });
  }

  /**
   * Creates player profile and reserves username in a transaction
   */
  private async createPlayerProfile(uid: string, email: string, username: string): Promise<void> {
    const usernameLower = username.toLowerCase();
    const usernameDoc = doc(this.db, 'usernames', usernameLower);
    const userDoc = doc(this.db, 'users', uid);
    
    return runTransaction(this.db, async (transaction) => {
      // Check if username is already taken
      const usernameSnapshot = await transaction.get(usernameDoc);
      if (usernameSnapshot.exists()) {
        throw new Error('Username already taken');
      }
      
      const now = new Date();
      
      // Create username reservation
      transaction.set(usernameDoc, {
        uid: uid,
        originalUsername: username, // Preserve case for display
        createdAt: now
      });
      
      // Create player profile
      transaction.set(userDoc, {
        email: email,
        username: username,
        dateCreated: now,
        lastLogin: now,
        isAdmin: false,
        preferences: {
          theme: 'default'
        }
      });
    });
  }

  /**
   * Get player profile by UID
   */
  public async getPlayerProfile(uid: string): Promise<PlayerProfile | null> {
    const userDoc = await getDoc(doc(this.db, 'users', uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as PlayerProfile;
    }
    
    return null;
  }

  /**
   * Change a player's username
   */
  public async changeUsername(uid: string, newUsername: string): Promise<void> {
    // Validate the new username
    const validation = await this.validateUsername(newUsername);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    if (!validation.isAvailable) {
      throw new Error('Username is already taken');
    }

    // Get current username to delete after successful change
    const userDoc = await getDoc(doc(this.db, 'users', uid));
    if (!userDoc.exists()) {
      throw new Error('Player profile not found');
    }
    
    const userData = userDoc.data() as PlayerProfile;
    const currentUsername = userData.username;
    const currentUsernameLower = currentUsername.toLowerCase();
    
    // Don't proceed if username isn't actually changing (case-insensitive check)
    const newUsernameLower = newUsername.toLowerCase();
    if (newUsernameLower === currentUsernameLower) {
      return;
    }
    
    const newUsernameDoc = doc(this.db, 'usernames', newUsernameLower);
    const currentUsernameDoc = doc(this.db, 'usernames', currentUsernameLower);
    const userDocRef = doc(this.db, 'users', uid);
    
    // Execute as a transaction to prevent race conditions
    return runTransaction(this.db, async (transaction) => {
      // Check if new username is already taken
      const newUsernameSnapshot = await transaction.get(newUsernameDoc);
      if (newUsernameSnapshot.exists()) {
        throw new Error('Username already taken');
      }
      
      // Create new username reservation
      transaction.set(newUsernameDoc, {
        uid: uid,
        originalUsername: newUsername,
        createdAt: new Date()
      });
      
      // Update player profile
      transaction.update(userDocRef, {
        username: newUsername
      });
      
      // Delete old username reservation
      transaction.delete(currentUsernameDoc);
    });
  }

  /**
   * Check if a username is available
   */
  public async isUsernameAvailable(username: string): Promise<boolean> {
    const usernameLower = username.toLowerCase();
    const usernameDoc = await getDoc(doc(this.db, 'usernames', usernameLower));
    return !usernameDoc.exists();
  }

  /**
   * Validate username format and availability
   */
  public async validateUsername(username: string): Promise<UsernameValidationResult> {
    // Check username format
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return {
        isValid: false,
        error: 'Username must be 3-20 characters and can only contain letters, numbers, underscores, and hyphens'
      };
    }
    
    // Check availability
    const isAvailable = await this.isUsernameAvailable(username);
    
    return {
      isValid: true,
      isAvailable
    };
  }

  /**
   * Find a user by username
   */
  public async findUserByUsername(username: string): Promise<string | null> {
    const usernameLower = username.toLowerCase();
    const usernameDoc = await getDoc(doc(this.db, 'usernames', usernameLower));
    
    if (usernameDoc.exists()) {
      const data = usernameDoc.data() as UsernameDocument;
      return data.uid;
    }
    
    return null;
  }

  /**
   * Check if a user is an admin
   */
  public async isUserAdmin(uid: string): Promise<boolean> {
    const profileData = await this.getPlayerProfile(uid);
    return !!profileData?.isAdmin;
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
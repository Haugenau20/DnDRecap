// src/services/firebase/FirebaseService.ts
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { httpsCallable, getFunctions } from 'firebase/functions';
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
   * Sign up with an invite token and user-provided email
   */
  public async signUpWithToken(token: string, email: string, password: string, username: string): Promise<User> {
    // First, validate the token
    const isValid = await this.isTokenValid(token);
    if (!isValid) {
      throw new Error('Invalid or expired invitation token');
    }
    
    // Validate the username
    const validation = await this.validateUsername(username);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    if (!validation.isAvailable) {
      throw new Error('Username is already taken');
    }

    try {
      // Create Firebase Auth user first (outside the transaction)
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Use a transaction for Firestore operations
      await runTransaction(this.db, async (transaction) => {
        // PERFORM ALL READS FIRST
        const tokenDocRef = doc(this.db, 'registrationTokens', token);
        const tokenSnapshot = await transaction.get(tokenDocRef);
        
        const usernameLower = username.toLowerCase();
        const usernameDoc = doc(this.db, 'usernames', usernameLower);
        const usernameSnapshot = await transaction.get(usernameDoc);
        
        // Validate reads before doing any writes
        if (!tokenSnapshot.exists()) {
          throw new Error('Token does not exist');
        }
        
        const tokenData = tokenSnapshot.data();
        if (tokenData?.used === true) {
          throw new Error('Token has already been used');
        }
        
        if (usernameSnapshot.exists()) {
          throw new Error('Username already taken');
        }
        
        // THEN PERFORM ALL WRITES
        const now = new Date();
        const userDocRef = doc(this.db, 'users', user.uid);
        
        // Create user profile
        transaction.set(userDocRef, {
          email: email,
          username: username,
          dateCreated: now,
          lastLogin: now,
          isAdmin: false,
          preferences: {
            theme: 'default'
          }
        });
        
        // Create username reservation
        transaction.set(usernameDoc, {
          uid: user.uid,
          originalUsername: username, // Preserve case for display
          createdAt: now
        });
        
        // Mark the token as used
        transaction.update(tokenDocRef, {
          used: true,
          usedAt: now,
          usedBy: user.uid
        });
      });
      
      return user;
    } catch (error) {
      // If transaction fails, try to delete the auth user to avoid orphaned accounts
      try {
        const currentUser = this.auth.currentUser;
        if (currentUser) {
          await currentUser.delete();
        }
      } catch (deleteError) {
        console.error("Error cleaning up auth user after failed transaction:", deleteError);
      }
      
      throw error;
    }
  }
  
  /**
   * Mark an allowed user as registered
   */
  private async markUserAsRegistered(email: string, username: string, uid: string): Promise<void> {
    const q = query(
      collection(this.db, 'allowedUsers'),
      where('email', '==', email.toLowerCase())
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        hasRegistered: true,
        registeredAt: new Date(),
        username: username,
        userId: uid
      });
    }
  }

  /**
   * Generate a secure random token
   */
  private generateInviteToken(): string {
    // Generate a random 16-byte token and convert to hex
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Generate a registration token (admin only)
   * Now completely decoupled from email addresses
   */
  public async generateRegistrationToken(notes: string = '', adminUid: string): Promise<string> {
    // Generate a unique invite token
    const inviteToken = this.generateInviteToken();
    
    // Create the public token document (readable by anyone)
    const tokenDoc = {
      createdAt: new Date(),
      createdBy: adminUid,
      notes: notes, // Optional notes about this token
      used: false
    };
    
    // Store in the public collection
    await setDoc(doc(this.db, 'registrationTokens', inviteToken), tokenDoc);
    
    return inviteToken;
  }

  /**
   * Get all registration tokens (admin only)
   */
  public async getRegistrationTokens(): Promise<any[]> {
    try {
      const tokensCollection = collection(this.db, 'registrationTokens');
      const snapshot = await getDocs(tokensCollection);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Convert Firestore Timestamp to JavaScript Date
        return {
          token: doc.id,
          ...data,
          createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' 
            ? data.createdAt.toDate() 
            : data.createdAt,
          usedAt: data.usedAt && typeof data.usedAt.toDate === 'function' 
            ? data.usedAt.toDate() 
            : data.usedAt
        };
      });
    } catch (err) {
      console.error('Error fetching registration tokens:', err);
      throw err;
    }
  }

  /**
   * Delete a registration token (admin only)
   */
  public async deleteRegistrationToken(token: string): Promise<void> {
    await deleteDoc(doc(this.db, 'registrationTokens', token));
  }

  /**
   * Add a user to the allowed users list with an invite token (admin only)
   */
  public async addAllowedUser(email: string, notes: string = '', adminUid: string): Promise<string> {
    // Create a document with email as the ID
    const docId = email.toLowerCase();
    const allowedUserRef = doc(this.db, 'allowedUsers', docId);
    
    // Generate a unique invite token
    const inviteToken = this.generateInviteToken();
    
    // Create a transaction to ensure both documents are created atomically
    await runTransaction(this.db, async (transaction) => {
      // Create the allowedUser document (admin only access)
      const allowedUser: AllowedUser = {
        email: email.toLowerCase(),
        notes,
        addedAt: new Date(),
        addedBy: adminUid,
        hasRegistered: false,
        inviteToken // Store token reference for admin use
      };
      
      // Create the public token document (readable by anyone)
      const tokenDoc = {
        createdAt: new Date(),
        used: false
      };
      
      transaction.set(allowedUserRef, allowedUser);
      transaction.set(doc(this.db, 'registrationTokens', inviteToken), tokenDoc);
    });
    
    return inviteToken;
  }

  /**
   * Check if an invite token is valid for registration
   * No longer tries to look up emails
   */
  public async isTokenValid(token: string): Promise<boolean> {
    try {
      // Check if the token exists in the public collection
      const tokenDocRef = doc(this.db, 'registrationTokens', token);
      const tokenSnapshot = await getDoc(tokenDocRef);
      
      if (!tokenSnapshot.exists()) {
        return false;
      }
      
      const tokenData = tokenSnapshot.data();
      // Token is valid if it exists and hasn't been used yet
      return tokenData.used !== true;
    } catch (err) {
      console.error('Error validating token:', err);
      return false;
    }
  }

  /**
   * Get all users (admin only)
   * Returns user data without email addresses
   */
  public async getAllUsers(): Promise<any[]> {
    try {
      const usersCollection = collection(this.db, 'users');
      const snapshot = await getDocs(usersCollection);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Important: Remove email field for privacy
        const { email, ...safeUserData } = data;
        
        // Convert Firestore Timestamp to JavaScript Date
        return {
          id: doc.id,
          ...safeUserData,
          dateCreated: data.dateCreated && typeof data.dateCreated.toDate === 'function' 
            ? data.dateCreated.toDate() 
            : data.dateCreated,
          lastLogin: data.lastLogin && typeof data.lastLogin.toDate === 'function' 
            ? data.lastLogin.toDate() 
            : data.lastLogin
        };
      });
    } catch (err) {
      console.error('Error fetching users:', err);
      throw err;
    }
  }

  /**
   * Delete a user from both Firestore and Firebase Authentication (admin only)
   */
  public async deleteUser(userId: string): Promise<void> {
    try {
      // 1. First delete the user data from Firestore
      const userDoc = await getDoc(doc(this.db, 'users', userId));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userDoc.data();
      const username = userData.username;
      
      // Start a batch operation for Firestore deletion
      const batch = writeBatch(this.db);
      
      // Delete user document
      batch.delete(doc(this.db, 'users', userId));
      
      // Delete username reservation if it exists
      if (username) {
        batch.delete(doc(this.db, 'usernames', username.toLowerCase()));
      }
      
      // Commit the Firestore batch
      await batch.commit();
      
      // 2. Now delete from Firebase Authentication using the cloud function
      const functions = getFunctions();
      const deleteUserFunction = httpsCallable(functions, 'deleteUser');
      await deleteUserFunction({ userId });
      
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
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
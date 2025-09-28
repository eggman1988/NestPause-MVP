import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  onSnapshot,
  Unsubscribe,
  DocumentData,
  QueryConstraint,
  DocumentSnapshot,
  QuerySnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { ApiResponse, AppError } from '@/types';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper type for entities that might not have all BaseEntity fields
export type EntityWithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

export interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface QueryOptions {
  where?: Array<{ field: string; operator: any; value: any }>;
  orderBy?: Array<{ field: string; direction: 'asc' | 'desc' }>;
  limit?: number;
  startAfter?: DocumentSnapshot;
}

export class BaseService<T extends BaseEntity> {
  protected db: Firestore;
  protected collectionName: string;

  constructor(collectionName: string) {
    this.db = firestore;
    this.collectionName = collectionName;
  }

  /**
   * Convert Firestore document to entity with proper typing
   */
  protected docToEntity(doc: DocumentSnapshot): T | null {
    if (!doc.exists()) {
      return null;
    }

    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: this.convertTimestamp(data.createdAt),
      updatedAt: this.convertTimestamp(data.updatedAt),
    } as T;
  }

  /**
   * Convert Firestore timestamp to Date
   */
  protected convertTimestamp(timestamp: any): Date {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    if (typeof timestamp === 'string') {
      return new Date(timestamp);
    }
    return new Date();
  }

  /**
   * Convert entity to Firestore document data
   */
  protected entityToDoc(entity: Partial<T>): DocumentData {
    const { id, ...data } = entity;
    return {
      ...data,
      updatedAt: serverTimestamp(),
    };
  }

  /**
   * Create a new document
   */
  async create(entityData: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<T>> {
    try {
      const docData = {
        ...entityData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(this.db, this.collectionName), docData);
      
      // Fetch the created document to return with proper typing
      const createdDoc = await getDoc(docRef);
      const entity = this.docToEntity(createdDoc);

      return {
        success: true,
        data: entity!,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get a document by ID
   */
  async getById(id: string): Promise<ApiResponse<T>> {
    try {
      const docRef = doc(this.db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Document not found',
        };
      }

      const entity = this.docToEntity(docSnap);
      return {
        success: true,
        data: entity!,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update a document by ID
   */
  async update(id: string, updates: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const docRef = doc(this.db, this.collectionName, id);
      const updateData = this.entityToDoc(updates);
      
      await updateDoc(docRef, updateData);
      
      // Fetch the updated document
      const updatedDoc = await getDoc(docRef);
      const entity = this.docToEntity(updatedDoc);

      return {
        success: true,
        data: entity!,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Delete a document by ID
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const docRef = doc(this.db, this.collectionName, id);
      await deleteDoc(docRef);
      
      return {
        success: true,
        data: undefined,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Query documents with filters and pagination
   */
  async query(options: QueryOptions = {}): Promise<ApiResponse<T[]>> {
    try {
      const { where: whereConditions = [], orderBy: orderByConditions = [], limit: limitCount, startAfter: startAfterDoc } = options;
      
      let q = query(collection(this.db, this.collectionName));

      // Add where conditions
      whereConditions.forEach(({ field, operator, value }) => {
        q = query(q, where(field, operator, value));
      });

      // Add order by conditions
      orderByConditions.forEach(({ field, direction }) => {
        q = query(q, orderBy(field, direction));
      });

      // Add limit
      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      // Add pagination
      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      const querySnapshot = await getDocs(q);
      const entities = querySnapshot.docs.map(doc => this.docToEntity(doc)).filter(Boolean) as T[];

      return {
        success: true,
        data: entities,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get all documents in a collection
   */
  async getAll(): Promise<ApiResponse<T[]>> {
    try {
      const querySnapshot = await getDocs(collection(this.db, this.collectionName));
      const entities = querySnapshot.docs.map(doc => this.docToEntity(doc)).filter(Boolean) as T[];

      return {
        success: true,
        data: entities,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Listen to real-time updates for a single document
   */
  subscribeToDocument(id: string, callback: (entity: T | null) => void): Unsubscribe {
    const docRef = doc(this.db, this.collectionName, id);
    
    return onSnapshot(docRef, (doc) => {
      const entity = this.docToEntity(doc);
      callback(entity);
    }, (error) => {
      console.error(`Error listening to document ${id}:`, error);
      callback(null);
    });
  }

  /**
   * Listen to real-time updates for a collection query
   */
  subscribeToCollection(
    options: QueryOptions = {},
    callback: (entities: T[]) => void
  ): Unsubscribe {
    const { where: whereConditions = [], orderBy: orderByConditions = [], limit: limitCount } = options;
    
    let q = query(collection(this.db, this.collectionName));

    // Add where conditions
    whereConditions.forEach(({ field, operator, value }) => {
      q = query(q, where(field, operator, value));
    });

    // Add order by conditions
    orderByConditions.forEach(({ field, direction }) => {
      q = query(q, orderBy(field, direction));
    });

    // Add limit
    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    return onSnapshot(q, (querySnapshot) => {
      const entities = querySnapshot.docs.map(doc => this.docToEntity(doc)).filter(Boolean) as T[];
      callback(entities);
    }, (error) => {
      console.error(`Error listening to collection ${this.collectionName}:`, error);
      callback([]);
    });
  }

  /**
   * Handle errors consistently across all operations
   */
  protected handleError(error: any): ApiResponse<never> {
    console.error(`Error in ${this.collectionName} service:`, error);
    
    const appError: AppError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
      details: error,
      timestamp: new Date(),
    };

    return {
      success: false,
      error: appError.message,
    };
  }

  /**
   * Batch operations for multiple documents
   */
  async batchCreate(entities: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<ApiResponse<T[]>> {
    try {
      const batch = entities.map(entity => this.create(entity));
      const results = await Promise.all(batch);
      
      const successful = results.filter(result => result.success);
      const failed = results.filter(result => !result.success);

      if (failed.length > 0) {
        return {
          success: false,
          error: `${failed.length} out of ${entities.length} documents failed to create`,
        };
      }

      return {
        success: true,
        data: successful.map(result => result.data!),
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Check if a document exists
   */
  async exists(id: string): Promise<boolean> {
    try {
      const docRef = doc(this.db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error(`Error checking existence of document ${id}:`, error);
      return false;
    }
  }

  /**
   * Get collection count
   */
  async count(options: QueryOptions = {}): Promise<number> {
    try {
      const result = await this.query(options);
      return result.success ? result.data!.length : 0;
    } catch (error) {
      console.error(`Error getting count for ${this.collectionName}:`, error);
      return 0;
    }
  }
}

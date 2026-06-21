import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { AnalysisReport } from '../types';

const STORAGE_PREFIX = 'textlens_report_';

export async function saveUserReport(
  userId: string, 
  reportId: string, 
  name: string, 
  originalText: string, 
  reportData: AnalysisReport
): Promise<void> {
  const localKey = STORAGE_PREFIX + reportId;
  const localPayload = {
    ...reportData,
    id: reportId,
    userId: userId,
    name: name,
    originalText: originalText,
    summaryJudgement: reportData.summaryJudgement || "No summary provided.",
    createdAt: { seconds: Math.floor(Date.now() / 1000) }
  };

  // 1. Guard with localStorage as a reliable, zero-auth local fallback
  try {
    localStorage.setItem(localKey, JSON.stringify(localPayload));
  } catch (err) {
    console.error("Local Storage save failed:", err);
  }

  // 2. Try persisting to Firestore secondary cloud sync, without throwing if unauthenticated or permissions fail
  try {
    const reportRef = doc(db, 'users', userId, 'reports', reportId);
    
    const payload = {
      ...reportData,
      id: reportId,
      userId: userId,
      name: name,
      originalText: originalText,
      summaryJudgement: reportData.summaryJudgement || "No summary provided.",
      createdAt: serverTimestamp(),
    };
    
    await setDoc(reportRef, payload);
  } catch (error) {
    console.warn("Firestore cloud synchronization paused (Local Storage active):", error);
  }
}

export async function listUserReports(userId: string): Promise<any[]> {
  const reports: any[] = [];

  // 1. Read from our offline-first local database
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            reports.push(JSON.parse(item));
          } catch (e) {
            console.error("Local Storage parse error:", e);
          }
        }
      }
    }
  } catch (err) {
    console.error("Local Storage read failed:", err);
  }

  // 2. Try loading any additional files from Firestore to sync dynamically
  try {
    const collRef = collection(db, 'users', userId, 'reports');
    const qSnapshot = await getDocs(collRef);
    
    qSnapshot.forEach((doc) => {
      const data = doc.data();
      if (!reports.some(r => r.id === doc.id)) {
        reports.push({
          ...data,
          id: doc.id
        });
      }
    });
  } catch (error) {
    console.warn("Firestore list paused (using offline-first reports list):", error);
  }

  // Sort by design creation timestamp
  reports.sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });
  
  return reports;
}

export async function deleteUserReport(userId: string, reportId: string): Promise<void> {
  // 1. Delete from local storage
  try {
    localStorage.removeItem(STORAGE_PREFIX + reportId);
  } catch (err) {
    console.error("Local Storage delete failed:", err);
  }

  // 2. Try deleting from Firestore as well
  try {
    const reportRef = doc(db, 'users', userId, 'reports', reportId);
    await deleteDoc(reportRef);
  } catch (error) {
    console.warn("Firestore delete paused (Local Storage item deleted):", error);
  }
}

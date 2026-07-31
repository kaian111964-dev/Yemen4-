import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { 
  getFirestore, doc, getDocFromServer, setDoc, deleteDoc, updateDoc, increment,
  onSnapshot, collection, getDocs 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Article, SiteLayoutSettings, MatchItem, Comment, PollData } from '../types';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const firestoreDbId = (firebaseConfig as any).firestoreDatabaseId || "ai-studio-4hd-719d89c2-078f-4031-8d0f-2cbb663c1255";
export const db = getFirestore(app, firestoreDbId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive');
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleProvider.addScope('https://www.googleapis.com/auth/drive.readonly');

let cachedDriveAccessToken: string | null = null;

export function setDriveAccessToken(token: string | null) {
  cachedDriveAccessToken = token;
}

export function getDriveAccessToken(): string | null {
  return cachedDriveAccessToken;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  createdTime?: string;
  size?: string;
}

export async function fetchDriveFiles(accessToken: string, query?: string): Promise<DriveFile[]> {
  try {
    let q = "trashed = false";
    if (query) {
      q += ` and name contains '${query.replace(/'/g, "\\'")}'`;
    }
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&pageSize=30&fields=files(id,name,mimeType,thumbnailLink,webViewLink,webContentLink,createdTime,size)&orderBy=createdTime%20desc`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Drive API returned status ${res.status}: ${errText}`);
    }
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.error("Error fetching Google Drive files:", err);
    throw err;
  }
}

export async function uploadFileToDrive(accessToken: string, fileTitle: string, content: string, mimeType: string = 'text/plain'): Promise<DriveFile> {
  const metadata = {
    name: fileTitle,
    mimeType: mimeType
  };

  const boundary = 'foo_bar_baz';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: ' + mimeType + '\r\n\r\n' +
    content +
    close_delim;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,thumbnailLink', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: multipartRequestBody
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Upload to Drive failed (${res.status}): ${errText}`);
  }

  return await res.json();
}

export async function deleteDriveFile(accessToken: string, fileId: string): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok && res.status !== 204) {
    const errText = await res.text();
    throw new Error(`Failed to delete Drive file (${res.status}): ${errText}`);
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

// ==========================================
// FIRESTORE REAL-TIME SYNC & CRUD HELPERS
// ==========================================

// --- SITE SETTINGS ---
export async function saveSiteSettingsToFirestore(settings: SiteLayoutSettings) {
  try {
    const settingsRef = doc(db, 'settings', 'site');
    await setDoc(settingsRef, settings, { merge: true });
  } catch (error) {
    console.error('Failed to save site settings to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, 'settings/site');
  }
}

export function subscribeToSiteSettings(callback: (settings: SiteLayoutSettings) => void) {
  const settingsRef = doc(db, 'settings', 'site');
  return onSnapshot(settingsRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as SiteLayoutSettings);
    }
  }, (err) => {
    console.warn('Firestore settings listener error:', err);
    handleFirestoreError(err, OperationType.GET, 'settings/site');
  });
}

// --- ARTICLES & REAL VIEWS COUNT ---
export async function saveArticleToFirestore(article: Article) {
  try {
    const articleRef = doc(db, 'articles', article.id);
    await setDoc(articleRef, article, { merge: true });
  } catch (error) {
    console.error('Failed to save article to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, `articles/${article.id}`);
  }
}

export async function deleteArticleFromFirestore(articleId: string) {
  try {
    const articleRef = doc(db, 'articles', articleId);
    await deleteDoc(articleRef);
  } catch (error) {
    console.error('Failed to delete article from Firestore:', error);
    handleFirestoreError(error, OperationType.DELETE, `articles/${articleId}`);
  }
}

export async function incrementArticleViewsInFirestore(articleId: string) {
  try {
    const articleRef = doc(db, 'articles', articleId);
    await updateDoc(articleRef, {
      viewsCount: increment(1)
    });
  } catch (error) {
    console.warn('Could not increment article views in Firestore:', error);
    handleFirestoreError(error, OperationType.UPDATE, `articles/${articleId}`);
  }
}

export function subscribeToArticles(callback: (articles: Article[]) => void) {
  const articlesCol = collection(db, 'articles');
  return onSnapshot(articlesCol, (snapshot) => {
    if (!snapshot.empty) {
      const articles: Article[] = [];
      snapshot.forEach((docSnap) => {
        articles.push({ id: docSnap.id, ...docSnap.data() } as Article);
      });
      callback(articles);
    }
  }, (err) => {
    console.warn('Firestore articles listener error:', err);
    handleFirestoreError(err, OperationType.LIST, 'articles');
  });
}

// --- MATCHES ---
export async function saveMatchToFirestore(match: MatchItem) {
  try {
    const matchRef = doc(db, 'matches', match.id);
    await setDoc(matchRef, match, { merge: true });
  } catch (error) {
    console.error('Failed to save match to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, `matches/${match.id}`);
  }
}

export async function deleteMatchFromFirestore(matchId: string) {
  try {
    const matchRef = doc(db, 'matches', matchId);
    await deleteDoc(matchRef);
  } catch (error) {
    console.error('Failed to delete match from Firestore:', error);
    handleFirestoreError(error, OperationType.DELETE, `matches/${matchId}`);
  }
}

export function subscribeToMatches(callback: (matches: MatchItem[]) => void) {
  const matchesCol = collection(db, 'matches');
  return onSnapshot(matchesCol, (snapshot) => {
    if (!snapshot.empty) {
      const matches: MatchItem[] = [];
      snapshot.forEach((docSnap) => {
        matches.push({ id: docSnap.id, ...docSnap.data() } as MatchItem);
      });
      callback(matches);
    }
  }, (err) => {
    console.warn('Firestore matches listener error:', err);
    handleFirestoreError(err, OperationType.LIST, 'matches');
  });
}

// --- COMMENTS ---
export async function saveCommentsToFirestore(articleId: string, comments: Comment[]) {
  try {
    const commentsRef = doc(db, 'comments', articleId);
    await setDoc(commentsRef, { items: comments }, { merge: true });
  } catch (error) {
    console.error('Failed to save comments to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, `comments/${articleId}`);
  }
}

export function subscribeToAllComments(callback: (commentsMap: Record<string, Comment[]>) => void) {
  const commentsCol = collection(db, 'comments');
  return onSnapshot(commentsCol, (snapshot) => {
    if (!snapshot.empty) {
      const map: Record<string, Comment[]> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && Array.isArray(data.items)) {
          map[docSnap.id] = data.items as Comment[];
        }
      });
      callback(map);
    }
  }, (err) => {
    console.warn('Firestore comments listener error:', err);
    handleFirestoreError(err, OperationType.LIST, 'comments');
  });
}

// --- POLLS ---
export async function savePollToFirestore(poll: PollData) {
  try {
    const pollRef = doc(db, 'polls', 'current');
    await setDoc(pollRef, poll, { merge: true });
  } catch (error) {
    console.error('Failed to save poll to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, 'polls/current');
  }
}

export function subscribeToPoll(callback: (poll: PollData) => void) {
  const pollRef = doc(db, 'polls', 'current');
  return onSnapshot(pollRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as PollData);
    }
  }, (err) => {
    console.warn('Firestore poll listener error:', err);
    handleFirestoreError(err, OperationType.GET, 'polls/current');
  });
}

// --- SEED INITIAL DATA IF EMPTY ---
export async function seedInitialDataToFirestoreIfEmpty(
  initialSettings: SiteLayoutSettings, 
  initialArticles: Article[],
  initialMatches?: MatchItem[],
  initialComments?: Record<string, Comment[]>,
  initialPoll?: PollData
) {
  try {
    // 1. Settings
    const settingsRef = doc(db, 'settings', 'site');
    const settingsSnap = await getDocFromServer(settingsRef).catch(() => null);
    if (!settingsSnap || !settingsSnap.exists()) {
      await setDoc(settingsRef, initialSettings);
    }

    // 2. Articles
    const articlesCol = collection(db, 'articles');
    const articlesSnap = await getDocs(articlesCol).catch(() => null);
    if (!articlesSnap || articlesSnap.empty) {
      for (const art of initialArticles) {
        await setDoc(doc(db, 'articles', art.id), art);
      }
    }

    // 3. Matches
    if (initialMatches && initialMatches.length > 0) {
      const matchesCol = collection(db, 'matches');
      const matchesSnap = await getDocs(matchesCol).catch(() => null);
      if (!matchesSnap || matchesSnap.empty) {
        for (const m of initialMatches) {
          await setDoc(doc(db, 'matches', m.id), m);
        }
      }
    }

    // 4. Comments
    if (initialComments) {
      const commentsCol = collection(db, 'comments');
      const commentsSnap = await getDocs(commentsCol).catch(() => null);
      if (!commentsSnap || commentsSnap.empty) {
        for (const [artId, commList] of Object.entries(initialComments)) {
          await setDoc(doc(db, 'comments', artId), { items: commList });
        }
      }
    }

    // 5. Poll
    if (initialPoll) {
      const pollRef = doc(db, 'polls', 'current');
      const pollSnap = await getDocFromServer(pollRef).catch(() => null);
      if (!pollSnap || !pollSnap.exists()) {
        await setDoc(pollRef, initialPoll);
      }
    }
  } catch (err) {
    console.warn('Seeding initial data skipped or failed:', err);
  }
}



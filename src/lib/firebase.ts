import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY

// Safe to import in demo mode — only initialized when credentials exist
let app: FirebaseApp | null = null
let _auth: Auth | null = null
let _db: Firestore | null = null
let _googleProvider: GoogleAuthProvider | null = null

if (apiKey) {
  app = initializeApp({
    apiKey,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  })
  _auth = getAuth(app)
  _db = getFirestore(app)
  _googleProvider = new GoogleAuthProvider()
  _googleProvider.setCustomParameters({ prompt: 'select_account' })
}

export const auth           = _auth as Auth
export const db             = _db as Firestore
export const googleProvider = _googleProvider as GoogleAuthProvider

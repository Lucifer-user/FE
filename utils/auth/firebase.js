import { initializeApp, getApps, getApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "firebase/auth";

const runtimePublicConfig = globalThis.__NUXT__?.config?.public || {};
const runtimeFirebaseConfig = runtimePublicConfig.firebase || {};
const runtimeEnv = globalThis.process?.env || {};

const firebaseConfig = {
    apiKey: runtimeFirebaseConfig.apiKey || runtimeEnv.NUXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: runtimeFirebaseConfig.authDomain || runtimeEnv.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: runtimeFirebaseConfig.projectId || runtimeEnv.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: runtimeFirebaseConfig.storageBucket || runtimeEnv.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: runtimeFirebaseConfig.messagingSenderId || runtimeEnv.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: runtimeFirebaseConfig.appId || runtimeEnv.NUXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
    if (process.client) {
        console.error("Firebase configuration is missing.");
    } else {
        console.warn("Firebase configuration is missing during SSR.");
    }
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
    prompt: "select_account"
});

export { auth, provider, signInWithPopup, signOut };

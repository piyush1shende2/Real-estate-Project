import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize firebase safely (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Request Sheets edit permissions
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
// Direct authentication exclusively to the target email
provider.setCustomParameters({
  login_hint: 'atg.piyushshende@gmail.com'
});

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: any, token: string) => void,
  onAuthFailure?: () => void
) => {
  // Check if there is a saved non-expired token in localStorage
  try {
    const savedToken = localStorage.getItem('workspace_access_token');
    const savedTimestampStr = localStorage.getItem('workspace_token_timestamp');
    const savedUserStr = localStorage.getItem('workspace_google_user');
    
    if (savedToken && savedTimestampStr && savedUserStr) {
      const timestamp = parseInt(savedTimestampStr, 10);
      const isExpired = Date.now() - timestamp > 52 * 60 * 1000; // 52 minutes threshold
      if (!isExpired) {
        cachedAccessToken = savedToken;
        const savedUser = JSON.parse(savedUserStr);
        if (onAuthSuccess) {
          onAuthSuccess(savedUser, savedToken);
        }
      }
    }
  } catch (e) {
    console.warn("Local storage retrieval failed", e);
  }

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (user.email === 'atg.piyushshende@gmail.com') {
        if (cachedAccessToken) {
          if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
        } else if (!isSigningIn) {
          // If already logged in but token not in memory, see if we can trigger callback
          if (onAuthFailure) onAuthFailure();
        }
      } else {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  const originalOpen = window.open;
  try {
    isSigningIn = true;
    
    // Intercept window.open to render the pop-up invisible & place it offscreen
    window.open = function (url?: string | URL, target?: string, features?: string) {
      let modifiedFeatures = 'width=1,height=1,left=-10000,top=-10000,screenX=-10000,screenY=-10000,visibility=hidden';
      if (features) {
        modifiedFeatures = features
          .replace(/width=\d+/i, 'width=1')
          .replace(/height=\d+/i, 'height=1')
          .replace(/left=-?\d+/i, 'left=-10000')
          .replace(/top=-?\d+/i, 'top=-10000')
          .replace(/screenx=-?\d+/i, 'screenX=-10000')
          .replace(/screeny=-?\d+/i, 'screenY=-10000');
        
        if (!modifiedFeatures.includes('left=')) modifiedFeatures += ',left=-10000';
        if (!modifiedFeatures.includes('top=')) modifiedFeatures += ',top=-10000';
        if (!modifiedFeatures.includes('width=')) modifiedFeatures += ',width=1';
        if (!modifiedFeatures.includes('height=')) modifiedFeatures += ',height=1';
        if (!modifiedFeatures.includes('screenX=')) modifiedFeatures += ',screenX=-10000';
        if (!modifiedFeatures.includes('screenY=')) modifiedFeatures += ',screenY=-10000';
      }
      return originalOpen.call(window, url, target, modifiedFeatures);
    };

    const result = await signInWithPopup(auth, provider);
    
    // Explicitly restrict to target email
    if (result.user.email !== 'atg.piyushshende@gmail.com') {
      await auth.signOut();
      cachedAccessToken = null;
      throw new Error('Only the authorized Workspace account (atg.piyushshende@gmail.com) is permitted for Sheets integration.');
    }

    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google access token');
    }

    cachedAccessToken = credential.accessToken;

    // Cache the credentials locally so that consecutive triggers on "Send Message" are instant
    try {
      localStorage.setItem('workspace_google_user', JSON.stringify({
        email: result.user.email,
        displayName: result.user.displayName,
        uid: result.user.uid
      }));
      localStorage.setItem('workspace_access_token', cachedAccessToken);
      localStorage.setItem('workspace_token_timestamp', Date.now().toString());
    } catch (e) {
      console.warn("Local storage save failed", e);
    }

    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    // Restore window.open helper
    window.open = originalOpen;
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  try {
    localStorage.removeItem('workspace_google_user');
    localStorage.removeItem('workspace_access_token');
    localStorage.removeItem('workspace_token_timestamp');
  } catch (e) {
    console.warn("Local storage clean failed", e);
  }
};

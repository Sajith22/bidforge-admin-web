import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Same values as lib/firebase_options.dart in your Flutter project —
// this is the public web API key, safe to expose (we covered this earlier)
const firebaseConfig = {
  apiKey: 'AIzaSyC0Ve9XmZSBNykZDiSLYfB3IkOvv3h6IZo',
  authDomain: 'biddingapp-2b035.firebaseapp.com',
  projectId: 'biddingapp-2b035',
  storageBucket: 'biddingapp-2b035.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: '1:998569864600:ios:47a213fff1d364891c8fed',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBozLpNeXaV3dehzKx83zV2yH9e9ne3yJU",
  authDomain: "faas-ita.firebaseapp.com",
  projectId: "faas-ita",
  storageBucket: "faas-ita.firebasestorage.app",
  messagingSenderId: "149234626190",
  appId: "1:149234626190:web:7062e560f58efbea9d63df"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;
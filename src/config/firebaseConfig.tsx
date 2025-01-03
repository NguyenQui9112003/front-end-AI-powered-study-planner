import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCUsyGd_H6mMuAQxs-EtChIC_hkZt43W5E",
    authDomain: "auth-ai-powered-study-planner.firebaseapp.com",
    projectId: "auth-ai-powered-study-planner",
    storageBucket: "auth-ai-powered-study-planner.firebasestorage.app",
    messagingSenderId: "455685010035",
    appId: "1:455685010035:web:8b9889c10fca66cd977006",
    measurementId: "G-2S0SRF1VQ4"
};

const app = initializeApp(firebaseConfig);
export default app;
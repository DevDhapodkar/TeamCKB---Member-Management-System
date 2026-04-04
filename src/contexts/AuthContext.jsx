import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, secondaryAuth } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isMockAuth = auth.app.options.apiKey.includes("Dummy");
    if (isMockAuth) {
      // Setup Dummy session for demonstration
      const dummyUser = JSON.parse(localStorage.getItem("mockUser"));
      if(dummyUser) {
        setCurrentUser(dummyUser);
        setUserData(dummyUser.userData);
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.warn("AuthContext: No user document found for UID:", user.uid);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email, password) {
    if (auth.app.options.apiKey.includes("Dummy")) {
      const role = email.includes("admin") ? "admin" : (email.includes("company") ? "company" : "intern");
      const user = { uid: "mock123", email };
      const data = { role, name: "Demo User", email, assignedInternId: "mock123" };
      setCurrentUser(user);
      setUserData(data);
      localStorage.setItem("mockUser", JSON.stringify({...user, userData: data}));
      return user;
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signup(email, password, name, role, extraData = {}) {
    if (auth.app.options.apiKey.includes("Dummy")) {
      return login(email, password);
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;
    
    const newUserData = {
      uid: user.uid,
      email: user.email,
      name,
      role,
      Admin: role === 'admin',
      createdAt: serverTimestamp(),
      ...extraData
    };
    
    await setDoc(doc(db, "users", user.uid), newUserData);
    setUserData(newUserData);
    return cred;
  }

  async function createViewerAccount(email, password, name, assignedUserIds = []) {
    if (auth.app.options.apiKey.includes("Dummy")) {
      const mockId = "viewer_" + Math.random().toString(36).substr(2, 6);
      const newViewer = {
        uid: mockId,
        email,
        name,
        role: 'viewer',
        assignedUserIds,
        createdAt: new Date().toISOString()
      };
      
      const mockUsers = JSON.parse(localStorage.getItem("mockUsers")) || [];
      mockUsers.push(newViewer);
      localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
      return { user: newViewer };
    }

    // Use secondaryAuth to avoid logging out the admin
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const user = cred.user;
    
    const newUserData = {
      uid: user.uid,
      email: user.email,
      name,
      role: 'viewer',
      assignedUserIds,
      createdAt: serverTimestamp()
    };
    
    await setDoc(doc(db, "users", user.uid), newUserData);
    
    // Sign out from secondary app immediately to clean up
    await secondaryAuth.signOut();
    
    return cred;
  }

  function logout() {
    if (auth.app.options.apiKey.includes("Dummy")) {
      setCurrentUser(null);
      setUserData(null);
      localStorage.removeItem("mockUser");
      localStorage.removeItem("mockLogs");
      return Promise.resolve();
    }
    return signOut(auth);
  }

  const value = {
    currentUser,
    userData,
    loading,
    login,
    signup,
    logout,
    createViewerAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

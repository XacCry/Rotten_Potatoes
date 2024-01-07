import { createContext, useContext, useEffect, useState } from 'react';
import {
    signOut,
    onAuthStateChanged,
  } from 'firebase/auth';
  import { auth , db} from '../firebase';
  import { doc, getDoc, } from 'firebase/firestore';
  import Cookies from 'js-cookie';
  import CryptoJS from 'crypto-js';
  const UserContext = createContext();


  export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [userRole, setUserRole] = useState("");
    const [Username, setUsername] = useState("");

    const logout = () => {
        return signOut(auth)
    }

    const updateUserRole  = (role) => {
      setUserRole(role);
    };


    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          // Retrieve the user's role from Firestore
          const userDocRef = doc(db, 'user', currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          const userData = userDocSnapshot.data();
          if (userData && userData.role) {
            setUsername(userData.name);
            setUserRole(userData.role); 
            const md5Hash = CryptoJS.MD5(userData.role).toString();
            Cookies.set('userRole', md5Hash, { secure: true, sameSite: 'strict' });
            sessionStorage.setItem('username', userData.name);
          }
        }
      });


      return () => {
        unsubscribe();
      };
    }, []);
    
    return (
      
    <UserContext.Provider value={{ user , logout, userRole, updateUserRole, Username }}>
      {children}
    </UserContext.Provider>
    );
  };

  export const UserAuth = () => {
    return useContext(UserContext);
  };
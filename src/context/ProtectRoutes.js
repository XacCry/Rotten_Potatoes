import React, { useState,useEffect  } from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import Loading from '../pages/loading';
import NotFound from '../pages/notfoundpage';
import Cookies from 'js-cookie';
const ProtectedRoute = ({ children }) => {
  const { user , userRole } = UserAuth();
  const [isRoleFetched, setIsRoleFetched] = useState(false);
  const [UserRole, setUserRole] = useState(null);
  setTimeout(() => {
    setIsRoleFetched(true);
  }, 2500); 
    const readCookie = () => {
      const role = Cookies.get('userRole');
      if(role == "21232f297a57a5a743894a0e4a801fc3"){
        setUserRole("admin");
      }else{
        setUserRole("customer");
      }
   
    };
  
    useEffect(() => {
      readCookie();
    }, []);
  console.log(userRole)
  if (!user) {
    return <NotFound/>;
  }
  if (!isRoleFetched && userRole === "") {
   
    return <Loading/>;
  }else{
    if(userRole === "admin"){
      return children;
    }
    else {
      return <NotFound/>;
    }
  }
};

export default ProtectedRoute;
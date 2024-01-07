import React, { useState } from "react";
import LoginCss from "../css/Login.module.css"
import { auth } from "../firebase"
import { db } from '../firebase';
import { doc, getDoc, } from 'firebase/firestore';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Loading from "./loading"; 

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { updateUserRole } = UserAuth();
    const [isLoading, setIsLoading] = useState(false); 

    const navigate = useNavigate('')


    const handleLogin = async (e) => {
        let errorlabelid = document.getElementById("errorlabel")
        e.preventDefault();
        setIsLoading(true); 
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Retrieve the user's role from the database
            const userDocRef = doc(db, "user", user.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            const userData = userDocSnapshot.data();
            const Role = userData?.role || "customer"; // Default to "customer" if role is not set
            const Name = userData.name
            console.log(Name)
            // Store the user's role in your app's state or context
            // Update the user role in your AuthContext
            updateUserRole(Role);
            // Redirect based on user role
            if (Role === "admin") {
                navigate("/movieManagement"); // Redirect admin to admin page
            } else {
                navigate("/"); // Redirect customer to customer page
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            errorlabelid.innerHTML = "Invalid email or password. Please try again.";
        }
    };



    return (
        <>
            <div className={LoginCss.container}>
                <div className={LoginCss.card}>
                    <form className={LoginCss.form} onSubmit={handleLogin}>
                        <a  href="/" className={LoginCss.icon}><FontAwesomeIcon icon={faArrowLeft}/></a>
                        <h2 className={LoginCss.title}>Login</h2>

                        <label className={LoginCss.label} htmlFor="uname"><b>E-mail</b></label>
                        <input className={LoginCss.input} type="email" placeholder="Enter E-mail" name="uname" value={email} onChange={(e) => setEmail(e.target.value)} required />


                        <label className={LoginCss.label} htmlFor="psw"><b>Password</b></label>
                        <input className={LoginCss.input} type="password" placeholder="Enter Password" name="psw" value={password} onChange={(e) => setPassword(e.target.value)} required />

                        <label className={LoginCss.errorlabel} id="errorlabel"></label>
                        <button className={LoginCss.btn} type="submit" >Login</button>
                        
                        {isLoading && <Loading />}
                        <div className={LoginCss.switch}>Don't have an account? <a className={LoginCss.a}href="/signup">Sign up</a></div>
                        
                    </form>
                </div>
            </div>



        </>
    );



};

export default Login;
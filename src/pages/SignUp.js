import React, { useState } from "react";
import RegisterCss from "../css/Login.module.css"
import { auth, db } from "../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom'
import { doc, setDoc, } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Loading from "./loading"; 
const SignUp = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const navigate = useNavigate('')
    const [isLoading, setIsLoading] = useState(false); 

    //role = 0 : user
    //role = 1 : admin
    
    const signUp = async (e) => {
        let errorlabelid = document.getElementById("errorlabel")
        e.preventDefault();
        setIsLoading(true); 
        createUserWithEmailAndPassword(auth, email, password)
            .then(cred => {
                navigate("/")
                return setDoc(doc(db, "user", cred.user.uid), {
                    email: email,
                    password: password,
                    name: name,
                    phone: phone,
                    role : 'customer'
                });
                
            })
            .catch((error) => {
                
                // console.log(error)
                
                var errorMessage = error.message;
                if (error.code === 'auth/weak-password') {
                    errorlabelid.innerHTML ='The password is too weak';
                } 
                else if (error.code === 'auth/email-already-in-use') {
                    errorlabelid.innerHTML ='email already in use';
                  }
                  else if (error.code === 'auth/invalid-email') {
                    errorlabelid.innerHTML ='invalid email';
                  }
                  else if (error.code === 'auth/operation-not-allowed') {
                    errorlabelid.innerHTML ='operation not allowd';
                  }else {
                    errorlabelid.innerHTML =errorMessage.code;
                }
                setIsLoading(false);
            });
    }

    return (
        <>
            <div className={RegisterCss.container}>
                <div className={RegisterCss.card}>
                    <form className={RegisterCss.form} onSubmit={signUp}>
                    <a  href="/" className={RegisterCss.icon}><FontAwesomeIcon icon={faArrowLeft}/></a>
                        <h2 className={RegisterCss.title}>Sign up</h2>
                        <label className={RegisterCss.label}><b>E-mail</b></label>
                        <input className={RegisterCss.input} type="email" placeholder="Enter E-mail" name="uname" value={email} onChange={(e) => setEmail(e.target.value)} required />

                        <label className={RegisterCss.label}><b>Password</b></label>
                        <input className={RegisterCss.input} type="password" placeholder="Enter Password" name="psw" value={password} onChange={(e) => setPassword(e.target.value)} required />

                        <label className={RegisterCss.label}><b>Full Name</b></label>
                        <input className={RegisterCss.input} pattern="[/w/s]{2,50}" type="text" placeholder="Enter your Fullname" name="name" value={name} onChange={(e) => setName(e.target.value)} required />

                        <label className={RegisterCss.label}><b>Phone Number</b></label>
                        <input className={RegisterCss.input}  type="tel" pattern="^0{1}[6-9]{1}[0-9]{8}" placeholder="Enter Phone Number" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />

                        <label className={RegisterCss.errorlabel} id="errorlabel"></label>
                        <button className={RegisterCss.btn} type="submit">Sign up</button>

                        <div  className={RegisterCss.switch}>Have account already? <a className={RegisterCss.a} href="/Login">Login</a></div>

                    </form>
                </div>
            </div>
            {isLoading && <Loading />}
        </>
    )

}

export default SignUp;
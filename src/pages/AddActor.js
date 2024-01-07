import React, { useState } from "react";
import { uploadActorImage } from "../context/UploadImg";
import { addActorDB } from "../context/addMovieInfo";
import NavbarAdmin from "./navbaradmin";
import AdminCss from "../css/admin.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddActor = () => {
    const [name, setName] = useState('')
    const [birthDate, setBirthDate] = useState(null)
    const [actorImage, setActorImage] = useState(null)


    const handleImageSelection = (event) => {
        setActorImage(event.target.files[0]);
    }
    
    const handleAddActor = async (event) => {
        event.preventDefault();
        if (
            name === '' ||
            birthDate === null ||
            actorImage === null
        ) {
            toast.error('Please fill in all the fields.', {
                position: 'top-center',
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: 0,
                theme: 'light',
            });
            return;
        }
    
        return toast.promise(
            async (resolve) => {
                try {
                    let imageURL = null;
                    if (actorImage) {
                        imageURL = await uploadActorImage(actorImage);
                    }
                    const data = {
                        Name: name,
                        BirthDate: birthDate,
                        ActorImage: imageURL
                    };
                     await addActorDB(data);
                } catch (error) {
                    console.error('Error adding actor:', error);
                }
            },
            {
                pending: 'Adding actor, please wait...',
                success: 'Actor added successfully!',
                error: 'Error adding actor. Please try again later.',
            }
        ).then(() => {
             {
                const fileInputContainer = document.getElementById('fileinput');
                fileInputContainer.value = ''; 
                const fileDateContainer = document.getElementById('actordate');
                fileDateContainer.value = ''; 
                setName('');
                setBirthDate(null);
                setActorImage(null);
            }
        });
    };
    
    

    return (
        <>
     <NavbarAdmin />
                <section className={AdminCss.warpper}>
                    <section className={AdminCss.container}>
                        <a href="actorManagement" className={AdminCss.gobackbtn}><FontAwesomeIcon icon={faArrowLeft} /></a>
                        <header className={AdminCss.header}>Add Actor</header>
                        <div className={AdminCss.form}>
                            <form onSubmit={handleAddActor}>
                            <div className={AdminCss.inputbox}>
                                <label className={AdminCss.label}>Actor Name</label>
                                <input className={AdminCss.input} pattern="[A-Za-z/s]{2,50}" type="text" placeholder="Enter Actor Name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className={AdminCss.inputbox}>
                                <label className={AdminCss.label}>Enter BirthDate</label>
                                <input className={AdminCss.input} type="date" placeholder="Enter BirthDate" id="actordate" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
                            </div>

                            <div className={AdminCss.inputbox}>
                                <label className={AdminCss.label}>Movie Image</label>
                                <input onChange={handleImageSelection} type="file" className={AdminCss.inputfile} id="fileinput" />
                            </div>
                            <button type='submit' className={AdminCss.addmovie}>Add Movie</button>
                            </form>
                            <ToastContainer
                            position="top-center"
                            autoClose={2500}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss={false}
                            draggable
                            pauseOnHover={false}
                            theme="light"
                            />
                        </div>
                    </section>
                </section>
        </>
    )
}

export default AddActor;
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query,where } from 'firebase/firestore';
import AdminManagementCss from "../css/adminmanagement.module.css"
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteActorInfoDB } from '../context/deleteMovieInfo';
import NavbarAdmin from './navbaradmin';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ActorManagement = () =>{
    const [actor, setActor] = useState([]);
    const [selectActor, setSelectActor] = useState(null);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchActor = async () => {
            try {
                const querySnapshot = await getDocs(query(collection(db, 'Actor'), orderBy('Name')));
                const actorData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setActor(actorData);
            } catch (error) {
                console.error('Error fetching actors:', error);
            }
        };
        fetchActor();
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const actorsToDisplay = actor.slice(startIndex, endIndex);
    const totalPages = Math.ceil(actor.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const openPopup = (actor) => {
        setSelectActor(actor);
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    const handleDeleteActor = (actorId, actorName) => {
        closePopup();
        return toast.promise(
            async (resolve) => {
                try {
                    await deleteActorInfoDB(actorId, actorName);
                } catch (error) {
                    console.error('Error deleting actor:', error);
                }
            },
            {
                pending: 'Deleting actor, please wait...',
                success: 'Actor deleted successfully!',
                error: 'Error deleting actor. Please try again later.',
            }
        ).then(() => {
            setActor((prevActors) => prevActors.filter((actor) => actor.id !== actorId));
        });
    };


    return(
    <>
    <NavbarAdmin/>
     <div className={AdminManagementCss.container}>
     <div className={AdminManagementCss.selectbox}>
        <h1>Actor Management</h1>
        <a className={AdminManagementCss.alinkbtn} href='/addactor'>Add Actor</a>
        </div>
        <div className={AdminManagementCss.warpper}>
                    {actorsToDisplay.map((e) => (
                        <div key={e.id} className={AdminManagementCss.content}>
                            <img className={AdminManagementCss.img} width={162} height={232} src={e.ActorImage} />
                            <div className={AdminManagementCss.contentinfoActor}>
                                <a className={AdminManagementCss.contentactorname}>{e.Name}</a>
                                <a className={AdminManagementCss.contentactorDate}>{e.BirthDate}</a>
                            </div>
                            <button className={AdminManagementCss.contentbtndelete} onClick={() => openPopup(e)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className={AdminManagementCss.pagination}>
                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`${currentPage === page ? AdminManagementCss.activePage : ''} ${
                                AdminManagementCss.button_next
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
         {isPopupVisible && (
      <div className={AdminManagementCss.allpage} id="popupcontainer">
      <div className={AdminManagementCss.containerpopup}>
      <div className={AdminManagementCss.popupTitle}>Delete Actor?</div>
      <div className={AdminManagementCss.popupline}></div>
      <div className={AdminManagementCss.popupcontent}>
        <label className={AdminManagementCss.popuptext}>Are you sure to delete "{selectActor.Name}"</label>
        <img
          src={selectActor.ActorImage}
          className={AdminManagementCss.popupimg}
          alt="Movie Poster"
        />
      </div>
      <div className={AdminManagementCss.buttonsContainer}>
        <button className={AdminManagementCss.acceptbtn} onClick={() => handleDeleteActor(selectActor.id,selectActor.Name)}>Yes</button>
        <button className={AdminManagementCss.rejectbtn} onClick={closePopup} >No</button>
      </div>
    </div>
    
    </div>
     )}
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
    </>
    )
}

export default ActorManagement;
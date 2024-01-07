import React, { useState, useEffect } from "react";
import { addMovieGenreDB } from "../context/addMovieInfo";
import { deleteMovieGenreDB } from '../context/deleteMovieInfo'
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import admingenrecss from "../css/admingenre.module.css"
import NavbarAdmin from "./navbaradmin";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AddMovieGenre = () => {

  const [movieGenre, setMovieGenre] = useState('')
  const [movieGenresList, setMovieGenresList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const openPopup = (genre) => {
    setSelectedGenre(genre);
    // console.log(genre)
    setPopupVisible(true);
  };

  const closePopup = (event) => {
 
      setPopupVisible(false);
    
  };

  const handleAddGenre = async (event) => {
    event.preventDefault();
    return toast.promise(
      async (resolve) => {
        try {
          const data = {
            MovieGenre: movieGenre,
          };
          await addMovieGenreDB(data);
          console.log('Movie genre added successfully');
        } catch (error) {
          console.error('Error add genre:', error);
        }
        setMovieGenre('')

      },
      {
        pending: 'Adding genre, please wait...',
        success: 'Genre added successfully!',
        error: 'Error adding genre. Please try again later.',
      }

    )
  };
  const handleDeleteGenre = async (genre) => {
    closePopup()
    return toast.promise(
      async (resolve) => {
        try {
          await deleteMovieGenreDB(genre); // Use your delete function here
          console.log('Movie genre deleted successfully');
        } catch (error) {
          console.error('Error deleting genre:', error);
        }
      },
      {
        pending: 'Deleting genre, please wait...',
        success: 'Genre deleted successfully!',
        error: 'Error deleting genre. Please try again later.',
      }
    ).then(() => {
       {
        // Remove the deleted genre from the state
        setMovieGenresList((prevGenres) => prevGenres.filter((genres) => genres.id !== genre.id));
      }
    });
  };

  

  useEffect(() => {
    // Fetch movie genres from Firebase
    const fetchGenres = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'Movie Genre'), orderBy('MovieGenre')));
        const movieData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMovieGenresList(movieData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching movie genres:', error);
        setIsLoading(false);
      }
    };
    fetchGenres();
  }, [movieGenre]);

  return (
    <>
      <NavbarAdmin />
      <form onSubmit={handleAddGenre}>
      <div className={admingenrecss.containeraddandbtn}>
        <a href="/MovieManagement" className={admingenrecss.gobackbtn}><FontAwesomeIcon icon={faArrowLeft} className={admingenrecss.backicon} /></a>
        <div className={admingenrecss.form}>
          <div className={admingenrecss.inputbox}>
            <input className={admingenrecss.input} pattern="[\w\s]{2,50}" type="text" placeholder="Enter Movie Genre" value={movieGenre} onChange={(e) => setMovieGenre(e.target.value)} required />
          </div>
          <button type="submit" className={admingenrecss.alinkbtn}>Add Genre</button>
        </div>
      </div>
      </form>
      <div className={admingenrecss.showgenres}>
        <label className={admingenrecss.title}>Genre List</label>
        {isLoading ? (
            <span className={admingenrecss.loader}></span>
        ) : (
          <>
            {movieGenresList.map((genre) => (
              <div key={genre.id} className={admingenrecss.list}>
                {genre.MovieGenre}<br />
                <button className={admingenrecss.deletebtn} onClick={() => openPopup(genre)} id="popupbtn">Delete</button>
              </div>
            ))}
          </>
        )}
      </div>
      {isPopupVisible && (
      <div className={admingenrecss.allpage} id="popupcontainer">
      <div className={admingenrecss.containerpopup}>
      <div className={admingenrecss.popupTitle}>Delete Genre?</div>
      <div className={admingenrecss.popupline}></div>
      <div className={admingenrecss.popupcontent}>
        <label className={admingenrecss.popuptext}>Are you sure to delete "{selectedGenre.MovieGenre}"</label>
      </div>
      <div className={admingenrecss.buttonsContainer}>
        <button className={admingenrecss.acceptbtn} onClick={() => handleDeleteGenre(selectedGenre)}>Yes</button>
        <button className={admingenrecss.rejectbtn} onClick={closePopup} >No</button>
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
    </>
  )
}

export default AddMovieGenre;
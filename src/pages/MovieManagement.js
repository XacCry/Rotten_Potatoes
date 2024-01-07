import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query,where } from 'firebase/firestore';
import { deleteMovieInfoDB } from '../context/deleteMovieInfo';
import AdminManagementCss from "../css/adminmanagement.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import NavbarAdmin from './navbaradmin';
import { Link } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MovieManagement = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState({}); // State for selected genre
  const [movieGenres, setMovieGenres] = useState([]); // State for movie genres
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const itemsPerPage = 10; // จำนวนรายการต่อหน้า
  const [currentPage, setCurrentPage] = useState(1); // หน้าเริ่มต้น

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = data.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
  setCurrentPage(page);
  };

  const openPopup = (movie) => {
    setSelectedMovie(movie);
    // console.log(movie)
    setPopupVisible(true);
  };

  const closePopup = (event) => {
 
      setPopupVisible(false);
    
  };
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const calculateMovieScore = (movie) => {
    return movie.n_comment > 0
      ? Math.round(((movie.Score / movie.n_comment) / 10) * 100)
      : 0;
  };
  

  useEffect(() => {
    // Fetch movie genres from Firebase
    const fetchGenres = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'Movie Genre'),orderBy('MovieGenre')));
        const movieData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMovieGenres(movieData);
      } catch (error) {
        console.error('Error fetching movie genres:', error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let querySnapshot;
        if (selectedGenre.MovieGenre) {
          const q = query(
            collection(db, "Movies"),
            where("MovieGenres", "array-contains", {
              label: selectedGenre.MovieGenre,
              value: selectedGenre.id,
            })
          );
          querySnapshot = await getDocs(q);
        } else {
          const q = query(collection(db, "Movies"));
          querySnapshot = await getDocs(q);
        }
  
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          Score: parseFloat(doc.data().Score, 10),
        }));
        fetchedData.sort((a, b) => {
          return calculateMovieScore(b) - calculateMovieScore(a);
        });
        setData(fetchedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [selectedGenre]);
  

  const handleGenreChange = (event) => {
    const selectedGenreValue = event.target.value;
  
    if (selectedGenreValue === '') {
      setSelectedGenre({}); // or null if you prefer
    } else {
      const selectedGenreObject = JSON.parse(selectedGenreValue);
      setSelectedGenre(selectedGenreObject);
    }
  };

      const handleDeleteMovie = async (movieId) => {
        closePopup()
        return toast.promise(
          async (resolve) => {
        try {
            console.log(movieId);
            await deleteMovieInfoDB(movieId); // Use your delete function here
            console.log('delete successful')
        } catch (error) {
            console.error('Error deleting genre:', error);
        }
       },
       {
           pending: 'Deleting movie, please wait...', 
           success: 'Movie deleted successfully!', 
           error: 'Error deleting moive. Please try again later.', 
       }
   ).then(() => {
          setData((prevData) => prevData.filter((data) => data.id !== movieId));
          
   });
};
  return (
    <>
      <NavbarAdmin/>
      <div className={AdminManagementCss.container}>
       <div className={AdminManagementCss.selectbox}>
        <select
          value={selectedGenre ? JSON.stringify(selectedGenre) : ''}
          onChange={handleGenreChange}
          className={AdminManagementCss.dropdown}
        >
          <option value="">All Genres</option>
          {movieGenres.map((genre) => (
            <option key={genre.id} value={JSON.stringify(genre)}>
              {genre.MovieGenre}
            </option>
          ))}
        </select>
        
        <a className={AdminManagementCss.alinkbtn} href="/AddMovie">Add Movie</a>
        <a className={AdminManagementCss.alinkbtn} href="/addmoviegenre">Add Genres</a>
      </div>
      <div className={AdminManagementCss.warpper}>
        {isLoading ? (
              <span className={AdminManagementCss.loader}></span>
        ) : data.length===0?(
          <p>No movies found</p>
        ) : (
          <>
                    {itemsToDisplay.map((movie) => (
  <div key={movie.id} className={AdminManagementCss.content}>
    <Link to={`/FrontMovieDetail/${movie.id}`} >
      <img width={162} height={232} className={AdminManagementCss.img} src={movie.imageURL} alt={movie.MovieName} />
    </Link>
    <div className={AdminManagementCss.contentinfo}>
      <Link to={`/FrontMovieDetail/${movie.id}`} className={AdminManagementCss.contenttitle}>
        <p>
          {movie.MovieName.length > 15? 
          `${movie.MovieName.slice(0, 15)}...`
          : movie.MovieName}</p>
      </Link>
      <p className={AdminManagementCss.contentscore}>Score: {movie.n_comment > 0
                ? `${Math.round(((movie.Score / movie.n_comment) / 10) * 100)} %`
                : '0 %'}</p>
      <Link to={`/movieUpdateDetails/${movie.id}`} className={AdminManagementCss.contentbtnedit}>
        <FontAwesomeIcon icon={faPencil} />
      </Link>
      <button className={AdminManagementCss.contentbtndelete} onClick={() => openPopup(movie)}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  </div>
))}      
          </>
        )}
        </div>
        <div className={AdminManagementCss.pagination}>
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={ `${currentPage === page ? AdminManagementCss.activePage :'' } ${AdminManagementCss.button_next} ` }
            >
              {page}
            </button>
          ))}
        </div>
      </div>
      {isPopupVisible && (
      <div className={AdminManagementCss.allpage} id="popupcontainer">
      <div className={AdminManagementCss.containerpopup}>
      <div className={AdminManagementCss.popupTitle}>Delete Movie?</div>
      <div className={AdminManagementCss.popupline}></div>
      <div className={AdminManagementCss.popupcontent}>
        <label className={AdminManagementCss.popuptext}>Are you sure to delete "{selectedMovie.MovieName}"</label>
        <img
          src={selectedMovie.imageURL}
          className={AdminManagementCss.popupimg}
          alt="Movie Poster"
        />
      </div>
      <div className={AdminManagementCss.buttonsContainer}>
        <button className={AdminManagementCss.acceptbtn} onClick={() => handleDeleteMovie(selectedMovie.id)}>Yes</button>
        <button className={AdminManagementCss.rejectbtn} onClick={closePopup} >No</button>
      </div>
    </div>
    
    </div>
     )}
      <ToastContainer
                            position="top-center"
                            autoClose={1500}
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
  );
};

export default MovieManagement;
import React, { useState, useEffect } from 'react';
import movieCss from '../css/Movies.module.css'; 
import swipercss from "../css/swiper.module.css"
import { Link } from 'react-router-dom';
import Navbar from './nav';
import Footer from './footer';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Loading from './loading';
import AdminManagementCss from "../css/adminmanagement.module.css"
function Movies() {
    const [movieData, setMovieData] = useState([]);
    const [genreData, setGenreData] = useState([]);
    const [movieGenresSelect, setMovieGenresSelect] = useState('');
    const [selectedMovieRate, setSelectedMovieRate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 14;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const queryMovie = await getDocs(collection(db, 'Movies'));
          const queryGenre = await getDocs(collection(db, 'Movie Genre'));
          const fetchedDataMovie = queryMovie.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })).sort((a, b) => new Date(b.showdate) - new Date(a.showdate));
          const fetchedDataGenre = queryGenre.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })).sort((a, b) => a.MovieGenre.localeCompare(b.MovieGenre));

          setMovieData(fetchedDataMovie)
          setGenreData(fetchedDataGenre)
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        }
      };
      fetchData();
    }, []);

    const handleGenreChange = (event) => {
      const selectedGenreValue = event.target.value;

      if (selectedGenreValue === '') {
        setMovieGenresSelect('');
      } else {
        const selectedGenreObject = JSON.parse(selectedGenreValue);
        setMovieGenresSelect(selectedGenreObject);
      }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const filteredMovies = movieData.filter((movie) => {
        const isRateMatched = !selectedMovieRate || movie.Rate === selectedMovieRate;
        const isGenreMatched = !movieGenresSelect || movie.MovieGenres.some((genre) => genre.value === movieGenresSelect.id);
        return isRateMatched && isGenreMatched;
    });
    const moviesToDisplay = filteredMovies.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            
            {isLoading ? (
                <Loading/>
            ) : (
                <>
                <Navbar/>
                    <div className={movieCss.container}>
                        <h1 className={movieCss.TopText}>Movies in Theaters (2023)</h1>
                        <div className={movieCss.listsearch}>
                            <div className={movieCss.selectbox}>
                                <select className={movieCss.dropdown} onChange={(e) => setSelectedMovieRate(e.target.value)}>
                                    <option value="">Select Movie Rate</option>
                                    <option value="G">General Audiences (G)</option>
                                    <option value="PG">Parental Guidances Suggested (PG)</option>
                                    <option value="PG-13">Parents Strongly Cautioned (PG-13)</option>
                                    <option value="R">Restricted (R)</option>
                                    <option value="NC-17">No one 17 and under admitted (NC-17)</option>
                                </select>
                            </div>
                            <div className={movieCss.selectbox}>
                                <select
                                    value={movieGenresSelect ? JSON.stringify(movieGenresSelect) : ''}
                                    onChange={handleGenreChange}
                                    className={movieCss.dropdown}
                                >
                                    <option value="">All Genres</option>
                                    {genreData.map((genre) => (
                                        <option key={genre.id} value={JSON.stringify(genre)}>
                                            {genre.MovieGenre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className={movieCss.warpper}>
                            {moviesToDisplay.map((movie) => (
                                <Link to={`/FrontMovieDetail/${movie.id}`} className={swipercss.link} key={movie.id}>
                                    <div className={movieCss.content}>
                                        <img className={movieCss.img} src={movie.imageURL}/>
                                        <div className={movieCss.contentinfo}>
                                            <p className={movieCss.contentscore}>
                                                <FontAwesomeIcon icon={faStar} className={swipercss.dateicon}/> 
                                                {movie.n_comment > 0 ? `${Math.round(((movie.Score / movie.n_comment) / 10) * 100)} %`: '0 %'}</p>
                                            <p className={movieCss.contenttitle}>{movie.MovieName}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className={movieCss.pagination}>
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
                    <Footer/>
                </>
            )
            }
        </>
    );
}

export default Movies;

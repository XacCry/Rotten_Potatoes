import React, { useState, useEffect } from 'react';
import Navcss from "../css/nav.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faBars, faHome, faFilm, faRightFromBracket, faFilePen } from '@fortawesome/free-solid-svg-icons'
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { db } from '../firebase';
import "../css/swiper.css"
import { collection, getDocs } from 'firebase/firestore';

const Navbar = () => {
  const { user, userRole, logout, Username } = UserAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [value, setValue] = useState('');
  const [movieData, setMovieData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryMovie = await getDocs(collection(db, 'Movies'));
        const fetchedDataMovie = queryMovie.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })).sort((a, b) => new Date(b.showdate) - new Date(a.showdate));

        setMovieData(fetchedDataMovie)
        // console.log(fetchedDataMovie)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      console.log('You are logged out');
    } catch (e) {
      console.log(e.message);
    }
  };
  const handleSearchChange = (e, { value }) => {
    setIsLoading(true);
    setValue(value);
    setResults([]);
    const filteredMovies = movieData.filter(movie =>
      movie.MovieName.toLowerCase().includes(value.toLowerCase())
    );

    setResults(filteredMovies);
    setIsLoading(false);
  };

  const handleResultSelect = (e, { result }) => {
    setValue(result.title);
    navigate(`/FrontMovieDetail/${result.id}`);
    // console.log(result.id)
  };

  const CustomResultsRenderer = ({ title, description, image }) => (
    <div className="custom-search-result">
      <img src={image} alt="Result" className="custom-search-result-image" />
      <div className="custom-search-result-content">
        <div className="custom-search-result-title">{title}</div>
        <div className="custom-search-result-description">{description}</div>
      </div>
    </div>
  );

  return (
    <>
      <input type="checkbox" className={Navcss.menu} id="menuToggle" />
      <nav className={Navcss.nav}>
        <a href="/" className={Navcss.logoLink}>
          <img src="https://firebasestorage.googleapis.com/v0/b/auth-37d15.appspot.com/o/logo%2Fpotatologo.png?alt=media&token=e097befa-4975-4386-ba58-7b0751c52845" className={Navcss.logo} />
        </a>
        <Search input={{ icon: 'search', iconPosition: 'left', size: 'large', className: 'searchInput' }}
          placeholder='Search Movie'
          loading={isLoading}
          onResultSelect={handleResultSelect}
          onSearchChange={handleSearchChange}
          resultsRenderer={CustomResultsRenderer}
          results={results.map(movie => ({
            id: movie.id,
            title: movie.MovieName,
            description: movie.MovieGenres && movie.MovieGenres.length > 0
              ? movie.MovieGenres.map(genre => genre.label).join(', ')
              : 'N/A',
            image: movie.imageURL,
          }))}
          value={value}
          className={Navcss.search}
        />
        <label htmlFor="menuToggle" className={Navcss.bars}>
          <FontAwesomeIcon icon={faBars} />
        </label>
        <section className={Navcss.Topcontent}>
          <a href="../" className={Navcss.a}>Home</a>
          <a href="../Movies" className={Navcss.a}>Movies</a>
          {userRole === 'admin' ? (
            <>
              <a href="../movieManagement" className={Navcss.a}>Manage Movie</a>
            </>
          ) : (
            <></>
          )}
          {user ? (
            <>
              <a disabled className={Navcss.aname}>{Username}</a>
              <a disabled className={Navcss.a} onClick={handleLogout}>Logout</a>
            </>
          ) : (
            <a href="../Login" className={Navcss.a}>Login / Sign up</a>
          )
          }
        </section>
      </nav>
      <section className={Navcss.listpage}>
        <section className={Navcss.content}>
          <FontAwesomeIcon icon={faHome} className={Navcss.img} />
          <a href="../" className={Navcss.a}>Home</a>
        </section>
        <section className={Navcss.content}>
          <FontAwesomeIcon icon={faFilm} className={Navcss.img} />
          <a href="../Movies" className={Navcss.a}>Movies</a>
        </section>
        {userRole === 'admin' ? (
          <>
            <section className={Navcss.content}>
              <FontAwesomeIcon icon={faFilePen} className={Navcss.img} />
              <a href="../movieManagement" className={Navcss.a}>Manage Movie</a>
            </section>
          </>
        ) : (
          <></>
        )}

        <section className={Navcss.content}>
          <FontAwesomeIcon icon={faRightFromBracket} className={Navcss.img} />
          {user ? (
            <>
              <a disabled className={Navcss.aname}>{Username}</a>
              <a disabled className={Navcss.a} onClick={handleLogout}>Logout</a>
            </>
          ) : (
            <a href="../Login" className={Navcss.a}>Login / Sign up</a>
          )
          }
        </section>
      </section>

    </>
  )

}

export default Navbar;
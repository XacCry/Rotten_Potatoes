import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { uploadImage } from '../context/UploadImg';
import { doc, getDoc , getDocs , collection , updateDoc,query,orderBy } from 'firebase/firestore';
import AdminCss from "../css/admin.module.css"
import { MultiSelect } from 'react-multi-select-component';
import NavbarAdmin from "./navbaradmin";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateDetails = () => {
  const { id } = useParams(); 

  // const [isLoading, setIsLoading] = useState(true);
  const [trailer, setTrailer] = useState('')
  const [duration, setDuration] = useState(null)
  const [movieName, setMovieName] = useState('')
  const [movieInfo, setMovieInfo] = useState('')
  const [showDate, setShowDate] = useState(null)
  const [rate, setRate] = useState('')
  const [movieGenresSelect, setMovieGenresSelect] = useState([]);
  const [movieGenreData, setMovieGenreData] = useState([])
  const [actorData , setActorData] = useState([])
  const [actorSelect, setActorSelect] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [oldImage, setOldImage] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieDocRef = doc(db, 'Movies', id);
        const movieDocSnapshot = await getDoc(movieDocRef);
        const movieData = movieDocSnapshot.data();

        if (movieData) {
          setMovieName(movieData.MovieName)
          setMovieInfo(movieData.MovieInfo)
          setShowDate(movieData.ShowDate)
          setDuration(movieData.Duration)
          setTrailer(movieData.Trailer)
          setRate(movieData.Rate)
          setMovieGenresSelect(movieData.MovieGenres)
          setActorSelect(movieData.Actors)
          setOldImage(movieData.imageURL)
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id]); // Fetch movie details whenever the "id" parameter changes

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genreSnapshot = await getDocs(query(collection(db, 'Movie Genre'),orderBy('MovieGenre')));
        const genreDataDB = genreSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // movieData.sort((a, b) => a.MovieGenre.localeCompare(b.MovieGenre));

        const actorSnapshot = await getDocs(query(collection(db, 'Actor'),orderBy('Name')));
        const actorDataDB = actorSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMovieGenreData(genreDataDB);
        setActorData(actorDataDB);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const genrePattern = movieGenreData.map((genre) => ({
    label: genre.MovieGenre,
    value : genre.id
  }));

  const actorPattern = actorData.map((actor) =>({
    label: actor.Name,
    value : actor.id
  }))

  const handleImageSelection = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleUpdateMovie = async (event) => {
    event.preventDefault();
    return toast.promise(
      async (resolve) => {
        let imageURL = null;
        if (selectedImage) {
          imageURL = await uploadImage(selectedImage);
        } else {
          imageURL = oldImage;
        }
        const newDocRef = doc(db, "Movies", id);
        await updateDoc(newDocRef, {
          MovieName: movieName,
          MovieInfo: movieInfo,
          MovieGenres: movieGenresSelect,
          Actors: actorSelect,
          Duration: parseInt(duration),
          ShowDate: showDate,
          Rate: rate,
          Trailer: trailer,
          imageURL: imageURL,
        });
      },
      {
        pending: 'Update movie, please wait...',
        success: 'Update movie successfully!',
        error: 'Error updating movie. Please try again later.',
      }
    );
  };
  

  return (
    <>
    <NavbarAdmin />
    <form onSubmit={handleUpdateMovie}>
    <section class={AdminCss.warpper}>
        <section class={AdminCss.container}>
        <a href="/MovieManagement"class={AdminCss.gobackbtn}><FontAwesomeIcon icon={faArrowLeft} /></a>
          <header class={AdminCss.header}>Update Movie</header>
          <div class={AdminCss.form}>
          <div class={AdminCss.inputbox}>
              <label class={AdminCss.label}>Movie Name</label>
              <input class={AdminCss.input} pattern="[\w\s]{1,50}" type="text" placeholder="Loading..." value={movieName} onChange={(e) => setMovieName(e.target.value)} required />
            </div>

            <div class={AdminCss.inputbox}>
              <label class={AdminCss.label}>Movie Info</label>
              <input class={AdminCss.input} pattern='[\w\W]{2,600}' type="text" placeholder="Loading..." value={movieInfo} onChange={(e) => setMovieInfo(e.target.value)} required />
            </div>

            <div class={AdminCss.inputbox}>
              <label class={AdminCss.label}>Trailer</label>
              <input class={AdminCss.input} pattern="<iframe[\s\S]*<\/iframe>" type="text" placeholder="Loading..." value={trailer} onChange={(e) => setTrailer(e.target.value)} required />
            </div>

            <div class={AdminCss.column}>
              <div class={AdminCss.inputbox}>
                <label class={AdminCss.label}>Movie Duration</label>
                <input class={AdminCss.input} pattern="^(?:[1-9]|[1-2][0-9]|300)$" type="number" min="1" max="300" placeholder="Loading..." value={duration} onChange={(e) => setDuration(e.target.value)} required />
              </div>
              
              <div class={AdminCss.inputbox}>
                <label class={AdminCss.label}>Release Date</label>
                <input class={AdminCss.input} type="date" value={showDate} onChange={(e) => setShowDate(e.target.value)} placeholder="Loading..." required />
              </div>
            </div>

            <div class={AdminCss.inputbox}>
              <label class={AdminCss.label}>Select Genres</label>
              <MultiSelect
                options={genrePattern}
                value={movieGenresSelect}
                onChange={setMovieGenresSelect}
                labelledBy={"Select"}
                isCreatable={true}
              />
            </div>

            <div class={AdminCss.inputbox}>
              <label class={AdminCss.label}>Select Actor</label>
              <MultiSelect
                options={actorPattern}
                value={actorSelect}
                onChange={setActorSelect}
                labelledBy={"Select"}
                isCreatable={true}
              />
            </div>

            <div class={AdminCss.inputbox}>
              <label class={AdminCss.label}>Select Movie Rate</label>
              <div class={AdminCss.selectbox}>
                <select value={rate} onChange={(e) => setRate(e.target.value)} class={AdminCss.dropdown}>
                  <option value="">Select Movie Rate</option>
                  <option value="G">General Audiences (G)</option>
                  <option value="PG">Parental Guidances Suggested (PG)</option>
                  <option value="PG-13">Parents Strongly Cautioned (PG-13)</option>
                  <option value="R">Restricted (R)</option>
                  <option value="NC-17">No one 17 and under admitted (NC-17)</option>
                </select>
              </div>
            </div>

            <div class={AdminCss.inputbox}>
              <label class={AdminCss.label}>Movie Image</label>
              <input onChange={handleImageSelection} type="file" class={AdminCss.inputfile}/>
            </div>
            <button type="submit" class={AdminCss.addmovie}>Update Movie</button>
            </div>
        </section>
      </section>
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
    </>
  );
};

export default UpdateDetails;
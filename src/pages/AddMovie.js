import React, { useState, useEffect } from "react";
import { uploadImage } from '../context/UploadImg';
import { addMovieInfoDB } from "../context/addMovieInfo";
import { db } from '../firebase';
import { collection, getDocs ,orderBy, query} from 'firebase/firestore';
import AdminCss from "../css/admin.module.css"
import { MultiSelect } from 'react-multi-select-component';
import NavbarAdmin from "./navbaradmin";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AddMovie = () => {

  const [movieName, setMovieName] = useState('')
  const [movieInfo, setMovieInfo] = useState('')
  const [movieGenresSelect, setMovieGenresSelect] = useState([]);
  const [movieGenreData, setMovieGenreData] = useState([])
  const [actorData , setActorData] = useState([])
  const [actorSelect, setActorSelect] = useState([]);
  const [duration, setDuration] = useState(null)
  const [showDate, setShowDate] = useState(null)
  const [rate, setRate] = useState('')
  const [trailer, setTrailer] = useState('')
  const [selectedImage, setSelectedImage] = useState(null);


  const handleImageSelection = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genreSnapshot = await getDocs(query(collection(db, 'Movie Genre'),orderBy('MovieGenre')));
        const genreDataDB = genreSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

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

const handleUploadMovie = (event) => {
  event.preventDefault();
    const validateFields = () => {
        if (
            movieName === '' ||
            movieInfo === '' ||
            movieGenresSelect.length === 0 ||
            actorSelect.length === 0 ||
            duration === '' ||
            showDate === null ||
            rate === '' ||
            trailer === '' ||
            selectedImage === null
        ) {
            toast.error('Please fill in all the fields.', {
                position: 'top-center',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: 0,
                theme: 'light',
            });
            return false;
        }
        return true;
    };

    if (!validateFields()) {
        return; 
    }

    return toast.promise(
        async (resolve) => {
            try {
                let imageURL = await uploadImage(selectedImage);

                const data = {
                    MovieName: movieName,
                    MovieInfo: movieInfo,
                    MovieGenres: movieGenresSelect,
                    Actors: actorSelect,
                    Duration: parseInt(duration),
                    ShowDate: showDate,
                    Rate: rate,
                    Trailer: trailer,
                    imageURL: imageURL,
                    Score: 0,
                    n_comment: 0
                };

                await addMovieInfoDB(data);
              
            } catch (error) {
                console.error('Error uploading image or adding movie info:', error);

            }
        },
        {
            pending: 'Adding movie, please wait...',
            success: 'Movie added successfully!',
            error: 'Error adding movie. Please try again later.',
            autoClose: 1500, 
            closeOnClick: true,
        }
    ).then(() => {
      const fileInputContainer = document.getElementById('fileinput');
      fileInputContainer.value = ''; // Clear the file input value
      const filedateContainer = document.getElementById('moviedate');
      filedateContainer.value = ''; // Clear the file input value
      setMovieName('');
      setMovieInfo('');
      setMovieGenresSelect([]);
      setActorSelect([]);
      setDuration('');
      setShowDate(null);
      setRate('');
      setTrailer('');
      setSelectedImage(null);
    });
};


  const genrePattern = movieGenreData.map((genre) => ({
    label: genre.MovieGenre,
    value : genre.id
  }));

  const actorPattern = actorData.map((actor) =>({
    label: actor.Name,
    value : actor.id
  }))

  return (
    <>
      <NavbarAdmin />
    <form onSubmit={handleUploadMovie}>
      <section class={AdminCss.warpper}>
        <section class={AdminCss.container}>
        <a href="/MovieManagement"class={AdminCss.gobackbtn}><FontAwesomeIcon icon={faArrowLeft} /></a>
          <header class={AdminCss.header}>Add Movie</header>
          <div class={AdminCss.form}>
            <div class={AdminCss.inputbox}>
              <label class={AdminCss.label}>Movie Name</label>
              <input class={AdminCss.input} pattern="[\w\s]{1,50}" type="text" placeholder="Enter Movie Name" value={movieName} onChange={(e) => setMovieName(e.target.value)} required />
            </div>

            <div class={AdminCss.inputbox}>
              <label class={AdminCss.label}>Movie Info</label>
              <input class={AdminCss.input} pattern="[\w\s]{2,600}" type="text" placeholder="Enter Movie Info" value={movieInfo} onChange={(e) => setMovieInfo(e.target.value)} required />
            </div>

            <div class={AdminCss.inputbox}>
              <label class={AdminCss.label}>Trailer</label>
              <input class={AdminCss.input} pattern="<iframe[\s\S]*<\/iframe>" type="text" placeholder="Enter Trailer" value={trailer} onChange={(e) => setTrailer(e.target.value)} required/>
            </div>

            <div class={AdminCss.column}>
              <div class={AdminCss.inputbox}>
                <label class={AdminCss.label}>Movie Duration</label>
                <input class={AdminCss.input} pattern="^(?:[1-9]|[1-2][0-9]|300)$" type="number" min="1" max="300" placeholder="Enter Movie Duration" value={duration} onChange={(e) => setDuration(e.target.value)} required />
              </div>
              
              <div class={AdminCss.inputbox}>
                <label class={AdminCss.label}>Release Date</label>
                <input class={AdminCss.input} type="date" value={showDate} onChange={(e) => setShowDate(e.target.value)} id="moviedate" required />
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
              <input onChange={handleImageSelection} type="file" class={AdminCss.inputfile} id="fileinput" />
            </div>

            <button type="submit" class={AdminCss.addmovie}>Add Movie</button>
          </div>
        </section>
      </section>
      </form>
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
  )

}

export default AddMovie;


import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import 'swiper/css/bundle';
import "../css/swiper.css"
import { Swiper, SwiperSlide } from 'swiper/react';
import swipercss from "../css/swiper.module.css"
import listcss from "../css/list.module.css"
import Navbar from './nav';
import Footer from './footer';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPlayCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import MovieRecommendStyles from "../css/movieRecommend.module.css";
import Loading from './loading';

const HomePage = () => {

    const [movieData, setMovieData] = useState([])
    const [rand, setRand] = useState()
    const [movieSortShowDate, setmovieSortShowDate] = useState([])//เทียบกับวันที่ปัจจุบัน ถ้าหนังฉายไปแล้ว จะไม่เเสดง
    const [randMovieGenre,setRandMovieGenre] = useState([])
    const [movieSortScore, setmovieSortScore] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [randomMovie, setRandomMovie] = useState(null);
    const [videoId, setVideoId] = useState(null); 
    
  const formatDateToEnglish = (dateString) => {
    const options = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };
  
    useEffect(() => {
      const fetchData = async () => {
        let random = Math.floor(Math.random() * 3)
        try {
          let MovieGenre,id;
          const querySnapshot = await getDocs(collection(db, 'Movies'));
          const currentDate = new Date();
          const fetchedData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const upcomingMovies = fetchedData.filter((movie) => {
            const showDate = new Date(movie.ShowDate);
            return showDate > currentDate;
          });

          const sortedByScore = [...fetchedData].sort((a, b) => {
            const scoreA = a.n_comment > 0 ? ((a.Score / a.n_comment) / 10) * 100 : 0;
            const scoreB = b.n_comment > 0 ? ((b.Score / b.n_comment) / 10) * 100 : 0;
          
            return scoreB - scoreA;
          });
          
          const top10Movies = sortedByScore.slice(0, 10);
          

          if(random==0){
            MovieGenre = 'Horror'
            id = 'yeJc9PjMwbKFKcQi6COU'
          }else if(random==1){
            MovieGenre = 'Action'
            id = 'KKimddkY99kOYVuWIBTZ'
          }else{
            MovieGenre = 'Drama'
            id = 'S95VPUWJQDnoKJ18ba0v' 
          }
          const genreMovies = fetchedData.filter((movie) => {
            return movie.MovieGenres.some(
              (genre) => genre.label === MovieGenre && genre.value === id
            );
          });
          const randomMovie = fetchedData[Math.floor(Math.random() * fetchedData.length)];
          setRandomMovie(randomMovie);
          const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
          const videoId = randomMovie.Trailer.match(regex)[1];
          setVideoId(videoId);
          // console.log(randomMovie)
          setRand(random)
          setMovieData(fetchedData);
          setmovieSortScore(top10Movies);
          setmovieSortShowDate(upcomingMovies);
          // console.log(genreMovies);
          setRandMovieGenre(genreMovies);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        }
      };
      fetchData();
    }, []);

    const breakpoints = {
      768: {
        width: 768,
        slidesPerView: 2,
      },
      1024: {
        width: 1024,
        slidesPerView: 6,
        },
      };
      const convertMinutesToHoursAndMinutes = (durationInMinutes) =>{
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;
        return `${hours}h ${minutes}m`;
      }
  return (
    <>
    {isLoading?(
      <Loading/>
    ):(
      <>
      <Navbar/>
      {/* Movie Recommend Start */}

      <div className={MovieRecommendStyles.container}>
      <img className={MovieRecommendStyles.img} src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} />
      <div className={MovieRecommendStyles['text-container']}>
        <div className={MovieRecommendStyles.MovieRecom}>Movie Recommendation</div>
        <div className={MovieRecommendStyles.Title}>{randomMovie.MovieName}</div>
        <div className={MovieRecommendStyles.Duration}><FontAwesomeIcon icon={faPlayCircle} className={MovieRecommendStyles.icon}/>{convertMinutesToHoursAndMinutes(randomMovie.Duration)}</div>
        <div className={MovieRecommendStyles.MovieInfo}>
        {randomMovie.MovieInfo}
        </div>
        <Link to={`/FrontMovieDetail/${randomMovie.id}`} >
        <a className={MovieRecommendStyles.whatmorebtn}>Watch more</a>
        </Link>
      </div>
    </div>

      {/* Movie Recommend end */}
  {/* ------------------------------------------- start slider new up coming ------------------------------------------- */}
      
    <div class={swipercss.container}>
        <div class={swipercss.containerforthetitle}><div className={swipercss.vl}><h2 class={swipercss.Titleofthecontent}>NEW & UPCOMING MOVIES IN THEATERS</h2></div></div>
    <Swiper
       className={swipercss.swiper}
       modules={[Navigation, Scrollbar]}
       navigation
       scrollbar={{ draggable: true }}
       breakpoints={breakpoints}
    >
      {movieSortShowDate.map((movie) => (
        <SwiperSlide key={movie.id} className={swipercss.slide}>
          <div className={swipercss.warpper}>
          <Link to={`/FrontMovieDetail/${movie.id}`} className={swipercss.link}>
            <img className={swipercss.coverimg} src={movie.imageURL} />
            <div className={swipercss.content}>
              <div className={swipercss.score}>
                <FontAwesomeIcon icon={faCalendar} className={swipercss.dateicon} />
                <p className={swipercss.datetext}>
                        {formatDateToEnglish(movie.ShowDate)}
                      </p>
              </div>
              <p className={swipercss.Title}>{movie.MovieName}</p>
            </div>
            </Link>
          </div>
        </SwiperSlide>
      ))}    
    </Swiper>
    </div>
     {/* ------------------------------------------- end slider  ------------------------------------------- */}



 {/* ------------------------------------------- start slider Top Score  ------------------------------------------- */}

 <div class={swipercss.container}>
  {rand==0?(
        <div class={swipercss.containerforthetitle}><div className={swipercss.vl}><h2 class={swipercss.Titleofthecontent}>BEST HORROR MOVIES</h2></div><a href="movies" className={swipercss.alinkViewall}>View All</a></div>
  ):rand==1?(
    <div class={swipercss.containerforthetitle}><div className={swipercss.vl}><h2 class={swipercss.Titleofthecontent}>BEST ACTION MOVIES</h2></div><a href="movies" className={swipercss.alinkViewall}>View All</a></div>
  ):(
    <div class={swipercss.containerforthetitle}><div className={swipercss.vl}><h2 class={swipercss.Titleofthecontent}>BEST DRAMA MOVIES</h2></div><a href="movies" className={swipercss.alinkViewall}>View All</a></div>
  )}
   <Swiper
       className={swipercss.swiper}
       modules={[Navigation, Scrollbar]}
       navigation
       scrollbar={{ draggable: true }}
       breakpoints={breakpoints} 
    >
      {randMovieGenre.map((movie)=>(
        <SwiperSlide key={movie.id} className={swipercss.slide}>
          <div className={swipercss.warpper}> 
          <Link to={`/FrontMovieDetail/${movie.id}`} className={swipercss.link}>
            <img class={swipercss.coverimg} src={movie.imageURL}/>
             <div class={swipercss.content}>
              <div class={swipercss.score}> <FontAwesomeIcon icon={faStar} className={swipercss.dateicon} /><p class={swipercss.datetext}> {movie.n_comment > 0
                ? `${Math.round(((movie.Score / movie.n_comment) / 10) * 100)} %`
                : '0 %'}</p></div>
            <a class={swipercss.Title}>{movie.MovieName}</a>
          </div>
          </Link>
        </div>
      </SwiperSlide>
      ))}
    </Swiper>
    </div>
       {/* ------------------------------------------- end slider  ------------------------------------------- */}

          {/* ------------------------------------------- start list  ------------------------------------------- */}

    <div class={listcss.container}>
        <div class={listcss.Titleheader}>
            <div class={listcss.vl}><h2 class={listcss.Title}>POPULAR MOVIES ALL THE TIME</h2></div>
            <a href="Movies"class={listcss.more}>View All</a>
        </div>
        {movieSortScore.map((movie)=>(
          <>            
          <div class={listcss.listitem} key={movie.id}>
          <Link to={`/FrontMovieDetail/${movie.id}`}  class={listcss.text}>
            <p> {movie.MovieName}</p>
            </Link>
            <Link to={`/FrontMovieDetail/${movie.id}`} >
            <p class={listcss.number}>{movie.n_comment > 0
                ? `${Math.round(((movie.Score / movie.n_comment) / 10) * 100)} %`
                : '0 %'}</p>
            </Link>
            
          </div>
          <hr class={listcss.hl}/>
          </> 
        ))}

    </div>
            {/* ------------------------------------------- end list  ------------------------------------------- */}

            <Footer/>
      </>
    )}
    </>
  )

}

export default HomePage;
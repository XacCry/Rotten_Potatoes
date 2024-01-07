import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import comment from "../css/comment.module.css"
import Navbar from './nav';
import { useParams } from 'react-router-dom';
import { doc, getDoc, getDocs, collection, updateDoc, query, orderBy, where } from 'firebase/firestore';
import Footer from './footer';
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext';
import Rating from '@mui/material/Rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { addCommentDB } from '../context/addMovieInfo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './loading';

const CommentPage = () => {
  const { id } = useParams();
  const { user } = UserAuth();
  const navigate = useNavigate('')

  const [trailer, setTrailer] = useState('')
  const [duration, setDuration] = useState(null)
  const [score, setScore] = useState(null)
  const [numbercomment, setnumbercomment] = useState(null)
  const [movieName, setMovieName] = useState('')
  const [movieInfo, setMovieInfo] = useState('')
  const [showDate, setShowDate] = useState(null)
  const [rate, setRate] = useState('')
  const [nComment, setNComment] = useState(0)
  const [movieGenreData, setMovieGenre] = useState([])
  const [actorData, setActors] = useState([])
  const [imageURL, setImageURL] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [movieComment, setMovieComment] = useState([{}])
  const [usercomment, setusercomment] = useState('')
  const [newComment, setNewComment] = useState('')
  const [star, setStar] = useState(0)
  const [isPopupVisible, setPopupVisible] = useState(false);

  const ratingChanged = (newRating) => {
    setStar(newRating.target.value)
  };


  const openPopup = (comment) => {
    setPopupVisible(true);
  };

  const closePopup = (event) => {
 
    setPopupVisible(false);
  
};

  useEffect(() => {
    const fetchMovieDetails = async () => {

      try {
        // Fetch movie details based on the "id" parameter
        const UserComment = [];
        const movieDocRef = doc(db, 'Movies', id);
        const movieDocSnapshot = await getDoc(movieDocRef);
        const movieData = movieDocSnapshot.data();

        const qComment = query(collection(db, "comment"), where("movie_id", "==", id))
        const commentSnapshot = await getDocs(qComment)
        const fetchComment = commentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        const actorIds = movieData.Actors.map(actor => actor.value);
        const actorPromises = actorIds.map(async actorId => {
          const actorDocRef = doc(db, 'Actor', actorId);
          const actorDocSnapshot = await getDoc(actorDocRef);
          const actorData = actorDocSnapshot.data();
          return actorData;
        });

        const actor = await Promise.all(actorPromises);

        const userPromises = fetchComment.map(async (docuser) => {
          const userDocRef = doc(db, 'user', docuser.user_id);
          const userDocSnapshot = await getDoc(userDocRef);
          const userData = userDocSnapshot.data();
          return {
            id: docuser.id,
            comment: docuser.comment,
            user: userData.name,
            user_id: docuser.user_id,
            user_score: docuser.user_score,
          };
        });

        const userCommentData = await Promise.all(userPromises);
        UserComment.push(...userCommentData);
        console.log(UserComment)

        if (movieData) {
          setMovieName(movieData.MovieName)
          setMovieInfo(movieData.MovieInfo)
          setShowDate(movieData.ShowDate)
          setDuration(movieData.Duration)
          setRate(movieData.Rate)
          setMovieGenre(movieData.MovieGenres)
          setImageURL(movieData.imageURL)
          setScore(movieData.Score)
          setnumbercomment(movieData.n_comment)
          setTrailer(movieData.Trailer)
          setNComment(movieData.n_comment)
        }
        setMovieComment(UserComment)

        const userComments = UserComment.filter(comment => comment.user_id === user.uid);
        console.log(userComments)
        setusercomment(userComments)
        setActors(actor);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, movieComment]);

  const modifyTrailer = (iframeContent) => {
    const widthModified = iframeContent.replace(/width="\d+"/, `width="100%"`);
    const heightModified = widthModified.replace(/height="\d+"/, `height="500px"`);
    return heightModified;
  };

  const modifiedTrailer = modifyTrailer(trailer);

  const convertMinutesToHoursAndMinutes = (durationInMinutes) => {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  const formatDateToEnglish = (dateString) => {
    const options = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };


  const handleComment = async () => {

    let check = false;
    if (user) {
      if (!newComment || star === 0) {
        toast.error('Please provide both comment and rating.', {
          position: 'top-center',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: 0,
          theme: 'light',
        });
        return;
      }
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;

      movieComment.map((comm) => {
        if (user.uid == comm.user_id) {
          check = true
        }
      })

      if (check == false) {
        return toast.promise(
          async (resolve) => {
        try {
          const data = {
            comment: newComment,
            commentDate: formattedDate,
            movie_id: id,
            user_id: user.uid,
            user_score: star* 2
          }
          console.log(data)
          await addCommentDB(data);
      

            // setMovieComment((prevComments) => [...prevComments, data]);
            setNewComment('');
            setStar(0);
            document.getElementById('commentarea').value=''

          // let newscore = (score + star* 2) / (nComment + 1)

          const scoreRef = doc(db, "Movies", id)
          await updateDoc(scoreRef, {
            Score: (score + star* 2),
            n_comment: nComment + 1
          });
          console.log(movieComment)
        } catch (error) {
          console.error('Error add comment:', error);
        }    },
        {
          pending: 'Adding comment, please wait...',
          success: 'Comment added successfully!',
          error: 'Error adding comment. Please try again later.',
        }
      )
      } else {
        openPopup();
        return;
      }

    } else {
      toast.error('You need to login first!', {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

delay(2000).then(() => {
  navigate("/login");
});
    }



  }

  const UpdateScore = async () => {
    return toast.promise(
      async (resolve) => {
    try {
      const movieRef = doc(db, 'Movies', id);
      await updateDoc(movieRef, {
        Score: score - (usercomment[0]?.user_score) + (star * 2),
      });
  
      const commentRef = doc(db, 'comment', usercomment[0].id);
      await updateDoc(commentRef, {
        comment : newComment,
        user_score: star * 2,
      });
      setNewComment('');
      setStar(0);
      document.getElementById('commentarea').value=''
  
      console.log('Score updated successfully.');
    } catch (error) {
      console.error('Error updating score and comment:', error);
    }
     },
      {
        pending: 'Update comment, please wait...',
        success: 'Comment updated successfully!',
        error: 'Error update comment. Please try again later.',
      }).then(() => {
        {
         closePopup()
       }
   });
  };
  



  return (
    <>
    {isLoading?(
      <Loading/>
    ):(
      <>
      <Navbar />
      <div className={comment.container_movie}>
        <div className={comment.main_comment}>
          <div className={comment.grid_img}>
            <div dangerouslySetInnerHTML={{ __html: modifiedTrailer }} />
            <div className={comment.grid_img_name}>
              <div className={comment.rate_movie}>
                <img className={comment.img_show_top} src={imageURL} />
              </div>
              <div className={comment.rate_movie}>
                <h2>{movieName}</h2>
                <h3>
                  {showDate ? showDate.split('-')[0] : 'Year not available'},{' '}
                  {movieGenreData.map((genre) => genre.label).join(', ')}, {convertMinutesToHoursAndMinutes(duration)}
                </h3>
                <h1>
                  {numbercomment > 0
                    ? `${Math.round(((score / numbercomment) / 10) * 100)} %`
                    : '0 %'
                  }
                </h1>

              </div>
            </div>
            <h3 className={`${comment.margin_top30} ${comment.vl_s}`}>RATE AND REVIEW</h3>
            <div className={`${comment.comment_rate_movie}  ${comment.margin_top30}`}>
              <div className={`${comment.slidecontainer}`}>
                <Rating name="half-rating" defaultValue={0} value={star} precision={0.5} size="large" onChange={ratingChanged} />
                <br />
                <br />
              </div>
              <textarea
                onChange={(e) => setNewComment(e.target.value)}
                className={`${comment.rate_and_review_widget__textbox_textarea}`}
                placeholder="What did you think of the movie? (optional)"
                id='commentarea'
              ></textarea>
              <br />
              <button className={comment.alinkbtn}  onClick={handleComment}>Comment</button>
            </div>

            {isPopupVisible && (
      <div className={comment.allpage} id="popupcontainer">
      <div className={comment.containerpopup}>
      <div className={comment.popupTitle}>Update Comment?</div>
      <div className={comment.popupline}></div>
      <div className={comment.popupcontent}>
        <label className={comment.popuptext}>Are you sure to Update From this comment ?</label>
        <label className={comment.popuptext}>"{usercomment[0]?.comment}"</label>
        <label className={comment.popuptext}>To</label>
        <label className={comment.popuptext}>"{newComment}"</label>
      </div>
      <div className={comment.buttonsContainer}>
        <button className={comment.acceptbtn} onClick={UpdateScore}>Yes</button>
        <button className={comment.rejectbtn}  onClick={closePopup}  >No</button>
      </div>
    </div>
    
    </div>
     )}


            <h3 className={`${comment.margin_top30} ${comment.vl_s}`}>MOVIE INFO</h3>
            <h5><bold className={`${comment.margin_top30} ${comment.font_we}`} >Rating : </bold> {rate} </h5>
            <h5><strong className={`${comment.margin_top30} ${comment.font_we}`} >Movie Genre : </strong>  {movieGenreData.map((genre) => genre.label).join(', ')}</h5>
            <h5><strong className={`${comment.margin_top30} ${comment.font_we}`} >Release Date  : </strong>{formatDateToEnglish(showDate)}</h5>




            <h5 className={`${comment.margin_top30}`}>{movieInfo}</h5>

            <h3 className={`${comment.margin_top30} ${comment.vl_s}`} >CAST & CREW </h3>

            <div className={comment.scrollmenu}>
  {actorData.map((actor) => (
    <div key={actor.id} className={comment.actorItem}>
      <img src={actor.ActorImage} alt={actor.Name} className={comment.imgnewmovietop} />
      <h5 className={comment.textaligncenter}>{actor.Name}</h5>
    </div>
  ))}
</div>



            <h3 className={`${comment.margin_top30} ${comment.vl_s}`} >CRITIC REVIEWS FOR {movieName}</h3>

            <div className={`${comment.comment_movie} ${comment.margin_top30}`}>

              {movieComment.map((comm) => (
                <div key={comm.id} className={comment.comment_block}>
                  <div className={comment.border_comment}>
                    <FontAwesomeIcon icon={faCircleUser} /> : {comm.user} <br />
                    <span className={comment.comment}>{comm.comment}</span>
                  </div>
                </div>
              ))}


            </div>
          </div>

        </div>
      </div>
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
      <Footer />
      </>
    )}

    </>

  )

}

export default CommentPage;
import { db } from '../firebase';
import { collection, deleteDoc , doc,  getDocs, query, updateDoc, where , deleteField ,getDoc} from 'firebase/firestore';

const deleteMovieInfoDB = async (data) => {
    try{
        await deleteCommentOnMovieDelete(data)
        await deleteDoc(doc(db, "Movies", data));
        console.log('Movie info deleted from Firestore successfully');
    } catch (error){
        console.error('Error deleted movie info from Firestore:', error);
    }
  };

const deleteCommentOnMovieDelete = async (data) =>{
    try{
        const querySnapshot = await getDocs(query(collection(db,"comment"),where("movie_id","==",data)))
        querySnapshot.forEach(async (doc)=>{
            await deleteDoc(doc.ref);
        });
        console.log('Comment deleted successfully');
    }catch(error){
        console.error('Error deleting comment:', error);
    }
}

const deleteMovieGenreDB = async (data) =>{
    try {
        await changeMovieGenreInMovieTable(data)
        await deleteDoc(doc(db, "Movie Genre", data.id));
        console.log('Movie Genre deleted from Firestore successfully');
    }catch(error){
        console.error('Error deleting Genre:', error);
    }
}

const changeMovieGenreInMovieTable = async (genre) =>{
    const option = {
        label: 'ZZZ',
        value : 'opz2jtBSDFq6Qwme6X7Y'
    }
    try{
        const querySnapshot = await getDocs(query(collection(db,"Movies"),where("MovieGenres","array-contains",{ label: genre.MovieGenre , value: genre.id})))
        querySnapshot.forEach(async (doc) => {
            const movieRef = doc.ref;
      
            try {
              // Get the current MovieGenres array
              const currentGenres = doc.data().MovieGenres;
      
              // Find the index of the genre you want to change
              const indexToChange = currentGenres.findIndex(
                (e) => e.label === genre.MovieGenre && e.value === genre.id
              );
      
              if (indexToChange !== -1) {
                // Replace the genre at the found index with the new genre option
                currentGenres[indexToChange] = option;
      
                // Update the document with the modified MovieGenres array
                await updateDoc(movieRef, {
                  MovieGenres: currentGenres,
                });
      
                console.log('Update MovieGenre in that movie success');
              }
            } catch (error) {
              console.log('Update MovieGenre in that movie fail', error);
            }
          });
    }catch(error){
        console.error('Error Change Genre:', error);
    }
}

const deleteCommentDB = async (commentID) =>{
    try{
      // console.log(commentID)
        await updateScoreandnumbercomment(commentID)
        console.log('Comment deleted from Firestore successfully');
    }catch(error){
        console.error('Error deleted comment from Firestore:', error);
    }
}

const updateScoreandnumbercomment = async (commentID) =>{
  try {
    const commentDocRef = doc(db, "comment", commentID);
    const commentSnapshot = await getDoc(commentDocRef);

    if (commentSnapshot.exists()) {
      const commentData = commentSnapshot.data();
      const movieID = commentData.movie_id;
      const nScore = commentData.user_score;

      // Get the current movie document
      const movieDocRef = doc(db, "Movies", movieID);
      const movieSnapshot = await getDoc(movieDocRef);

      if (movieSnapshot.exists()) {
        const movieData = movieSnapshot.data();
        const currentNComment = movieData.n_comment;
        const currentScore = movieData.Score;
        console.log(commentData)
        console.log(movieData)
        // Update n_comment and score fields
        await updateDoc(movieDocRef, {
          n_comment: currentNComment - 1,
          Score: currentScore - nScore,
        });
        await deleteDoc(doc(db, "comment", commentID));

        console.log("Movie document updated successfully!");
      } else {
        console.log("Movie document does not exist!");
      }
    } else {
      console.log("Comment document does not exist!");
    }
  } catch (error) {
    console.error("Error updating movie document:", error);
  }


}
const deleteActorInfoDB = async (actorId,actorName) =>{
    try{
        await deleteActorInMovieOnActorDeleted(actorId,actorName)
        await deleteDoc(doc(db,'Actor',actorId))
        console.log('Actor deleted from Firestore successfully');
    }catch(error){
        console.error('Error deleted actor from Firestore:', error);
    }
}

const deleteActorInMovieOnActorDeleted = async (actorId,actorName) =>{
    try{
        const q = query(collection(db,'Movies'),
        where("Actors",'array-contains',{label: actorName , value: actorId}))
        const querySnapshot = await getDocs(q)
    
        querySnapshot.forEach(async (doc) => {
            const movieRef = doc.ref;
      
            try {
              // Get the current MovieGenres array
              const currentActors = doc.data().Actors;
      
              // Find the index of the genre you want to change
              const indexToDelete  = currentActors.findIndex(
                (e) => e.label === actorName && e.value === actorId
              );
      
              if (indexToDelete !== -1) {
      
                const updatedActors = [...currentActors.slice(0, indexToDelete), ...currentActors.slice(indexToDelete + 1)];
                
                await updateDoc(movieRef, {
                    Actors: updatedActors,
                  });
      
                console.log('Delete Actor in that movie success');
              }
            } catch (error) {
              console.log('Update MovieGenre in that movie fail', error);
            }
          });
    }catch(error){
    console.error('Error Change Genre:', error);
    }   
}



export { deleteMovieInfoDB , deleteMovieGenreDB , deleteCommentDB , deleteActorInfoDB};
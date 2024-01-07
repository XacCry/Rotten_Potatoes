import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

const addMovieInfoDB = async (data) => {
    try{
      const newDocRef = collection(db,'Movies');
      await addDoc(newDocRef,data);
      console.log('Movie info added to Firestore successfully');
    } catch (error){
      console.error('Error adding movie info to Firestore:', error);
    }
  };

  const addActorDB = async (data) => {
    try{
      const newDocRef = collection(db,'Actor');
      await addDoc(newDocRef,data);
      console.log('Actor added to Firestore successfully');
    } catch (error){
      console.error('Error adding Actor to Firestore:', error);
    }
  };


  const addMovieGenreDB = async (data) => {
    try{
      const newDocRef = collection(db,'Movie Genre');
      await addDoc(newDocRef,data);
      console.log('Movie genre added to Firestore successfully');
    } catch (error){
      console.error('Error adding movie genre to Firestore:', error);
    }
};

  const addCommentDB = async (data) =>{
    try{
      const newDocRef = collection(db,'comment')
      await addDoc(newDocRef,data);
      console.log('Comment added to Firestore successfully');
    }catch(error){
      console.error('Error adding Comment to Firestore:', error);
    }
  }

  export { addMovieInfoDB , addActorDB , addMovieGenreDB , addCommentDB};
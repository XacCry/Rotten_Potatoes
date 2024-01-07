import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const uploadImage = async (file) => {
  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);

  const imageURL = await getDownloadURL(storageRef);
  console.log(imageURL)
  return imageURL;
};

const uploadActorImage = async (file) => {
  const storageRef = ref(storage, `Actor/${file.name}`);
  await uploadBytes(storageRef, file);

  const imageURL = await getDownloadURL(storageRef);
  return imageURL;
};

export { uploadImage , uploadActorImage};
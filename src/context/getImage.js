import { storage } from '../firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

const getImageUrls = async () => {
  const imagesRef = ref(storage, 'images');
  const imageUrls = [];

  try {
    const imageList = await listAll(imagesRef);
    for (const imageItem of imageList.items) {
      const url = await getDownloadURL(imageItem);
      imageUrls.push(url);
    }
  } catch (error) {
    console.error('Error getting image URLs:', error);
  }

  return imageUrls;
};

export { getImageUrls };
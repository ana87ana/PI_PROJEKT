<template>
  <div>
    <h1>Some new songs to listen to!</h1>
    <div v-if="songs.length === 0">
      No songs found for the selected mood and occasion.
    </div>
    <div v-else class="songs-list">
      <div v-for="(song, index) in songs" :key="index" class="song-item">
        <div class="song-header">
          <h2>{{ song.name }}</h2>
          <p>{{ song.artist }}</p>
          <div class="actions">
            <span class="heart" @click="addToTopTen(song)">❤️</span>
            <div class="stars">
              <span v-for="star in 5" :key="star" class="star" :class="{ active: song.rating >= star }" @click="rateSong(song, star)">★</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="account-link">
      <router-link to="/account">
        <div class="circle"></div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { arrayUnion } from 'firebase/firestore';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const songs = ref([]);
    const db = getFirestore();

    onMounted(async () => {
      const mood = new URLSearchParams(window.location.search).get('mood');
      const occasion = new URLSearchParams(window.location.search).get('occasion');

      console.log('Mood:', mood);
      console.log('Occasion:', occasion);

      if (!mood || !occasion) {
        console.error('Mood or occasion is missing from the URL parameters');
        return;
      }

      try {
        const q = query(
          collection(db, 'pjesme'),
          where('mood', '==', mood),
          where('occasion', '==', occasion)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.warn('No matching documents found.');
        }

        querySnapshot.forEach((doc) => {
          console.log('Document data:', doc.data());
          songs.value.push({ id: doc.id, ...doc.data() });
        });
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    });

    const addToTopTen = async (song) => {
  try {

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No user is logged in');
    }

    const songRef = doc(db, 'pjesme', song.id);
    const usersCollectionRef = collection(db, 'korisnik');
    
    const q = query(usersCollectionRef, where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);
    
    const userDoc = querySnapshot.docs[0];
    const userRef = userDoc.ref;

    await updateDoc(userRef, {
      song_id: arrayUnion(songRef) 
    });
    
    alert('Added to top 10!');
  } catch (error) {
    console.error('Error adding to top 10:', error);
    alert('Error adding to top 10: ' + error.message);
  }
};


    const rateSong = async (song, rating) => {
      try {
        const songRef = doc(db, 'pjesme', song.id);
        await updateDoc(songRef, {
          rating: rating
        });
        song.rating = rating;
        alert(`Rated ${rating} stars!`);
      } catch (error) {
        console.error('Error rating song:', error);
        alert('Error rating song: ' + error.message);
      }
    };

    return {
      songs,
      addToTopTen,
      rateSong
    };
  }
};
</script>


<style scoped>
.songs-list {
  display: flex;
  flex-wrap: wrap;
}

.song-item {
  border: 1px solid #ccc;
  background-color: #f4c8ca;
  padding: 10px;
  margin: 10px;
  width: calc(33.333% - 20px); /* Three items per row with margins */
  box-sizing: border-box;
}

.song-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
}

.heart {
  cursor: pointer;
}

.stars {
  display: flex;
}

.star {
  cursor: pointer;
  font-size: 20px;
}

.star.active {
  color: gold;
}

.circle {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 55px;
  height: 55px;
  background-color: #f4c8ca;
  border-radius: 50%;
  cursor: pointer;
}
</style>

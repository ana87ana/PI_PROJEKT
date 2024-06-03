<template>
  <div>
    <h1>Some new songs to listen to!</h1>
    <div v-if="songs.length === 0">
      No songs found for the selected mood and occasion.
    </div>
    <div v-else class="songs-list">
      <div v-for="(song, index) in songs" :key="index" class="song-item">
        <div class="song-header">
          <h2><b>{{ song.name }}</b></h2>
          <p><b>{{ song.artist }}</b></p>
          <div class="actions">
            <span class="heart" @click="addToTopTen(song)">❤️</span>
            <div class="stars">
              <span v-for="star in 5" :key="star" class="star" :class="{ active: song.userRating >= star }" @click="rateSong(song, star)">★</span>
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
import { getFirestore, collection, query, where, getDocs, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const songs = ref([]);
    const db = getFirestore();
    const auth = getAuth();

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
          songs.value.push({ id: doc.id, ...doc.data(), userRating: 0 });
        });
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    });

    const addToTopTen = async (song) => {
      try {
        const user = auth.currentUser;

        if (!user) {
          throw new Error('No user is logged in');
        }

        const userDocRef = doc(db, 'korisnik', user.uid);
        const topTenCollectionRef = collection(userDocRef, 'topTenSongs');
        const topTenSnapshot = await getDocs(topTenCollectionRef);

        if (topTenSnapshot.size >= 10) {
          alert('You can only have 10 songs in your top ten list.');
          return;
        }

        const songRef = doc(topTenCollectionRef, song.id);

        await setDoc(songRef, {
          ...song,
          userRating: song.userRating 
        });

        alert('Added to top 10!');
      } catch (error) {
        console.error('Error adding to top 10:', error);
        alert('Error adding to top 10: ' + error.message);
      }
    };

    const rateSong = async (song, rating) => {
      try {
        const user = auth.currentUser;

        if (!user) {
          throw new Error('No user is logged in');
        }

        const userDocRef = doc(db, 'korisnik', user.uid);
        const songRef = doc(collection(userDocRef, 'ratedSongs'), song.id);

        await setDoc(songRef, {
          ...song,
          userRating: rating
        });

        song.userRating = rating; 

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
  width: calc(33.333% - 20px); 
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

p, h2{
  color:#640d12;
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
  color: #966d69;
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

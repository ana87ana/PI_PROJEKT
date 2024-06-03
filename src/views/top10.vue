<template>
  <div>
    <h1>MY TOP 10</h1>
    <div v-if="songs.length === 0">
      Your top 10 list is empty.
    </div>
    <div v-else class="songs-list">
      <div v-for="(song, index) in songs" :key="index" class="song-item">
        <div class="song-header">
          <h2>{{ song.name }}</h2>
          <p>{{ song.artist }}</p>
          <div class="actions">
            <span class="heart" @click="removeFromTopTen(song)">❤️</span>
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
import { getFirestore, doc, getDocs, getDoc, updateDoc, collection, setDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const songs = ref([]);
    const db = getFirestore();
    const auth = getAuth();

    onMounted(async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error('No user is logged in');
        return;
      }

      try {
        const topTenSongsCollectionRef = collection(db, 'korisnik', user.uid, 'topTenSongs');
        const querySnapshot = await getDocs(topTenSongsCollectionRef);

        querySnapshot.forEach((doc) => {
          songs.value.push({ id: doc.id, ...doc.data() });
        });
      } catch (error) {
        console.error('Error fetching top 10 songs:', error);
      }
    });

    const rateSong = async (song, rating) => {
      try {
        const user = auth.currentUser;

        if (!user) {
          throw new Error('No user is logged in');
        }

        const topTenSongRef = doc(db, 'korisnik', user.uid, 'topTenSongs', song.id);
        const songData = {
          name: song.name,
          artist: song.artist,
          userRating: rating
        };

        await setDoc(topTenSongRef, songData);

        const ratedSongRef = doc(db, 'korisnik', user.uid, 'ratedSongs', song.id);
        const ratedDoc = await getDoc(ratedSongRef);
        if (ratedDoc.exists()) {
          await updateDoc(ratedSongRef, { userRating: rating });
        }

        song.userRating = rating;

        alert(`Rated ${rating} stars!`);
      } catch (error) {
        console.error('Error rating song:', error);
        alert('Error rating song: ' + error.message);
      }
    };

    const removeFromTopTen = async (song) => {
      try {
        const user = auth.currentUser;

        if (!user) {
          throw new Error('No user is logged in');
        }

        const songRef = doc(db, 'korisnik', user.uid, 'topTenSongs', song.id);
        await deleteDoc(songRef);

        const songIndex = songs.value.findIndex(s => s.id === song.id);
        if (songIndex > -1) {
          songs.value.splice(songIndex, 1);
        }

        alert('Removed from top 10!');
      } catch (error) {
        console.error('Error removing from top 10:', error);
        alert('Error removing from top 10: ' + error.message);
      }
    };


    return {
      songs,
      removeFromTopTen,
      rateSong
    };
  }
};
</script>

<style scoped>
.songs-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.song-item {
  border: 1px solid #ccc;
  background-color: #f4c8ca;
  padding: 10px;
  margin: 10px;
}

.song-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  color:#3f0205;
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

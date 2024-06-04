<template>
  <div class="account-page">
    <div class="left-third">
      <img class="profile-picture" :src="profilePictureUrl" alt="Profile Picture">

      <div class="username">{{ username }}</div>

      <div class="navigation-buttons">
        <router-link to="/mainpage" class="button-link">
          <button class="nav-button"><b>MAIN PAGE</b></button>
        </router-link>
        <router-link to="/post_event" class="button-link">
          <button class="nav-button"><b>POSTAVI EVENT</b></button>
        </router-link>
        <router-link to="/top10" class="button-link">
          <button class="nav-button"><b>MY TOP 10</b></button>
        </router-link>
        <router-link to="/my_events" class="button-link">
          <button class="nav-button"><b>MY EVENTS</b></button>
        </router-link>
        <button @click="logout" class="logout-button"><b>LOGOUT</b></button>
      </div>
    </div>

    <div class="right-two-thirds">
      <div class="songs-events-buttons">
        <button class="songs-button" @click="showContent('songs')"><b>OCIJENJENE PJESME</b></button>
        <button class="events-button" @click="showContent('events')"><b>EVENTI</b></button>
      </div>

      <div class="songs-events-content">
        <div v-if="activeContent === 'songs'">
          <div v-if="ratedSongs.length === 0">
            No rated songs found.
          </div>
          <div v-else class="songs-list">
            <div v-for="(song, index) in ratedSongs" :key="index" class="song-item">
              <div class="song-header">
                <h2>{{ song.name }}</h2>
                <p>{{ song.artist }}</p>
                <div class="actions">
                  <span class="heart" @click="addToTopTen(song)">❤️</span>
                  <div class="stars">
                    <span v-for="star in 5" :key="star" class="star" :class="{ active: song.userRating >= star }" @click="rateSong(song, star)">★</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeContent === 'events'">
          <div v-if="events.length === 0">
            <p>No events added.</p>
          </div>
          <div v-else class="events-list">
            <div v-for="event in events" :key="event.id" class="event-item">
              <img :src="event.photoURL" alt="Event Picture" class="event-picture">
              <div class="event-details">
                <h2>{{ event.naziv.toUpperCase() }}</h2>
                <p><strong>LOKACIJA:</strong> {{ event.lokacija.toUpperCase() }}</p>
                <p><strong>DATUM:</strong> {{ event.datum }}</p>
                <p><strong>IZVOĐAČ:</strong> {{ event.izvodac.toUpperCase() }}</p>
                <p><strong>GDJE NAPRAVITI KARTE:</strong> {{ event.karta.toUpperCase() }}</p>
                <p><strong>CIJENA KARTE:</strong> {{ event.karta_c + " €" }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, getDoc, updateDoc, doc, setDoc } from 'firebase/firestore';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { db, storage } from '@/views/firebase';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';

export default {
  setup() {
    const profilePictureUrl = ref('https://via.placeholder.com/150');
    const username = ref('');
    const ratedSongs = ref([]);
    const events = ref([]);
    const activeContent = ref('songs');
    const auth = getAuth();
    const router = useRouter();

    const fetchDefaultProfilePictureUrl = async () => {
  try {
    const defaultPictureRef = storageRef(storage, 'default-profile-picture.png');
    profilePictureUrl.value = await getDownloadURL(defaultPictureRef);
  } catch (error) {
    console.error('Error fetching default profile picture:', error);
    profilePictureUrl.value = 'https://via.placeholder.com/150';
  }
};

    const fetchUserData = async (uid) => {
      const q = query(collection(db, 'korisnik'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        username.value = userData.username || 'User123';
        profilePictureUrl.value = userData.profilePictureUrl || 'https://via.placeholder.com/150';
      }
    };

    const fetchRatedSongs = async (uid) => {
      try {
        const ratedSongsCollectionRef = collection(db, 'korisnik', uid, 'ratedSongs');
        const querySnapshot = await getDocs(ratedSongsCollectionRef);

        ratedSongs.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Error fetching rated songs:', error);
      }
    };

    const fetchUserEvents = async (uid) => {
      try {
        const eventsCollection = collection(db, 'korisnik', uid, 'userEvents');
        const eventsSnapshot = await getDocs(eventsCollection);
        events.value = eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Error fetching user events:', error);
      }
    };

    onMounted(() => {
      onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
          fetchUserData(authUser.uid);
          fetchRatedSongs(authUser.uid);
          fetchUserEvents(authUser.uid);
          fetchDefaultProfilePictureUrl();
        }
      });
    });

    const showContent = (content) => {
      activeContent.value = content;
    };

    const logout = async () => {
      try {
        await signOut(auth);
        console.log('User logged out successfully');
        router.push('/');
      } catch (error) {
        console.error('Error logging out:', error);
        alert('Error logging out: ' + error.message);
      }
    };

    const rateSong = async (song, rating) => {
      try {
        const user = auth.currentUser;

        if (!user) {
          throw new Error('No user is logged in');
        }

        const ratedSongRef = doc(db, 'korisnik', user.uid, 'ratedSongs', song.id);
        const songData = {
          name: song.name,
          artist: song.artist,
          userRating: rating
        };

        await setDoc(ratedSongRef, songData);

        const topTenSongRef = doc(db, 'korisnik', user.uid, 'topTenSongs', song.id);
        const topTenDoc = await getDoc(topTenSongRef);
        if (topTenDoc.exists()) {
          await updateDoc(topTenSongRef, { userRating: rating });
        }

        song.userRating = rating;

        alert(`Rated ${rating} stars!`);
      } catch (error) {
        console.error('Error rating song:', error);
        alert('Error rating song: ' + error.message);
      }
    };

    const addToTopTen = async (song) => {
      try {
        const user = auth.currentUser;

        if (!user) {
          throw new Error('No user is logged in');
        }

        const topTenSongsCollectionRef = collection(db, 'korisnik', user.uid, 'topTenSongs');
        const topTenSnapshot = await getDocs(topTenSongsCollectionRef);

        if (topTenSnapshot.size >= 10) {
          alert('You already have 10 songs in your top 10 list. Remove one before adding another.');
          return;
        }

        const songRef = doc(db, 'korisnik', user.uid, 'topTenSongs', song.id);
        await setDoc(songRef, song);

        alert('Added to top 10!');
      } catch (error) {
        console.error('Error adding to top 10:', error);
        alert('Error adding to top 10: ' + error.message);
      }
    };

    return {
      profilePictureUrl,
      username,
      ratedSongs,
      events,
      activeContent,
      showContent,
      rateSong,
      addToTopTen,
      logout,
      fetchDefaultProfilePictureUrl,
      
    };
  },
};
</script>

<style scoped>
.account-page {
  display: flex;
}

.left-third {
  flex: 1;
  background-color: #f4c8ca; 
  padding: 20px;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.username {
  margin-top: 10px;
  font-size: 20px;
}

.navigation-buttons {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

.nav-button {
  width: 50%; 
  margin-bottom: 10px;
  padding: 10px;
  background-color: #640d12;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.nav-button:hover {
  background-color: #3f0205;
}

.logout-button {
  width: 30%; 
  margin-top: 80px;
  padding: 10px;
  background-color: #640d12;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #3f0205;
}

.right-two-thirds {
  flex: 2;
  padding: 20px;
}

.songs-events-buttons {
  display: flex;
  margin-bottom: 20px;
}

.songs-button, .events-button {
  flex: 1;
  margin-right: 10px;
  padding: 10px;
  background-color: #640d12;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.songs-button:hover, .events-button:hover {
  background-color: #a1121a;
}

.songs-events-content {
  display: flex;
  flex-direction: column;
}

.songs-list, .events-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.song-item, .event-item {
  border: 1px solid #ccc;
  background-color: #f4c8ca;
  padding: 10px;
  margin: 10px;
}

.song-header, .event-details {
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

.stars {
  display: flex;
  color:#966d6f;
}

.star {
  cursor: pointer;
  font-size: 20px;
  color:#966d6f;
}

.star.active {
  color:#990911;
}

.heart {
  cursor: pointer;
  font-size: 20px;
}

.event-picture {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}
</style>


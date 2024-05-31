<template>
  <div class="account-page">
    <!-- Left third -->
    <div class="left-third">
      <!-- Profile picture -->
      <img class="profile-picture" :src="profilePictureUrl" alt="Profile Picture">

      <!-- Username -->
      <div class="username">{{ username }}</div>

      <!-- Navigation buttons -->
      <div class="navigation-buttons">
        <router-link to="/mainpage" class="button-link">
          <button class="nav-button">MAIN PAGE</button>
        </router-link>
        <router-link to="/post_event" class="button-link">
          <button class="nav-button">POSTAVI EVENT</button>
        </router-link>
        <router-link to="/top10" class="button-link">
          <button class="nav-button">MY TOP 10</button>
        </router-link>
        <button @click="logout" class="logout-button">Logout</button>
      </div>
    </div>

    <!-- Right two-thirds -->
    <div class="right-two-thirds">
      <!-- Songs and Events buttons -->
      <div class="songs-events-buttons">
        <button class="songs-button" @click="showContent('songs')">OCIJENJENE PJESME</button>
        <button class="events-button" @click="showContent('events')">EVENTI</button>
      </div>

      <!-- Placeholder for songs or events -->
      <div class="songs-events-content">
        <!-- Songs Content -->
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
                  <div class="stars">
                    <span v-for="star in 5" :key="star" class="star" :class="{ active: song.userRating >= star }" @click="rateSong(song, star)">★</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Events Content -->
        <div v-if="activeContent === 'events'">
          <div v-if="events.length">
            <div v-for="event in events" :key="event.id" class="event-card">
              <img :src="event.pictureUrl" alt="Event Picture" class="event-picture">
              <p>{{ event.naziv }}</p>
              <p><strong>Lokacija:</strong> {{ event.lokacija }}</p>
              <p><strong>Datum:</strong> {{ event.datum }}</p>
              <p><strong>Izvođač:</strong> {{ event.izvodac }}</p>
              <p><strong>Gdje nabaviti karte:</strong> {{ event.karta }}</p>
              <p><strong>Cijena karte:</strong> {{ event.karta_c }}</p>
            </div>
          </div>
          <div v-else>
            <p>No events added.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '@/views/firebase';

export default {
  setup() {
    const profilePictureUrl = ref('https://via.placeholder.com/150');
    const username = ref('');
    const ratedSongs = ref([]);
    const events = ref([]);
    const activeContent = ref('songs');
    const auth = getAuth();
    const router = useRouter();

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

        const songRef = doc(db, 'korisnik', user.uid, 'ratedSongs', song.id);

        await updateDoc(songRef, {
          userRating: rating
        });

        song.userRating = rating; // Update the local rating

        alert(`Rated ${rating} stars!`);
      } catch (error) {
        console.error('Error rating song:', error);
        alert('Error rating song: ' + error.message);
      }
    };

    return {
      profilePictureUrl,
      username,
      ratedSongs,
      events,
      activeContent,
      showContent,
      logout,
      rateSong,
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
  width: 30%; /* Full width */
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
}

.actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
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

.event-card {
  border: 1px solid #ccc;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
  background-color: #f4f4f4;
}

.event-picture {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}
</style>

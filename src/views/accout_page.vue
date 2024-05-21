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
        <router-link to="/my_top_ten" class="button-link">
          <button class="nav-button">MY TOP 10</button>
        </router-link>
        <button @click="logout" class="logout-button">Logout</button>
      </div>
    </div>

    <!-- Right two-thirds -->
    <div class="right-two-thirds">
      <!-- Songs and Events buttons -->
      <div class="songs-events-buttons">
        <button class="songs-button">OCIJENJENE PJESME</button>
        <button class="events-button">EVENTI</button>
      </div>

      <!-- Placeholder for songs or events -->
      <div class="songs-events-content">
        <!-- Content will be dynamically rendered here based on selected button -->
        <!-- For example, song elements or event details -->
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '@/views/firebase'; 

export default {
  setup() {
    const profilePictureUrl = ref('https://via.placeholder.com/150');
    const username = ref('');
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

    onMounted(() => {
      const user = auth.currentUser;
      if (user) {
        fetchUserData(user.uid);
      }
    });

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

    return {
      profilePictureUrl,
      username,
      logout,
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
</style>


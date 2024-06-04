<template>
  <div class="header">
    <div class="title">Dobrodišli natrag! Za što ste zainteresirani danas?</div>
  </div>
  <div class="buttons">
    <button @click="redirectToSongs"><b>SONGS</b></button>
    <router-link to="/events">
      <button><b>EVENTS</b></button>
    </router-link>
  </div>
  <div class="account-link">
    <router-link to="/account">
      <div class="circle"></div>
    </router-link>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '@/views/firebase';
import { getDoc, doc } from 'firebase/firestore';

export default {
  setup() {
    const isAdmin = ref(false);
    const router = useRouter();

    const redirectToSongs = () => {
      if (isAdmin.value) {
        router.push('/songs_admin');
      } else {
        router.push('/songs');
      }
    };

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'korisnik', user.uid));
        if (userDoc.exists()) {
          isAdmin.value = userDoc.data().isAdmin;
        }
      }
    });

    return {
      isAdmin,
      redirectToSongs,
    };
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 10px;
  margin-top: 50px;
}

.title {
  font-size: 50px;
  color: #f4c8ca;
}

.buttons button {
  background-color: #640d12;
  margin-left: 15%;
  margin-right: 15%;
  margin-top: 80px;
  padding-top: 50px;
  padding-bottom: 50px;
  padding-left: 60px;
  padding-right: 200px;
  font-size: 35px;
  color: #f4c8ca;
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

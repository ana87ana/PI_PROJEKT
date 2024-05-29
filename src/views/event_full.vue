<template>
  <div class="event-detail" v-if="event">
    <h1>{{ event.naziv }}</h1>
    <img :src="event.pictureUrl" alt="Event Picture" class="event-picture">
    <div class="event-info">
      <button class="add-event-btn" @click="addEvent" :disabled="buttonText === 'Event Added'">{{ buttonText }}</button>
      <p><strong>Lokacija:</strong> {{ event.lokacija }}</p>
      <p><strong>Datum:</strong> {{ event.datum }}</p>
      <p><strong>Izvođač:</strong> {{ event.izvodac }}</p>
      <p><strong>Gdje nabaviti karte:</strong> {{ event.karta }}</p>
      <p><strong>Cijena karte:</strong> {{ event.karta_c }}</p>
    </div>
  </div>
  <div class="account-link">
    <router-link to="/account">
      <div class="circle"></div>
    </router-link>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '@/views/firebase';
import { useRoute } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default defineComponent({
  setup() {
    const route = useRoute();
    const event = ref(null);
    const buttonText = ref('Add Event');
    const auth = getAuth();
    const user = ref(null);

    const fetchUserUid = async () => {
      try {
        const userDocRef = doc(db, 'korisnik', user.value.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return userData.uid;
        } else {
          console.error('No such user!');
          return null;
        }
      } catch (error) {
        console.error('Error fetching user UID:', error);
        return null;
      }
    };

    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(doc(db, 'events', route.params.id));
        if (eventDoc.exists()) {
          event.value = eventDoc.data();
          const uid = await fetchUserUid();
          if (uid) {
            await checkIfEventAdded(uid);
          }
        } else {
          console.error('No such event!');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    const checkIfEventAdded = async (uid) => {
      try {
        const userEventRef = doc(db, 'korisnik', uid, 'userEvents', route.params.id);
        const userEventDoc = await getDoc(userEventRef);
        if (userEventDoc.exists()) {
          buttonText.value = 'Event Added';
        }
      } catch (error) {
        console.error('Error checking if event is added:', error);
      }
    };

    const addEvent = async () => {
      if (!event.value || !user.value.uid) return;

      try {
        const userEventRef = doc(collection(db, 'korisnik', user.value.uid, 'userEvents'), route.params.id);
        await setDoc(userEventRef, event.value);
        buttonText.value = 'Event Added';
      } catch (error) {
        console.error('Error adding event:', error);
      }
    };

    onMounted(() => {
      onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
          user.value = authUser;
          fetchEvent();
        } else {
          console.error('User is not authenticated');
        }
      });
    });

    return {
      event,
      buttonText,
      addEvent,
    };
  },
});
</script>

<style scoped>
.event-detail {
  padding: 20px;
}

.event-picture {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

.event-info {
  position: relative;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
}

.event-info p {
  margin: 10px 0;
}

.add-event-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-event-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.add-event-btn:hover {
  background-color: #0056b3;
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

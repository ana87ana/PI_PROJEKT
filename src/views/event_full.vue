<template>
  <div class="event-detail" v-if="event">
    <h1>{{ event.naziv.toUpperCase() }}</h1>
    <img :src="event.photoURL" alt="Event Picture" class="event-picture">
    <div class="event-info">
      <button class="add-event-btn" @click="addEvent" :disabled="buttonText === 'Event Added'">{{ buttonText }}</button>
      <p><strong>LOKACIJA:</strong> {{ event.lokacija }}</p>
      <p><strong>DATUM:</strong> {{ event.datum }}</p>
      <p><strong>IZVOĐAČ:</strong> {{ event.izvodac }}</p>
      <p><strong>GDJE NABAVITI KARTE:</strong> {{ event.karta }}</p>
      <p><strong>CIJENA KARTE:</strong> {{ event.karta_c }}</p>
      <button v-if="isAdmin" class="remove-event-btn" @click="removeEvent">Remove Event</button>
      <div v-if="isAdmin" class="comment-section">
        <textarea v-model="comment" placeholder="Enter reason for removal"></textarea>
      </div>
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
import { doc, getDoc, deleteDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db, auth } from '@/views/firebase';
import { useRoute, useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const event = ref(null);
    const buttonText = ref('Add Event');
    const isAdmin = ref(false);
    const auth = getAuth();
    const user = ref(null);
    const comment = ref('');

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
            await checkAdmin(uid);
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

    const checkAdmin = async (uid) => {
      try {
        const userDoc = await getDoc(doc(db, 'korisnik', uid));
        isAdmin.value = userDoc.exists() && userDoc.data().isAdmin;
      } catch (error) {
        console.error('Error fetching user document: ', error);
      }
    };

    const addEvent = async () => {
      if (!event.value || !user.value.uid) return;

      try {
        const userEventRef = doc(db, 'korisnik', user.value.uid, 'userEvents', route.params.id);
        await setDoc(userEventRef, event.value);
        buttonText.value = 'Event Added';
      } catch (error) {
        console.error('Error adding event:', error);
      }
    };

    const removeEvent = async () => {
      if (!event.value || !user.value.uid) return;

      try {
        await deleteDoc(doc(db, 'events', route.params.id));
        
        const message = {
          eventId: route.params.id,
          eventName: route.params.naziv,
          reason: comment.value,
          userId: event.value.uid,
          timestamp: new Date()
        };
        
        await addDoc(collection(db, 'messages'), message);
        
        console.log(`Event with ID: ${route.params.id} has been deleted with comment: ${comment.value}`);
        router.push('/mainpage');
      } catch (error) {
        console.error('Error removing event:', error);
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
      isAdmin,
      removeEvent,
      comment,
    };
  },
});
</script>

<style scoped>
.event-detail {
  padding: 20px;
  display:flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
}

.event-picture {
  width: 40%;
  height: 20%;
  border-radius: 8px;
}

.event-info {
  position: relative;
  width: 37%;
  background-color: #f4c8ca;
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
  background-color: #640d12;
  color: #f4c8ca;
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
  background-color: #3f0205;
}

.remove-event-btn {
  background-color: #640d12;
  color: white;
  border: none;
  width: 15%;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-event-btn:hover {
  background-color: #3f0205;
}

.comment-section {
  margin-top: 20px;
}

textarea {
  width: 100%;
  height: 100px;
  margin-top: 10px;
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
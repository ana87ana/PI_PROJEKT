<template>
    <div>
      <h1>Your Events</h1>
      <div v-if="events.length">
        <div v-for="event in events" :key="event.id" class="event-card">
          <h2>{{ event.naziv }}</h2>
          <img :src="event.pictureUrl" alt="Event Picture" class="event-picture">
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
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from 'vue';
  import { collection, getDocs } from 'firebase/firestore';
  import { db } from '@/views/firebase';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  
  export default defineComponent({
    setup() {
      const events = ref([]);
      const auth = getAuth();
      const user = ref(null);
  
      const fetchUserEvents = async (uid) => {
        try {
          const eventsCollection = collection(db, 'korisnik', uid, 'userEvents');
          const eventsSnapshot = await getDocs(eventsCollection);
          events.value = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
          console.error('Error fetching user events:', error);
        }
      };
  
      onMounted(() => {
        onAuthStateChanged(auth, (authUser) => {
          if (authUser) {
            user.value = authUser;
            fetchUserEvents(authUser.uid);
          } else {
            console.error('User is not authenticated');
          }
        });
      });
  
      return {
        events,
      };
    },
  });
  </script>
  
  <style scoped>
  .event-card {
    border: 1px solid #ccc;
    padding: 20px;
    margin: 20px 0;
    border-radius: 8px;
    background-color: #f4f4f4;
  }
  
  .event-picture {
    width: 20%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  </style>
  
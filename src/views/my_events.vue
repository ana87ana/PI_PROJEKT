<template>
    <div class="event-list">
      <h1> MY EVENTS</h1>
      <div class="sort-options">
        <label for="sort">SORT BY:</label>
        <select id="sort" v-model="selectedSort" @change="sortEvents">
          <option value="eventDateAsc">Event Date Ascending</option>
          <option value="eventDateDesc">Event Date Descending</option>
        </select>
      </div>
      <div class="events">
        <div v-for="event in sortedEvents" :key="event.id" class="event-card">
          <img :src="event.photoURL" alt="Event Picture" class="event-picture">
          <div class="event-info">
            <h2>{{ event.naziv.toUpperCase() }}</h2>
            <p>{{ event.lokacija.toUpperCase() }}</p>
            <p>{{ new Date(event.datum).toLocaleDateString() }}</p>
          </div>
        </div>
      </div>
      <div class="deleted-events">
        <h2>DELETED EVENTS</h2>
        <div v-for="message in messages" :key="message.id" class="message-card">
          <p><strong>Naziv eventa:</strong> {{ message.eventName }}</p>
          <p><strong>Komentar:</strong> {{ message.reason }}</p>
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
  import { defineComponent, ref, onMounted, computed } from 'vue';
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import { db } from '@/views/firebase';
  import { getAuth } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    setup() {
      const events = ref([]);
      const messages = ref([]);
      const selectedSort = ref('eventDateAsc'); 
      const router = useRouter();
      const auth = getAuth();
  
      const fetchEvents = async () => {
        try {
          const user = auth.currentUser;
          if (!user) {
            alert('User is not authenticated');
            return;
          }
          const q = query(collection(db, 'events'), where('uid', '==', user.uid));
          const querySnapshot = await getDocs(q);
          events.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          sortEvents(); 
        } catch (error) {
          console.error('Error fetching events: ', error);
        }
      };
  
      const fetchMessages = async () => {
        try {
          const user = auth.currentUser;
          if (!user) {
            alert('User is not authenticated');
            return;
          }
          const q = query(collection(db, 'messages'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          messages.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
          console.error('Error fetching messages: ', error);
        }
      };
  
      const sortEvents = () => {
        if (selectedSort.value === 'eventDateAsc') {
          events.value.sort((a, b) => new Date(a.datum) - new Date(b.datum));
        } else if (selectedSort.value === 'eventDateDesc') {
          events.value.sort((a, b) => new Date(b.datum) - new Date(a.datum));
        }
      };
  
      const sortedEvents = computed(() => {
        sortEvents();
        return events.value;
      });
  
      onMounted(() => {
        fetchEvents();
        fetchMessages();
      });
  
      return {
        events,
        messages,
        selectedSort,
        sortedEvents,
        sortEvents,
      };
    },
  });
  </script>
  
  <style scoped>
  .event-list {
    padding: 20px;
  }
  
  .sort-options {
    margin-bottom: 20px;
  }
  
  .events {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .event-card {
    border: 1px solid #ddd;
    background-color: #f4c8ca;
    border-radius: 8px;
    padding: 10px;
    width: 200px;
  }
  
  .event-picture {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .event-info {
    margin-top: 10px;
    color: #3f0205;
  }
  
  button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #c82333;
  }
  
  .deleted-events {
    margin-top: 40px;
  }
  
  .message-card {
    border: 1px solid #ddd;
    background-color: #f4c8ca;
    border-radius: 8px;
    padding: 10px;
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
  
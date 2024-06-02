<template>
    <div class="event-list">
      <h1> MY EVENTS</h1>
      <div class="sort-options">
        <label for="sort">SORT BY:</label>
        <select id="sort" v-model="selectedSort" @change="sortEvents">
          <option value="eventDateAsc">Event Date Ascending</option>
          <option value="eventDateDesc">Event Date Descending</option>
          <option value="addedDateAsc">Date Added Ascending</option>
          <option value="addedDateDesc">Date Added Descending</option>
        </select>
      </div>
      <div class="events">
        <div v-for="event in sortedEvents" :key="event.id" class="event-card" @click="goToEvent(event.id)">
          <img :src="event.photoURL" alt="Event Picture" class="event-picture">
          <div class="event-info">
            <h2>{{ event.naziv }}</h2>
            <p>{{ event.lokacija }}</p>
            <p>{{ new Date(event.datum).toLocaleDateString() }}</p>
          </div>
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
  import { defineComponent, ref, onMounted, computed } from 'vue';
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import { db } from '@/views/firebase';
  import { getAuth } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    setup() {
      const events = ref([]);
      const selectedSort = ref('eventDateAsc'); // default sort by event date ascending
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
          sortEvents(); // sort events initially
        } catch (error) {
          console.error('Error fetching events: ', error);
        }
      };
  
      const sortEvents = () => {
        if (selectedSort.value === 'eventDateAsc') {
          events.value.sort((a, b) => new Date(a.datum) - new Date(b.datum));
        } else if (selectedSort.value === 'eventDateDesc') {
          events.value.sort((a, b) => new Date(b.datum) - new Date(a.datum));
        } else if (selectedSort.value === 'addedDateAsc') {
          events.value.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
        } else if (selectedSort.value === 'addedDateDesc') {
          events.value.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
        }
      };
  
      const sortedEvents = computed(() => {
        sortEvents();
        return events.value;
      });
  
      const goToEvent = (id) => {
        router.push(`/event/${id}`);
      };
  
      onMounted(fetchEvents);
  
      return {
        events,
        selectedSort,
        sortedEvents,
        goToEvent,
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
    align-content: left;
  }
  
  .sort-options label {
    margin-right: 10px;
  }
  
  .sort-options select {
    padding: 5px;
  }
  
  .events {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .event-card {
    background-color: purple;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 10px;
    padding: 10px;
    width: 23%;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .event-card:hover {
    transform: scale(1.05);
  }
  
  .event-picture {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
  
  .event-info {
    margin-top: 10px;
  }
  
  .event-info h2 {
    margin: 0;
  }
  
  .event-info p {
    margin: 5px 0;
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
  
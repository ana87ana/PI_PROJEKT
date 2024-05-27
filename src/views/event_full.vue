<template>
    <div class="event-detail" v-if="event">
      <h1>{{ event.naziv }}</h1>
      <img :src="event.pictureUrl" alt="Event Picture" class="event-picture">
      <div class="event-info">
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
  import { doc, getDoc } from 'firebase/firestore';
  import { db } from '@/views/firebase';
  import { useRoute } from 'vue-router';
  
  export default defineComponent({
    setup() {
      const route = useRoute();
      const event = ref(null);
  
      const fetchEvent = async () => {
        try {
          const eventDoc = await getDoc(doc(db, 'events', route.params.id));
          if (eventDoc.exists()) {
            event.value = eventDoc.data();
          } else {
            console.error('No such event!');
          }
        } catch (error) {
          console.error('Error fetching event: ', error);
        }
      };
  
      onMounted(fetchEvent);
  
      return {
        event,
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
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 8px;
  }
  
  .event-info p {
    margin: 10px 0;
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
  
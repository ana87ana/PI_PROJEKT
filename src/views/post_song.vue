<template>
    <div>
      <h1>ADD SONG</h1>
      <div class="song-form">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name"><span class="a">NAME</span></label>
            <input type="text" id="name" v-model="name" required />
          </div>
          <div class="form-group">
            <label for="artist"><span class="a">ARTIST</span></label>
            <input type="text" id="artist" v-model="artist" required />
          </div>
          <div class="form-group">
            <label for="mood"><span class="a">MOOD</span></label>
            <input type="text" id="mood" v-model="mood" required />
          </div>
          <div class="form-group">
            <label for="occasion"><span class="a">OCCASION</span></label>
            <input type="text" id="occasion" v-model="occasion" required />
          </div>
          <button type="submit">ADD SONG</button>
        </form>
      </div>
      <div class="account-link">
        <router-link to="/account">
          <div class="circle"></div>
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue';
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
  import { db } from '@/views/firebase';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    setup() {
      const name = ref('');
      const artist = ref('');
      const mood = ref('');
      const occasion = ref('');
      const router = useRouter();
  
      const submitForm = async () => {
        try {
          await addDoc(collection(db, 'pjesme'), {
            name: name.value.toUpperCase(),
            artist: artist.value.toUpperCase(),
            mood: mood.value.toUpperCase(),
            occasion: occasion.value.toUpperCase(),
          });
  
          alert('Song added successfully!');
          name.value = '';
          artist.value = '';
          mood.value = '';
          occasion.value = '';
          router.push('/mainpage');
        } catch (e) {
          console.error('Error adding document: ', e.message);
          alert(`Error: ${e.message}`);
        }
      };
  
      return {
        name,
        artist,
        mood,
        occasion,
        submitForm,
      };
    },
  });
  </script>
  
  <style scoped>
  .song-form {
    width: 60%;
    margin: 0 auto;
    padding: 20px;
    border-radius: 5px;
    background-color: #67023d;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  .a {
    color: #f4c8ca;
  }
  
  input[type='text'] {
    width: 75%;
    padding: 8px;
    background-color: #f4c8ca;
    border: 1px solid #f4c8ca;
    border-radius: 3px;
  }
  
  button {
    background-color: #4d012e;
    color:#f4c8ca;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #2b021a;
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
  

<template>
    <h1>MOJ EVENT</h1>
    <div class="event-form">
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="naziv"><span class="a">NAZIV EVENTA</span></label>
          <input type="text" id="naziv" v-model="naziv" required>
        </div>
        <div class="form-group">
          <label for="vrsta"><span class="a">VRSTA EVENTA</span></label>
          <input type="text" id="vrsta" v-model="vrsta" required>
        </div>
        <div class="form-group">
          <label for="lokacija"><span class="a">LOKACIJA(GRAD, ADRESA)</span></label>
          <input type="text" id="lokacija" v-model="lokacija" required>
        </div>
        <div class="form-group">
          <label for="izvodac"><span class="a">IZVOĐAČ(OPCIONALNO)</span></label>
          <input type="text" id="izvodac" v-model="izvodac">
        </div>
        <div class="form-group">
          <label for="datum"><span class="a">DATUM</span></label>
          <input type="date" id="datum" v-model="datum" required>
        </div>
        <div class="form-group">
          <label for="karta"><span class="a">GDJE NABAVITI KARTE</span></label>
          <input type="text" id="karta" v-model="karta" required>
        </div>
        <div class="form-group">
          <label for="karta_c"><span class="a">CIJENA KARTE</span></label>
          <input type="text" id="karta_c" v-model="karta_c" required>
        </div>
        <button type="submit">POST EVENT</button>
        <button type="">ADD PICTURE</button>
      </form>
    </div>
    <div class="account-link">
      <router-link to="/account">
        <div class="circle"></div>
      </router-link>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue';
  import { collection, addDoc } from 'firebase/firestore';
  import { db } from '@/views/firebase';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    setup() {
      const naziv = ref('');
      const vrsta = ref('');
      const lokacija = ref('');
      const izvodac = ref('');
      const datum = ref('');
      const karta = ref('');
      const karta_c = ref('');
      const router = useRouter();
  
      const submitForm = async () => {
        try {
          await addDoc(collection(db, 'events'), {
            naziv: naziv.value,
            vrsta: vrsta.value,
            lokacija: lokacija.value,
            izvodac: izvodac.value,
            datum: datum.value,
            karta: karta.value,
            karta_c: karta_c.value,
          });
          alert('Event successfully added!');
          naziv.value = '';
          vrsta.value = '';
          lokacija.value = '';
          izvodac.value = '';
          datum.value = '';
          karta.value = '';
          karta_c.value = '';
          router.push('/mainpage');
        } catch (e) {
          console.error('Error adding document: ', e);
        }
      };
  
      return {
        naziv,
        vrsta,
        lokacija,
        izvodac,
        datum,
        karta,
        karta_c,
        submitForm,
      };
    },
  });
  </script>
  
  <style scoped>
  .login-form {
    max-width: 100px;
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
  
  input[type="text"],
  input[type="date"] {
    width: 50%;
    padding: 8px;
    background-color: #f4c8ca;
    border: 1px solid #f4c8ca;
    border-radius: 3px;
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
  
<template>
  <div>
    <h1>MOJ EVENT</h1>
    <div class="event-form">
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="naziv"><span class="a">NAZIV EVENTA</span></label>
          <input type="text" id="naziv" v-model="naziv" required />
        </div>
        <div class="form-group">
          <label for="vrsta"><span class="a">VRSTA EVENTA</span></label>
          <input type="text" id="vrsta" v-model="vrsta" required />
        </div>
        <div class="form-group">
          <label for="lokacija"><span class="a">LOKACIJA(GRAD, ADRESA)</span></label>
          <input type="text" id="lokacija" v-model="lokacija" required />
        </div>
        <div class="form-group">
          <label for="izvodac"><span class="a">IZVOĐAČ(OPCIONALNO)</span></label>
          <input type="text" id="izvodac" v-model="izvodac" />
        </div>
        <div class="form-group">
          <label for="datum"><span class="a">DATUM</span></label>
          <input type="date" id="datum" v-model="datum" required />
        </div>
        <div class="form-group">
          <label for="karta"><span class="a">GDJE NABAVITI KARTE</span></label>
          <input type="text" id="karta" v-model="karta" required />
        </div>
        <div class="form-group">
          <label for="karta_c"><span class="a">CIJENA KARTE</span></label>
          <input type="text" id="karta_c" v-model="karta_c" required />
        </div>
        <div class="form-group">
          <label for="photo"><span class="a">ADD PHOTO</span></label>
          <input type="file" @change="onFileChange" class="file-input" />
        </div>
        <button type="submit"><b>POST EVENT</b></button>
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
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/views/firebase';
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export default defineComponent({
  setup() {
    const naziv = ref('');
    const vrsta = ref('');
    const lokacija = ref('');
    const izvodac = ref('');
    const datum = ref('');
    const karta = ref('');
    const karta_c = ref('');
    const file = ref(null);
    const router = useRouter();
    const auth = getAuth();

    const onFileChange = (e) => {
      file.value = e.target.files[0];
      console.log('Selected file:', file.value);
    };

    const submitForm = async () => {
      const user = auth.currentUser;
      if (!user) {
        alert('User is not authenticated');
        return;
      }

      if (!file.value) {
        alert('Please select a photo to upload.');
        return;
      }

      try {
        const uploadRef = storageRef(storage, `event_photos/${file.value.name}`);
        await uploadBytes(uploadRef, file.value);

        const photoURL = await getDownloadURL(uploadRef);
        console.log('File uploaded successfully:', photoURL);

        await addDoc(collection(db, 'events'), {
          naziv: naziv.value.toUpperCase(),
          vrsta: vrsta.value.toUpperCase(),
          lokacija: lokacija.value.toUpperCase(),
          izvodac: izvodac.value.toUpperCase(),
          datum: datum.value.toUpperCase(),
          karta: karta.value.toUpperCase(),
          karta_c: karta_c.value + '€',
          photoURL,
          uid: user.uid,
          createdAt: Timestamp.now(),
        });

        alert('Event with photo successfully added!');
        naziv.value = '';
        vrsta.value = '';
        lokacija.value = '';
        izvodac.value = '';
        datum.value = '';
        karta.value = '';
        karta_c.value = '';
        file.value = null;
        router.push('/mainpage');
      } catch (e) {
        console.error('Error adding document: ', e.message);
        alert(`Error: ${e.message}`);
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
      file,
      onFileChange,
      submitForm,
    };
  },
});
</script>


<style scoped>
.event-form {
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

input[type='text'],
input[type='date'] {
  width: 75%;
  padding: 8px;
  background-color: #f4c8ca;
  border: 1px solid #f4c8ca;
  border-radius: 3px;
}

.file-input {
  margin-top: 10px;
  background-color: #f4c8ca;
}

button {
  background-color: #370422;
  color: white;
  width: 15%;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #4d012e;
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

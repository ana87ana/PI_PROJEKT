<template>
  <div>
    <h1>MyMusicMinutes</h1>
    <form @submit.prevent="register">
      <div>
        <label for="username"><b>Username:</b></label>
        <input type="text" v-model="username" />
      </div>
      <div>
        <label for="email"><b>Email:</b></label>
        <input type="email" v-model="email" />
      </div>
      <div>
        <label for="password"><b>Password:</b></label>
        <input type="password" v-model="password" />
      </div>
      <button type="submit"><b>CREATE</b></button>
    </form>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { ref } from 'vue';
import { auth, db } from '@/views/firebase'; 


export default {
  setup() {
    const auth = getAuth();
    const db = getFirestore();

    const username = ref('');
    const email = ref('');
    const password = ref('');
    const router = useRouter();

    const register = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        await addDoc(collection(db, 'korisnik'), {
          uid: user.uid,
          email: email.value,
          username: username.value,
        });

        alert('User registered successfully!');
        router.push('/account');
      } catch (error) {
        console.error('Error registering user:', error);
        alert('Error registering user: ' + error.message);
      }
    };

    return {
      username,
      email,
      password,
      register,
    };
  },
};
</script>

<style>
h1 {
  color: black;
  font-size: 60px;
}

.a {
  color: #000;
  font-size: 20px;
  font-weight: bold;
}

.login-form {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
  background-color: #cd1d25;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="password"],
input[type="email"] {
  width: 30%;
  padding: 8px;
  background-color: #f4c8ca;
  border: 1px solid #f4c8ca;
  border-radius: 3px;
}

button {
  width: 15%;
  align-content: left;
  padding: 10px;
  margin: 10px;
  background-color: #640d12;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #3f0205;
}

h3 {
  color: #000;
  align-content: center;
}
</style>


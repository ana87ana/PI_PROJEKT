<template>
  <div>
    <h1>MyMusicMinutes</h1>
    <div class="login-form">
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="email"><span class="a">EMAIL</span></label>
          <input type="text" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="password"><span class="a">PASSWORD</span></label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit"><b>LOGIN</b></button>
      </form>
    </div>
    <h3>Nemate račun? Stvorite ga <router-link to="/signup">ovdje!</router-link></h3>
    <h3>Ako imate ikakvih problema, možete kontaktirati admina ovdje: <span class="b">admin@gmail.com</span></h3>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 
import { auth, db } from '@/views/firebase'; 

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter(); 

    const submitForm = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        const userDocRef = doc(db, 'korisnik', user.uid); 
        const userDoc = await getDoc(userDocRef); 
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User data:', userData);

          if (userData.isAdmin) {
            console.log('Admin logged in');
            router.push('/account');
          } else {
            console.log('Regular user logged in');
            router.push('/account');
          }
        } 
        else {
          console.error('User document does not exist');
          alert('User document does not exist');
        }
        console.log('Logged in user:', userCredential.user);
      } catch (error) {
        console.error('Error logging in:', error);
        alert('Error logging in: ' + error.message);
      }
    };

    return {
      email,
      password,
      submitForm,
    };
  },
};
</script>

<style>
h1 {
  color: #330204;
  font-size: 60px;
}

.a {
  color: #330204;
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
input[type="password"] {
  width: 100%;
  padding: 8px;
  background-color: #f4c8ca;
  border: 1px solid #f4c8ca;
  border-radius: 3px;
}

button {
  width: 75px;
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
  color: #330204;
  align-content: center;
}

.b {
  color:#faabab;
}

</style>

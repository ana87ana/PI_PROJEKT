<template>
    <h1>MyMusicMinutes</h1>
    <div class="login-form">
      <form @submit.prevent="submitform">
        <div class="from-group">
          <label for="username"><span class="a">Username</span></label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="form-group">
          <label for="email"><span class="a">Email</span></label>
          <input type="text" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="password"><span class="a">Password</span></label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <div class="from-group">
          <label for="confirm"><span class="a">Confirm password</span></label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: ''
      };
    },
    methods: {
      submitForm() {
        console.log('Username:', this.username);
        console.log('Email:', this.email);
        console.log('Password:', this.password);
        this.$router.push('/account');
      }
    }
  };
  </script>
  
  <style>
  
  h1{
    color: black;
    font-size: 60px;
  }
  
  .a{
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
  input[type="password"] {
    width: 100%;
    padding: 8px;
    background-color: #f4c8ca;
    border: 1px solid #f4c8ca;
    border-radius: 3px;
  }
  
  button {
    width: 35%;
    align-content: left;
    padding: 10px;
    margin: 10px;
    background-color: #640d12;
    color:white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #3f0205;
  }

  h3{
    color:#000;
    align-content: center;
  }
  </style>

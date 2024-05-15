<template>
    <div class="header">
      <div class="title">Dobrodišli natrag!
        Za što ste zainteresirani danas?
      </div>
      </div>
      <div class="buttons">
        <router-link to="/songs">
          <button>SONGS</button>
        </router-link>
        <router-link to="/events">
          <button>EVENTS</button>
        </router-link>
      </div>
      <div class="account-link">
        <router-link to="/account">
          <div class="circle"></div>
        </router-link>
      </div>
    
  </template>
  
  <script>
  export default {
    // Vue.js component options
  };
  </script>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: center;
    align-content:center;
    padding: 10px;
    margin-top: 50px;
  }
  
  .title {
    font-size: 50px;
    color:#f4c8ca
  }
  
  .buttons button {
    background-color: #640d12;
    margin-left: 40px;
    margin-right: 40px;
    margin-top: 80px;
    padding-top: 50px;
    padding-bottom: 50px;
    padding-left: 35px;
    padding-right: 35px;
    font-size: 35px;
    color:#f4c8ca;
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
  
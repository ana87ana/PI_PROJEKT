<template>
    <div class="header">
      <div class="title">Za što ste zainteresirani danas?
      </div>
      </div>
      <div class="buttons">
        <router-link to="/post_song">
          <button><b>ADD SONG</b></button>
        </router-link>
        <router-link to="/songs">
          <button><b>FIND SONG</b></button>
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
    width: 17%;
    margin-left: 15%;
    margin-right: 15%;
    margin-top: 80px;
    padding-top: 50px;
    padding-bottom: 50px;
    padding-left: 60px;
    padding-right: 200px;
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
  
<template>
  <div class="account-page">
    <!-- Left third -->
    <div class="left-third">
      <!-- Profile picture -->
      <img class="profile-picture" :src="profilePictureUrl" alt="Profile Picture">

      <!-- Username -->
      <div class="username">{{ username }}</div>

      <!-- Navigation buttons -->
      <div class="navigation-buttons">
        <router-link to="/mainpage" class="button-link">
          <button>MAIN PAGE</button>
        </router-link>
        <router-link to="/post_event" class="button-link">
          <button>POSTAVI EVENT</button>
        </router-link>
        <router-link to="/my_top_ten" class="button-link">
          <button>MY TOP 10</button>
        </router-link>
        <button @click="logout" class="logout-button">Logout</button>
      </div>
    </div>

    <!-- Right two-thirds -->
    <div class="right-two-thirds">
      <!-- Songs and Events buttons -->
      <div class="songs-events-buttons">
        <button class="songs-button">OCIJENJENE PJESME</button>
        <button class="events-button">EVENTI</button>
      </div>

      <!-- Placeholder for songs or events -->
      <div class="songs-events-content">
        <!-- Content will be dynamically rendered here based on selected button -->
        <!-- For example, song elements or event details -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profilePictureUrl: 'https://via.placeholder.com/150', 
      username: 'User123',
      // Add data properties for songs and events if needed
    };
  },
  methods: {
    logout() {
      console.log('Logout clicked');
    }
  }
};
</script>

<style scoped>
.account-page {
  display: flex;
}

.left-third {
  flex: 1;
  background-color: #f4c8ca; /* Different color for left third */
  padding: 20px;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.username {
  margin-top: 10px;
  font-size: 20px;
}

.navigation-buttons {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

.button-link {
  margin-bottom: 10px; /* Add margin between buttons */
}

.logout-button {
  display: block;
  margin-top: 80px;
}

.right-two-thirds {
  flex: 2;
  padding: 20px;
}

.songs-events-buttons {
  display: flex;
  margin-bottom: 20px;
}

.songs-button, .events-button {
  flex: 1;
  margin-right: 10px;
}



/* Add additional styles for song elements, event details, etc. */
</style>

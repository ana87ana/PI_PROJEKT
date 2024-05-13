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
        <router-link to="/main_page">
          <button>MAIN PAGE</button>
        </router-link>
        <router-link to="/post_event">
          <button>POST EVENT</button>
        <router-link to="/my_top_ten">
          <button>MY TOP 10</button>
        </router-link>
        </router-link>
        <button @click="logout">Logout</button>
      </div>
    </div>

    <!-- Right two-thirds -->
    <div class="right-two-thirds">
      <!-- Songs -->
      <div class="songs-section">
        <h2>Songs</h2>
        <!-- Place for songs selection buttons -->
        <!-- Replace the following with your actual implementation -->
        <button>Select Song 1</button>
        <button>Select Song 2</button>
        <button>Select Song 3</button>
      </div>

      <!-- Events -->
      <div class="events-section">
        <h2>Events</h2>
        <!-- Place for events selection buttons -->
        <!-- Replace the following with your actual implementation -->
        <button>Select Event 1</button>
        <button>Select Event 2</button>
        <button>Select Event 3</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profilePictureUrl: 'https://via.placeholder.com/150', // Placeholder URL for profile picture
      username: 'User123' // Placeholder username
    };
  },
  methods: {
    logout() {
      // Add your logout logic here
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
  background-color: lightblue; /* Different color for left third */
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
  margin-top: 10px; /* Add margin above logout button */
}

.right-two-thirds {
  flex: 2;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.songs-section, .events-section {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 10px;
}
</style>

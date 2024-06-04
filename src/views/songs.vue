<template>
  <div>
    <h1>PJESME</h1>
  </div>
  <div class="filter-page">
    <div class="filter-box left">
      <h2>MOOD</h2>
      <div class="filter-items">
        <div v-for="(item, index) in moods" :key="index" class="filter-item">
          <input type="radio" name="mood" :id="'mood-radio-' + index" v-model="selectedMood" :value="item">
          <span class="a"><label :for="'mood-radio-' + index"><b>{{ item }}</b></label></span>
        </div>
      </div>
    </div>
    <div class="filter-box right">
      <h2>OCCASION</h2>
      <div class="filter-items">
        <div v-for="(item, index) in occasions" :key="index" class="filter-item">
          <input type="radio" name="occasion" :id="'occasion-radio-' + index" v-model="selectedOccasion" :value="item">
          <span class="a"><label :for="'occasion-radio-' + index"><b>{{ item }}</b></label></span>
        </div>
      </div>
    </div>
  </div>
  <div class="submit-button">
    <button @click="submitFilters"><b>SUBMIT</b></button>
  </div>
  <div class="account-link">
    <router-link to="/account">
      <div class="circle"></div>
    </router-link>
  </div>
</template>

<script>

export default {
  data() {
    return {
      moods: ['HAPPY', 'PENSIVE', 'ROMANTIC', 'ANGRY', 'SOOTHING', 'MYSTERIOUS', 'UPBEAT', 'CALM'],
      occasions: ['BIRTHDAY', 'POOL PARTY', 'WEDDING', 'NYE', 'ROADTRIP', 'WORKOUT', 'STUDYING', 'BREAKUP'],
      selectedMood: null,
      selectedOccasion: null
    };
  },
  methods: {
    submitFilters() {
      if (this.selectedMood && this.selectedOccasion) {
        this.$router.push({
          path: '/songs_filtered',
          query: {
            mood: this.selectedMood,
            occasion: this.selectedOccasion
          }
        });
      } else {
        alert("Please select a mood and an occasion.");
      }
    }
  }
};
</script>

<style scoped>

h1{
  color: #3f0205;
}

.a{
  color:#640d12;
}

.filter-page {
  display: flex;
  justify-content: space-between;
}

.filter-box {
  width: 45%;
  background-color: #f4c8ca;
  padding: 10px;
  margin: 20px;
}

.filter-box h2 {
  margin-top: 0;
  color:#3f0205;
}

.filter-items {
  display: flex;
  flex-wrap: wrap;
}

.filter-item {
  width: 50%; 
}

.filter-box label {
  display: block;
  margin-bottom: 5px;
}

.submit-button {
  text-align: center;
  margin-top: 20px;
}

button {
  padding-top: 10px;
  padding-left: 30px;
  padding-right: 80px;
  background-color: #640d12;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #3f0205;
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

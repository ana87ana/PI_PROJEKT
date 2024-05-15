<template>
    <div class="filter-page">
      <div class="filter-box left">
        <h2>Mood</h2>
        <div v-for="(item, index) in moods" :key="index">
          <input type="radio" name="mood" :id="'mood-radio-' + index" v-model="selectedMood" :value="item">
          <label :for="'mood-radio-' + index">{{ item }}</label>
        </div>
      </div>
      <div class="filter-box right">
        <h2>Occasion</h2>
        <div v-for="(item, index) in occasions" :key="index">
          <input type="radio" name="occasion" :id="'occasion-radio-' + index" v-model="selectedOccasion" :value="item">
          <label :for="'occasion-radio-' + index">{{ item }}</label>
        </div>
      </div>
      <button @click="submitFilters">Submit</button>
    </div>
  </template>
  
  <script>
  export default {
    
    data() {
      return {
        moods: ['Happy', 'Sad', 'Excited', 'Calm'], // Example moods
        occasions: ['Party', 'Study', 'Workout', 'Relax'], // Example occasions
        selectedMood: null,
        selectedOccasion: null
      };
    },
    methods: {
      submitFilters() {
        if (this.selectedMood && this.selectedOccasion) {
          // Here you would send the selected mood and occasion to Firebase
          // For simplicity, let's log the selected values for now
          console.log("Selected Mood:", this.selectedMood);
          console.log("Selected Occasion:", this.selectedOccasion);
          
          // After sending data to Firebase, navigate to the page listing songs
          this.$router.push('/song-list');
        } else {
          alert("Please select a mood and an occasion.");
        }
      }
    }
  };
  </script>
  
  <style>
  .filter-page {
    display: flex;
    justify-content: space-between;
  }
  
  .filter-box {
    width: 45%;
    border: 1px solid #ccc;
    padding: 10px;
  }
  
  .filter-box h2 {
    margin-top: 0;
  }
  
  .filter-box label {
    display: block;
    margin-bottom: 5px;
  }
  
  button {
    margin-top: 20px;
  }
  </style>
  
<template>
  <body>
  <nav>
    <div class="a"></div>
  </nav>
  <router-view/>
</body>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
}

body{
  background-color: #cd1d25;
  
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #000000;

    &.router-link-exact-active {
      color: #f4c8ca;
    }
  }
}
</style>

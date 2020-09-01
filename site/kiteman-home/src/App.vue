<template>
  <div id="app">
   
   <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: "App",
  components: {

  },
};
</script>

<style>
html{
  font-size: 62.5%;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-size: 1.6rem;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

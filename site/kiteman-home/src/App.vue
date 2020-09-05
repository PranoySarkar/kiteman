<template>
  <div id="app">
    <header>
      <h1>KiteMan</h1>
    </header>
    <main>
      <router-view></router-view>
    </main>
    <compfooter/>
  </div>
</template>

<script>
import compfooter from './components/footer.vue'
export default {
  name: "App",
  components: {compfooter},
  mounted: function () {
    document.title = "KiteMan";
  },
};
</script>

<style>
html {
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

header {


    overflow: hidden;
    padding: 0 0 0 10px;
    color: #f6542b;
    overflow: hidden;
}
header h1{
  text-shadow: 3px 2px 7px #bcbdba;
}
</style>

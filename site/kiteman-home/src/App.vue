<template>
  <div id="app">
    <header>
      <h1>KiteMan</h1>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
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
    /* background: linear-gradient(83deg, #393737, #837777); */
    /* border-bottom: 0px solid #ff9800; */
    border-right: 10px solid #8191a4c7;
    box-shadow: 3px 3px 6px 3px #6c6e7a38;
    overflow: hidden;
    padding: 0 0 0 10px;
    color: #f6542b;
    width: 43vw;
    border-bottom-right-radius: 80px;
    min-width: 200px;
}
</style>

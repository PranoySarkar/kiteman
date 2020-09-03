<template>
  <div id="homeContainer">
    <div id="hero">
      <div class="imageContainer">
        <img src="../assets/site-assets/hero.png" alt />
      </div>
      <div class="lecture">
        <div>
          <a
            class="callToActionLink"
            target="_blank"
            href="https://chrome.google.com/u/1/webstore/devconsole/b7258b33-d49c-432a-8930-e8c23fca9bde?hl=en"
          >Install Now</a>
        </div>
      </div>
    </div>
    <div class="eachFeature"></div>
  </div>
</template>


<script >
export default {
  name: "Home",
};
</script>


<style  scoped>
#hero {
  max-height: 80vh;
  overflow: hidden;

  max-width: 80vw;
  margin: auto;
  padding: 10px;
  margin-top: 20px;
  display: flex;
}

img {
  height: 100%;
  width: auto;
}

.imageContainer {
  height: 75vh;
  border: 1px solid #b9b8b8;
  border-radius: 2px;
  display: inline-block;
  padding: 10px;
  box-shadow: 0 0 7px 3px #c9c9c966;
}

.lecture {
  /* background: aliceblue; */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
}

.callToActionLink {
  background: white;
  padding: 16px 80px;
  /* min-width: 127px; */
  border: 1px solid #2c3e5066;
  border-radius: 2px;
  text-decoration: none;
  color: inherit;
  font-size: 3rem;
  box-shadow: -1px -2px 20px #bbadad4f;
  background: linear-gradient(45deg, #ffffff, #eceff3);
  transition: all 0.05s;
  /* color: #FFF; */
}

.callToActionLink:hover {
  box-shadow: -1px -2px 10px #bbadad4f;

  /* color: #FFF; */
}

.callToActionLink:active {
  box-shadow: unset;

  /* color: #FFF; */
}
</style>

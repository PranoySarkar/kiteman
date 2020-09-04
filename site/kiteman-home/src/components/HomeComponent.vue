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
            href="https://chrome.google.com/webstore/detail/kiteman/oocpgkebpklbfpfjfahedanbalgajifk"
          >Install Now</a>
        </div>
      </div>
    </div>
    <section class="features">
      <ol>
        <li>One Click Dashboard : In just one click you can see your whole portfolio from any tab.</li>
        <li>Easy Research : Lot of out of box customized Research Solutions to get optimal result quickly.</li>
        <li>Manage Watch List : You can sort your watch list, find top gainer/looser, do easy research, filter, etc.</li>
        <li>One click to recovery loss calculator.</li>
        <li>Get daily stock advice.</li>
        <li>Get hand curated Business News only which that affects the market.</li>
      </ol>
    </section>
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
  height: 42vw;
  max-height: 71vh;
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
  padding: 16px 5vw;
  /* min-width: 127px; */
  border: 1px solid #ffe9e9;
  border-radius: 2px;
  text-decoration: none;
  color: inherit;
  font-size: 3rem;
  color: #ffffff;
  box-shadow: 0px 15px 20px #1c1a1a42;
  background: linear-gradient(45deg, #5d5d5d, #7f2008);
  /* transition: all 0.05s; */
  display: inline-block;
  white-space: pre;
}

.callToActionLink:hover {
  /* color: #FFF; */
}

.callToActionLink:active {
  box-shadow: 0px 15px 20px #1c1a1a0e;

  /* color: #FFF; */
}

section {
  max-width: 90vw;
  margin: auto;
  margin-top: 40px;
  display: flex;
  justify-content: center;
}
h1 {
  color: #f6542b;
}

ol {
  border: 1px solid #dedddd;
  padding: 15px 15px 15px 35px;
  box-shadow: 2px 2px 6px 4px #eaeaea;
}
li {
  font-size: 1.8rem;
  margin: 12px;
}
</style>

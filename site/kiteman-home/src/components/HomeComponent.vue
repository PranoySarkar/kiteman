<template>
  <div id="homeContainer">
    <div id="hero">
      <div class="imageContainer">
        <iframe
          src="https://www.youtube.com/embed/kjeqSBWPx60?rel=0"
          frameborder="0"
          allow="encrypted-media; gyroscope;"
          allowfullscreen
        ></iframe>
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
    <section>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/jEj7F9D60m0"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </section>
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
  display: grid;
  grid-template-columns: auto auto;
  justify-content: center;
}

img {
  height: 100%;
  width: auto;
  border: 1px solid #dad3d3;
  padding: 10px;
  box-shadow: 0 0 7px 1px #0000002e;
  background: #f9f9f9;
}

.imageContainer {
  height: 80vh;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  max-width: 95vw;
  /* box-shadow: 0 0 0px #000;*/
}

.imageContainer iframe {
  width: 60vw;
  height: 34vw;
  background:#f6542b;
}
.lecture {
  padding: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
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

@media screen and (max-width: 1000px) {
  #hero {
    grid-template-columns: unset;
  }
  .imageContainer iframe {
    width: 87vw;
    height: 48vw;
    background: #f6542b;
  }
  .callToActionLink {
    padding: 16px 10vw;
  }
}

@media screen and (max-width: 700px) {
  img {
    width: 100%;
    height: auto;
  }

  .imageContainer {
    height: unset;
    max-width: 85vw;
    /* box-shadow: 0 0 0px #000;*/
  }
}
</style>

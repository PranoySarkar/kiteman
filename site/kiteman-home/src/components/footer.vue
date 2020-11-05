<template>
  <footer>
    <ul>
      <li>
        <a :href="`#/`">Home</a>
      </li>
      <li>
        <a :href="`#/loss-recovery-calculator`">Loss Recovery Calculator</a>
      </li>

      <li>
        <a :href="`#/help`">Help</a>
      </li>
      <li>
        <a :href="`#/feature`">feature request or report Bug</a>
      </li>
      <li>
        <a :href="`#/privacy-policy`">Privacy Policy</a>
      </li>
    </ul>

    <ul>
      <li>
        <a
          target="_blank"
          href="https://chrome.google.com/webstore/detail/kiteman/oocpgkebpklbfpfjfahedanbalgajifk"
        >Feedback & Rating</a>
      </li>
      <li>
        <a href="mailto:prnysarkar@gmail.com?subject=contact_us-">Contact Us</a>
      </li>

      <li>
        <a href="mailto:prnysarkar@gmail.com?subject=resolve_dispute-">Resolve Dispute</a>
      </li>
      <li>
        <a href="mailto:prnysarkar@gmail.com?subject=promotion-">Promotional request</a>
      </li>
    </ul>
  </footer>
</template>


<script >
export default {
  name: "compfooter",
};
</script>


<style  scoped>
footer {
  background: #f6542b;
  overflow: hidden;
  color: #fff;
  display: flex;
  justify-content: space-evenly;
  padding-bottom: 50px;
  margin-top: 100px;
}

footer a {
  color: #fff;
  text-decoration: none;
  /* border-bottom: 1px solid #f7eaea; */
  padding: 3px 0px;
  display: inline-block;
  text-transform: capitalize;
}

@media screen and (max-width: 1000px) {
}

@media screen and (max-width: 700px) {
  footer {
    display: grid;
  }
}
</style>

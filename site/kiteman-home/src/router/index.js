import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/HomeComponent.vue";
import LossRecoveryCalculatorComponent from "../components/LossRecoveryCalculatorComponent.vue";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
  
      

    },
    {
        path:'/loss-recovery-calculator',
        name:'loss-recovery-calculator',
        component:LossRecoveryCalculatorComponent,
       
    }
    
    /* ,
    {
      path: '/firstroute/:name',
      name: 'FirstRoute',
      component: FirstRoute,
      children: [
        {
          path: 'child',
          component: FirstRouteChild
        }
      ]
    } */
  ]
})
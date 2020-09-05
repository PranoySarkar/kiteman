import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/HomeComponent.vue";
import LossRecoveryCalculatorComponent from "../components/LossRecoveryCalculatorComponent.vue";
import CompPrivacyPolicy from "../components/privacy-policy.vue"
import compFeatureRequest from "../components/feature-request.vue"

Vue.use(Router)

export default new Router({
  scrollBehavior () {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path:'/help',
      redirect:'/'
    },
    {
      path:'/feature',
      component:compFeatureRequest
    },
    {
        path:'/loss-recovery-calculator',
        name:'loss-recovery-calculator',
        component:LossRecoveryCalculatorComponent,
    }
    ,
    {
        path:'/privacy-policy',
        name:'privacy-policy',
        component:CompPrivacyPolicy,
        
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

import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

const vm = new Vue({
    el: "#app",
    // render:(h) => {
    //     return h(App)
    // },
    template: `<App />`,
    components: {
        App
    }
})
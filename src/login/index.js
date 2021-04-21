import Vue from 'vue';
import App from './App';
import './index.scss';

let root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

let vm = new Vue({
  el: '#root',
  template: '<App/>',
  components: {
    App
  }
});

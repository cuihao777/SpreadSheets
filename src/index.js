import { createApp } from 'vue'
import App from './App.vue'

const rootNode = document.createElement("div");
rootNode.setAttribute("id","app");
document.body.appendChild(rootNode);

createApp(App).mount(rootNode)

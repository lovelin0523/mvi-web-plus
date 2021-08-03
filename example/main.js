import { createApp } from 'vue'
import App from './App.vue'
import mvi from "../packages"
const app = createApp(App)
app.use(mvi)
app.mount('#app')

app.config.globalProperties.dialogComponentWatch = function(name,type,el){
	console.log(name,type)
}
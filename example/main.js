import { createApp } from 'vue'
import App from './App.vue'
import mvi from "../packages"
const app = createApp(App)
app.use(mvi)
app.mount('#app')
import Px from "../packages/components/px/px"
app.config.globalProperties.dialogComponentWatch = function(name,type,el){
	if(name == 'show'){
		let node = el.querySelector('.mvi-modal-footer');
		let px = new Px(node,{attrName:'border-top-width'})
		px.init();
		let node2 = el.querySelector('.mvi-dialog-cancel');
		let px2 = new Px(node2,{attrName:'border-right-width'})
		px2.init()
	}
}
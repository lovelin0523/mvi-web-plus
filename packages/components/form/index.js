import form from "./form"
import formEl from "./form-el.vue"

form.install = app => {
	app.component(form.name, form)
	app.component(formEl.name, formEl)
}

export default form

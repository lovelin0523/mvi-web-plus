import verify from './verify'

verify.install = app => {
    app.component(verify.name, verify)
}

export default verify

import $dap from 'dap-util'
import Scroll from './scroll'

Scroll.install = app => {
    //监听元素滚动条到达顶部或者底部
    app.directive('scroll', {
        mounted(el, binding) {
            let options = {}
            if ($dap.common.isObject(binding.value)) {
                Object.assign(options, binding.value)
            }
            let scroll = new Scroll(el, options)
            scroll.init()
        }
    })
}

export default Scroll

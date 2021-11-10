<template>
    <div :data-id="'mvi-select-' + uid" :class="selectClass" :disabled="disabled || null">
        <div :data-id="'mvi-select-target-' + uid" :class="targetClass" :style="targetStyle" ref="target" @click="trigger" :disabled="disabled || null">
            <span :class="['mvi-select-label',selectLabel ? '' : 'mvi-select-label-placeholder']" :data-placeholder="placeholder" v-html="selectLabel"></span>
            <!-- 下拉图标 -->
            <m-icon :class="iconClass" :type="icon" />
        </div>
        <m-layer v-model="focus" :target="`[data-id='mvi-select-target-${uid}']`" :root="`[data-id='mvi-select-${uid}']`" :placement="placement" :offset="offset" :fixed="fixed" :fixed-auto="fixedAuto" :z-index="zIndex" closable :show-triangle="false" :wrapper-class="wrapperClass" :animation="animation" :timeout="timeout" shadow :border="false" @showing="layerShow" ref="layer">
            <div class="mvi-select-menu" ref="menu" :style="menuStyle">
                <div :class="['mvi-option','mvi-option-' + size]" @click="optionClick(item)" @mouseenter="mouseEnter($event, item)" @mouseleave="mouseLeave($event, item)" v-for="(item, index) in options" :key="'mvi-select-option-' + index" :disabled="item.disabled || null">
                    <div class="mvi-option-value" v-html="item.label"></div>
                    <m-icon v-if="isSelect(item)" :type="selectedIconType" :spin="selectedIconSpin" :size="selectedIconSize" :url="selectedIconUrl" :color="selectedIconColor" />
                </div>
            </div>
        </m-layer>
        <input type="hidden" :value="formData" :name="name" />
    </div>
</template>

<script>
import { getCurrentInstance } from 'vue'
import $dap from 'dap-util'
import mIcon from '../icon/icon'
import mLayer from '../layer/layer'
export default {
    name: 'm-select',
    emits: ['update:modelValue', 'change'],
    data() {
        return {
            //是否点击达到了获取焦点效果
            focus: false,
            target: null
        }
    },
    props: {
        //选项
        options: {
            type: Array,
            default: []
        },
        //选择的值
        modelValue: {
            type: [Object, Number, String, Array],
            default: null
        },
        //占位符
        placeholder: {
            type: String,
            default: ''
        },
        //尺寸
        size: {
            type: String,
            default: 'medium',
            validator(value) {
                return ['small', 'medium', 'large'].includes(value)
            }
        },
        //layer位置
        placement: {
            type: String,
            default: 'bottom-start'
        },
        //layer的fixed
        fixed: {
            type: Boolean,
            default: false
        },
        //layer适配transform父容器
        fixedAuto: {
            type: Boolean,
            default: false
        },
        //layer的width
        width: {
            type: String,
            default: null
        },
        //layer的z-index
        zIndex: {
            type: Number,
            default: 400
        },
        //layer的offset
        offset: {
            type: String,
            default: '0.1rem'
        },
        //layer最大高度
        height: {
            type: String,
            default: null
        },
        //layer的额外样式
        wrapperClass: {
            type: String,
            default: null
        },
        //layer显示与隐藏动画
        animation: {
            type: String,
            default: null
        },
        //layer动画时长
        timeout: {
            type: Number,
            default: 300
        },
        //输入框激活样式
        activeType: {
            type: String,
            default: 'info',
            validator(value) {
                return ['info', 'success', 'warn', 'primary', 'error'].includes(
                    value
                )
            }
        },
        //输入框激活颜色
        activeColor: {
            type: String,
            default: null,
            validator(value) {
                return $dap.common.matchingText(value, 'hex')
            }
        },
        //是否禁用
        disabled: {
            type: Boolean,
            default: false
        },
        //下拉图标
        icon: {
            type: String,
            default: 'caret-down'
        },
        //原生name属性
        name: {
            type: String,
            default: null
        },
        //layer层列表悬浮样式
        hoverClass: {
            type: String,
            default: null
        },
        //是否圆角
        round: {
            type: Boolean,
            default: false
        },
        //是否方形
        square: {
            type: Boolean,
            default: false
        },
        //是否多选
        multiple: {
            type: Boolean,
            default: false
        },
        //选择时显示内容的过滤方法
        filterMethod: {
            type: Function,
            default: null
        },
        //是否显示已选择的icon
        showSelectIcon: {
            type: Boolean,
            default: true
        },
        //已选择标志icon
        selectedIcon: {
            type: [String, Object],
            default: null
        }
    },
    setup() {
        const instance = getCurrentInstance()
        return {
            uid: instance.uid
        }
    },
    computed: {
        formData() {
            if (this.multiple && Array.isArray(this.modelValue)) {
                return this.modelValue.join(',')
            }
            return this.modelValue
        },
        menuStyle() {
            let style = {}
            if (this.height) {
                style.maxHeight = this.height
            }
            return style
        },
        selectClass() {
            let cls = ['mvi-select', 'mvi-select-' + this.size]
            if (this.round) {
                cls.push('mvi-select-round')
            } else if (this.square) {
                cls.push('mvi-select-square')
            }
            return cls
        },
        targetClass() {
            let cls = ['mvi-select-target']
            if (this.activeType && !this.activeColor && this.focus) {
                cls.push('mvi-select-' + this.activeType)
            }
            return cls
        },
        targetStyle() {
            let style = {}
            if (this.activeColor && this.focus) {
                style.borderColor = this.activeColor
                const rgb = $dap.color.hex2rgb(this.activeColor)
                style.boxShadow = `0 0 0.16rem rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.5)`
            }
            return style
        },
        iconClass() {
            let cls = ['mvi-select-icon']
            if (this.focus) {
                cls.push('mvi-select-active')
            }
            return cls
        },
        selectLabel() {
            if (this.multiple) {
                let labels = []
                this.options.forEach((item, index) => {
                    if (Array.isArray(this.modelValue)) {
                        let flag = this.modelValue.some(i => {
                            return $dap.common.equal(i, item.value)
                        })
                        if (flag) {
                            labels.push(item.label)
                        }
                    }
                })
                if (typeof this.filterMethod == 'function') {
                    return this.filterMethod(labels)
                } else {
                    return labels.join(' ')
                }
            } else {
                let label = ''
                this.options.forEach((item, index) => {
                    if ($dap.common.equal(this.modelValue, item.value)) {
                        label = item.label
                    }
                })
                if (typeof this.filterMethod == 'function') {
                    return this.filterMethod(label)
                } else {
                    return label
                }
            }
        },
        isSelect() {
            return item => {
                if (this.multiple) {
                    let flag = this.modelValue.some(i => {
                        return $dap.common.equal(i, item.value)
                    })
                    return this.showSelectIcon && flag
                }
                return false
            }
        },
        selectedIconType() {
            let type = 'success'
            if ($dap.common.isObject(this.selectedIcon)) {
                if (typeof this.selectedIcon.type == 'string') {
                    type = this.selectedIcon.type
                }
            } else if (typeof this.selectedIcon == 'string') {
                type = this.selectedIcon
            }
            return type
        },
        selectedIconSize() {
            let size = null
            if ($dap.common.isObject(this.selectedIcon)) {
                if (typeof this.selectedIcon.size == 'string') {
                    size = this.selectedIcon.size
                }
            }
            return size
        },
        selectedIconUrl() {
            let url = null
            if ($dap.common.isObject(this.selectedIcon)) {
                if (typeof this.selectedIcon.url == 'string') {
                    url = this.selectedIcon.url
                }
            }
            return url
        },
        selectedIconSpin() {
            let spin = false
            if ($dap.common.isObject(this.selectedIcon)) {
                if (typeof this.selectedIcon.spin == 'boolean') {
                    spin = this.selectedIcon.spin
                }
            }
            return spin
        },
        selectedIconColor() {
            let color = null
            if ($dap.common.isObject(this.selectedIcon)) {
                if (typeof this.selectedIcon.color == 'string') {
                    color = this.selectedIcon.color
                }
            }
            return color
        }
    },
    components: {
        mLayer,
        mIcon
    },
    methods: {
        //layer显示前进行宽度设置
        layerShow() {
            if (this.width) {
                this.$refs.menu.style.width = this.width
            } else {
                this.$refs.menu.style.width =
                    this.$refs.target.offsetWidth + 'px'
            }
        },
        //鼠标移入选项
        mouseEnter(e, item) {
            if (this.disabled || item.disabled) {
                return
            }
            if (this.hoverClass) {
                $dap.element.addClass(e.currentTarget, this.hoverClass)
            }
        },
        //鼠标移出选项
        mouseLeave(e, item) {
            if (this.disabled || item.disabled) {
                return
            }
            if (this.hoverClass) {
                $dap.element.removeClass(e.currentTarget, this.hoverClass)
            }
        },
        //点击选项
        optionClick(item) {
            if (this.disabled || item.disabled) {
                return
            }
            if (this.multiple) {
                let arr = this.modelValue
                if (!Array.isArray(arr)) {
                    throw new TypeError('modelValue should be an array')
                }
                let flag = arr.some(tmp => {
                    return $dap.common.equal(tmp, item.value)
                })
                if (flag) {
                    arr = arr.filter(tmp => {
                        return !$dap.common.equal(tmp, item.value)
                    })
                } else {
                    arr.push(item.value)
                }
                this.$emit('update:modelValue', arr)
                this.$emit(
                    'change',
                    this.options.filter(tmp => {
                        return arr.some(tmp2 => {
                            return $dap.common.equal(tmp.value, tmp2)
                        })
                    })
                )
            } else {
                this.$emit('update:modelValue', item.value)
                this.$emit('change', item)
            }
            this.trigger()
        },
        //触发选择打开或关闭
        trigger() {
            if (this.disabled) {
                return
            }
            this.focus = !this.focus
        }
    }
}
</script>

<style lang="less" scoped>
@import '../../css/mvi-basic.less';

.mvi-select {
    display: block;
    width: 100%;
    position: relative;
    font-family: @font-family;
    color: @font-color-default;
    border-radius: @radius-default;
    background-color: #fff;

    //大小
    &.mvi-select-small {
        .mvi-select-target {
            height: @small-height;
            font-size: @font-size-small;
            padding: 0 @mp-sm*3 0 @mp-sm;
        }

        .mvi-select-icon {
            right: @mp-sm;
            font-size: @font-size-small;
        }
    }

    &.mvi-select-medium {
        .mvi-select-target {
            height: @medium-height;
            font-size: @font-size-default;
            padding: 0 @mp-md*3 0 @mp-md;
        }

        .mvi-select-icon {
            right: @mp-md;
            font-size: @font-size-default;
        }
    }

    &.mvi-select-large {
        .mvi-select-target {
            height: @large-height;
            font-size: @font-size-h6;
            padding: 0 @mp-lg*3 0 @mp-lg;
        }

        .mvi-select-icon {
            right: @mp-lg;
            font-size: @font-size-h6;
        }
    }

    &.mvi-select-round {
        border-radius: @radius-round;
    }

    &.mvi-select-square {
        border-radius: 0;
    }

    &[disabled] {
        opacity: 0.6;
    }
}

.mvi-select-target {
    display: flex;
    display: -webkit-flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    width: 100%;
    background-color: inherit;
    border: 1px solid @border-color;
    border-radius: inherit;
    transition: border-color 600ms, box-shadow 600ms;
    -webkit-transition: border-color 600ms, box-shadow 600ms;
    box-shadow: none;
    cursor: pointer;
    color: inherit;

    //输入框样式
    &.mvi-select-info {
        border-color: @info-normal;
        box-shadow: 0 0 0.16rem @info-shadow;
    }

    &.mvi-select-success {
        border-color: @success-normal;
        box-shadow: 0 0 0.16rem @success-shadow;
    }

    &.mvi-select-primary {
        border-color: @primary-normal;
        box-shadow: 0 0 0.16rem @primary-shadow;
    }

    &.mvi-select-warn {
        border-color: @warn-normal;
        box-shadow: 0 0 0.16rem @warn-shadow;
    }

    &.mvi-select-error {
        border-color: @error-normal;
        box-shadow: 0 0 0.16rem @error-shadow;
    }

    &[disabled] {
        background-color: inherit;
        color: inherit;
    }
}

.mvi-select-label {
    position: relative;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    //placeholder样式
    &.mvi-select-label-placeholder::before {
        position: relative;
        content: attr(data-placeholder);
        color: inherit;
        font-family: inherit;
        font-size: inherit;
        opacity: 0.5;
        vertical-align: middle;
    }
}

.mvi-select-icon {
    position: absolute;
    top: auto;
    color: inherit;
    opacity: 0.6;
    transition: transform 200ms;
    -ms-transition: transform 200ms;
    -webkit-transition: transform 200ms;
    -moz-transition: transform 200ms;

    &.mvi-select-active {
        transform: rotate(180deg);
    }
}

.mvi-select-menu {
    display: block;
    padding: 0;
    overflow: auto;
    overflow-x: hidden;
    padding: @mp-xs 0;
}

.mvi-option {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    align-items: center;

    &.mvi-option-small {
        padding: @mp-xs @mp-sm;
        font-size: @font-size-small;
    }

    &.mvi-option-medium {
        padding: @mp-sm @mp-md;
        font-size: @font-size-default;
    }

    &.mvi-option-large {
        font-size: @font-size-h6;
        padding: @mp-md @mp-lg;
    }

    &:hover:not([disabled]) {
        cursor: pointer;
        background-color: @bg-color-default;
    }

    &[disabled] {
        opacity: 0.6;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
    }
}

.mvi-option-value {
    display: flex;
    display: -webkit-flex;
    justify-content: flex-start;
    align-items: center;
}
</style>

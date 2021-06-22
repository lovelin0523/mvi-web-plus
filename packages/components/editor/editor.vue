<template>
	<div class="mvi-editor">
		<div class="mvi-editor-menus" :style="{ border: border ? '' : 'none' }" v-if="showMenus" :disabled="disabled || null">
			<m-editor-item
				v-for="(item, index) in computedMenuKeysForShow"
				:value="item"
				:menu="computedMenus[item]"
				:ref="setMenuRefs"
			></m-editor-item>
		</div>
		<div class="mvi-editor-body">
			<div
				v-if="codeViewShow"
				v-text="initalHtml"
				key="code"
				:contenteditable="!disabled || null"
				:style="codeViewStyle"
				:class="codeViewClass"
				ref="codeView"
				@input="codeViewInput"
				@keydown="tabDown"
			></div>
			<div
				v-else
				ref="content"
				@blur="contentBlur"
				@focus="contentFocus"
				@click="changeActive"
				@input="contentInput"
				:class="contentClass"
				key="content"
				@keydown="tabDown"
				:contenteditable="!disabled || null"
				:style="contentStyle"
				v-html="initalHtml"
				:data-placeholder="placeholder"
			></div>
		</div>
	</div>
</template>

<script>
import $util from '../../util/util.js';
import editorItem from './edotir-item';
export default {
	name: 'm-editor',
	data() {
		return {
			menuRefs:[],
			range: null, //选区
			codeViewShow: false, //源码是否显示
			initalHtml:'',//初始值
			html: '', //html内容
			text: '', //text内容
			isModelChange:false,//是否双向绑定改变值
			//默认菜单浮层配置
			defaultLayerProps: {
				fixed: false, //是否fixed
				fixedAuto:false,//适配fixed下tansform父元素
				placement: 'bottom-start', //位置
				zIndex: 400 ,//浮层z-index
				offset:'0.1rem',
				wrapperClass:null,
				timeout:200,
				showTriangle:false,
				animation:null,
				shadow:true,
				border:true,
				borderColor:'#eee',
				background:'#fff'
			},
			defaultMenus: {
				//默认菜单配置
				undo: true, //撤销
				redo: true, //恢复
				removeFormat: true, //移除格式
				selectAll: true, //全选
				divider: true, //分割线
				tag: [
					//标签
					{
						label: 'H1',
						value: 'h1'
					},
					{
						label: 'H2',
						value: 'h2'
					},
					{
						label: 'H3',
						value: 'h3'
					},
					{
						label: 'H4',
						value: 'h4'
					},
					{
						label: 'H5',
						value: 'h5'
					},
					{
						label: 'H6',
						value: 'h6'
					},
					{
						label: '段落',
						value: 'p'
					}
				],
				fontSize: [
					//字号
					{
						label: '12px',
						value: '0.24rem'
					},
					{
						label: '14px',
						value: '0.28rem'
					},
					{
						label: '16px',
						value: '0.32rem'
					},
					{
						label: '20px',
						value: '0.4rem'
					},
					{
						label: '30px',
						value: '0.6rem'
					},
					{
						label: '40px',
						value: '0.8rem'
					}
				],
				fontFamily: ['PingFang SC', 'Helvetica Neue', 'kaiTi', 'Microsoft YaHei', 'Arial', 'sans-serif'], //字体
				bold: true, //加粗
				italic: true, //斜体
				underline: true, //下划线
				strikeThrough: true, //删除线
				subscript: true, //下标
				superscript: true, //上标
				foreColor: [
					//字体颜色
					'#000000',
					'#505050',
					'#808080',
					'#BBBBBB',
					'#CCCCCC',
					'#EEEEEE',
					'#F7F7F7',
					'#FFFFFF',
					'#EC1A0A',
					'#FF9900',
					'#FFFF00',
					'#07C160',
					'#00FFFF',
					'#0B73DE',
					'#9C00FF',
					'#FF00FF',
					'#F7C6CE',
					'#FFE7CE',
					'#FFEFC6',
					'#D6EFD6',
					'#CEDEE7',
					'#CEE7F7',
					'#D6D6E7',
					'#E7D6DE',
					'#E79C9C',
					'#FFC69C',
					'#FFE79C',
					'#B5D6A5',
					'#A5C6CE',
					'#9CC6EF',
					'#B5A5D6',
					'#D6A5BD',
					'#e45649',
					'#F7AD6B',
					'#FFD663',
					'#94BD7B',
					'#73A5AD',
					'#6BADDE',
					'#8C7BC6',
					'#C67BA5',
					'#CE0000',
					'#E79439',
					'#EFC631',
					'#50a14f',
					'#4A7B8C',
					'#03A8F3',
					'#634AA5',
					'#A54A7B',
					'#9C0000',
					'#B56308',
					'#BD9400',
					'#397B21',
					'#104A5A',
					'#085294',
					'#311873',
					'#731842',
					'#630000',
					'#7B3900',
					'#986801',
					'#295218',
					'#083139',
					'#003163',
					'#21104A',
					'#4A1031'
				],
				backColor: [
					//背景色
					'#000000',
					'#505050',
					'#808080',
					'#BBBBBB',
					'#CCCCCC',
					'#EEEEEE',
					'#F7F7F7',
					'#FFFFFF',
					'#EC1A0A',
					'#FF9900',
					'#FFFF00',
					'#07C160',
					'#00FFFF',
					'#0B73DE',
					'#9C00FF',
					'#FF00FF',
					'#F7C6CE',
					'#FFE7CE',
					'#FFEFC6',
					'#D6EFD6',
					'#CEDEE7',
					'#CEE7F7',
					'#D6D6E7',
					'#E7D6DE',
					'#E79C9C',
					'#FFC69C',
					'#FFE79C',
					'#B5D6A5',
					'#A5C6CE',
					'#9CC6EF',
					'#B5A5D6',
					'#D6A5BD',
					'#E76363',
					'#F7AD6B',
					'#FFD663',
					'#94BD7B',
					'#73A5AD',
					'#6BADDE',
					'#8C7BC6',
					'#C67BA5',
					'#CE0000',
					'#E79439',
					'#EFC631',
					'#6BA54A',
					'#4A7B8C',
					'#03A8F3',
					'#634AA5',
					'#A54A7B',
					'#9C0000',
					'#B56308',
					'#BD9400',
					'#397B21',
					'#104A5A',
					'#085294',
					'#311873',
					'#731842',
					'#630000',
					'#7B3900',
					'#846300',
					'#295218',
					'#083139',
					'#003163',
					'#21104A',
					'#4A1031'
				],
				list: [
					//列表
					{
						label: '有序列表',
						value: 'ol',
						icon: 'ol'
					},
					{
						label: '无序列表',
						value: 'ul',
						icon: 'ul'
					}
				],
				justify: [
					//对齐方式
					{
						label: '左对齐',
						value: 'left',
						icon: 'align-left'
					},
					{
						label: '居中对齐',
						value: 'center',
						icon: 'align-center'
					},
					{
						label: '右对齐',
						value: 'right',
						icon: 'align-right'
					},
					{
						label: '两端对齐',
						value: 'justify',
						icon: 'align-justify'
					}
				],
				quote: true, //引用
				link: [
					//链接
					{
						label: '插入链接',
						value: 'link'
					}
				],
				image: [
					//插入图片
					{
						label: '本地上传',
						value: 'upload'
					},
					{
						label: '网络图片',
						value: 'remote'
					}
				],
				video: [
					//插入视频
					{
						label: '本地上传',
						value: 'upload'
					},
					{
						label: '网络视频',
						value: 'remote'
					}
				],
				table: [
					//插入表格
					{
						label: '插入表格',
						value: 'table'
					}
				],
				code: true, //插入代码
				codeView: false //显示源码
			},
			defaultTooltips: {
				//默认的工具提示内容
				undo: '撤销',
				redo: '恢复',
				removeFormat: '清除格式',
				selectAll: '全选',
				divider: '分割线',
				tag: '标签',
				fontSize: '字号',
				fontFamily: '字体',
				bold: '加粗',
				italic: '斜体',
				underline: '下划线',
				strikeThrough: '删除线',
				subscript: '下标',
				superscript: '上标',
				foreColor: '字体颜色',
				backColor: '背景色',
				list: '列表',
				justify: '对齐方式',
				quote: '引用',
				link: '插入链接',
				image: '插入图片',
				video: '插入视频',
				table: '插入表格',
				code: '插入代码',
				codeView: '显示源码'
			},
			defaultTooltipProps: {
				//默认工具提示组件参数配置
				placement: 'bottom',
				timeout: 400,
				color: '#333',
				textColor: '#fff',
				borderColor: '#333',
				offset:'0.1rem',
				zIndex:100,
				fixed:false,
				fixedAuto:false,
				width:null,
				animation:null,
				showTriangle:true
			},
			defaultUploadImageProps: {
				//默认上传图片配置
				multiple: false, //是否多选
				allowedFileType: ['jpg', 'png', 'JPG', 'PNG', 'JPEG', 'jpeg', 'gif', 'GIF','jfif','JFIF'], //限定格式
				accept: 'image', //限制类型
				minSize: -1, //限制单个图片最小值，单位kb
				maxSize: -1, //限定单个图片最大值，单位kb
				minLength: -1, //多选时选择图片的最小数量
				maxLength: -1 //多选时选择图片的最大数量
			},
			defaultUploadVideoProps: {
				//默认上传视频配置
				multiple: false, //是否多选
				allowedFileType: ['mp4', 'MP4', 'avi', 'AVI', 'WAV', 'wav'], //限定格式
				accept: 'video', //限制类型
				minSize: -1, //限制单个视频最小值，单位kb
				maxSize: -1, //限定单个视频最大值，单位kb
				minLength: -1, //多选时选择视频的最小数量
				maxLength: -1 //多选时选择视频的最大数量
			},
			defaultVideoShowProps: {
				//视频显示设置
				autoplay: true, //视频是否自动播放
				muted: true, //视频静音
				controls: false, //是否显示控制器
				loop: false //是否循环
			},
			defaultMenuIcons: {
				//默认菜单项图标
				undo: 'undo',
				redo: 'redo',
				removeFormat: 'clear',
				selectAll: 'check-square',
				divider: 'divider',
				tag: 'font-title',
				bold: 'bold',
				fontSize: 'font-size',
				fontFamily: 'font',
				italic: 'italic',
				underline: 'underline',
				strikeThrough: 'strikethrough',
				subscript: 'subscript',
				superscript: 'superscript',
				foreColor: 'color-picker',
				backColor: 'brush',
				link: 'link',
				list: 'ul',
				justify: 'align-justify',
				quote: 'quote',
				image: 'image',
				table: 'table-alt',
				video: 'video',
				code: 'code',
				codeView: 'eye'
			}
		}
	},
	emits:['update:value','upload-image','upload-video','custom','blur','focus','input'],
	props: {
		//值
		value: {
			type: String,
			default: ''
		},
		//是否自动获取焦点
		autofocus: {
			type: Boolean,
			default: false
		},
		//占位符
		placeholder: {
			type: String,
			default: ''
		},
		//初始高度
		height: {
			type: String,
			default: null
		},
		//编辑区域高度是否自动变化
		autoHeight: {
			type: Boolean,
			default: false
		},
		//是否禁用
		disabled: {
			type: Boolean,
			default: false
		},
		//是否显示菜单栏
		showMenus: {
			type: Boolean,
			default: true
		},
		//编辑区域边框是否显示
		border: {
			type: Boolean,
			default: true
		},
		//菜单配置
		menus: {
			type: Object,
			default: function() {
				return {};
			}
		},
		//菜单项浮层参数
		layerProps: {
			type: Object,
			default: function() {
				return {};
			}
		},
		//触发悬浮层显现的方式
		trigger: {
			type: String,
			default: 'click',
			validator(value) {
				return ['hover', 'click'].includes(value);
			}
		},
		//本地上传文件是否使用base64
		useBase64: {
			type: Boolean,
			default: true
		},
		//是否使用tooltip
		useTooltip: {
			type: Boolean,
			default: true
		},
		//提示内容配置
		tooltips: {
			type: Object,
			default: function() {
				return {};
			}
		},
		//提示组件参数配置
		tooltipProps: {
			type: Object,
			default: function() {
				return {};
			}
		},
		//自定义上传图片配置
		uploadImageProps: {
			type: Object,
			default: function() {
				return {};
			}
		},
		//自定义上传视频配置
		uploadVideoProps: {
			type: Object,
			default: function() {
				return {};
			}
		},
		//自定义上传图片出错回调
		uploadImageError: {
			type: Function
		},
		//自定义上传视频出错回调
		uploadVideoError: {
			type: Function
		},
		//自定义视频显示设置
		videoShowProps: {
			type: Object,
			default: function() {
				return {};
			}
		},
		//自定义菜单项图标
		menuIcons: {
			type: Object,
			default: function() {
				return {};
			}
		},
		//激活判定
		customActive: {
			type: Function,
			default: function() {
				return false;
			}
		},
		//激活颜色设定
		activeColor:{
			type:String,
			default:'#0b73de'
		}
	},
	computed: {
		//显示的菜单键数组
		computedMenuKeysForShow(){
			let arr = [];
			this.computedMenuKeys.forEach(key=>{
				if(this.showMenuItem(key)){
					arr.push(key);
				}
			})
			return arr;
		},
		//是否显示指定菜单项
		showMenuItem() {
			return key => {
				if (typeof this.computedMenus[key] == 'boolean') {
					return this.computedMenus[key];
				} else if (Array.isArray(this.computedMenus[key])) {
					return this.computedMenus[key].length > 0;
				} else {
					return false;
				}
			};
		},
		//菜单配置值
		computedMenus() {
			let menus = {};
			Object.keys(this.defaultMenus).forEach(key => {
				//数组
				if (Array.isArray(this.defaultMenus[key])) {
					let newArray = [];
					this.defaultMenus[key].forEach(item => {
						if ($util.isObject(item) && item.label && item.value) {
							let obj = {
								label: item.label,
								value: item.value
							};
							if (item.icon) {
								obj.icon = item.icon;
							}
							newArray.push(obj);
						} else if (typeof item == 'string' || $util.isNumber(item)) {
							newArray.push({
								label: item,
								value: item
							});
						}
					});
					menus[key] = newArray;
				} else if (typeof this.defaultMenus[key] == 'boolean') {
					//非数组情况只能是布尔值
					menus[key] = this.defaultMenus[key];
				}
			});
			return menus;
		},
		//菜单配置项所有的键数组
		computedMenuKeys() {
			return Object.keys(this.computedMenus);
		},
		//编辑区域样式类
		contentClass() {
			let cls = ['mvi-editor-content'];
			if (this.autoHeight) {
				cls.push('mvi-editor-content-auto');
			}
			if (this.html == '<p><br></p>' || this.html == '' || this.html == '<br>' || this.html == '<p></p>') {
				cls.push('mvi-editor-content-empty');
			}
			return cls;
		},
		//源码视图样式类
		codeViewClass() {
			let cls = ['mvi-editor-codeview'];
			if (this.autoHeight) {
				cls.push('mvi-editor-codeview-auto')
			}
			return cls;
		},
		//编辑区域样式
		contentStyle() {
			let style = {};
			if (this.autoHeight) {
				if (this.height) {
					style.minHeight = this.height;
				}
			} else {
				if (this.height) {
					style.height = this.height;
				}
			}
			if (!this.border) {
				style.border = 'none';
			}
			return style;
		},
		//源码视图样式
		codeViewStyle() {
			let style = {};
			if (this.autoHeight) {
				if (this.height) {
					style.minHeight = this.height;
				}
			} else {
				if (this.height) {
					style.height = this.height;
				}
			}
			return style;
		}
	},
	provide() {
		return {
			editor: this
		};
	},
	components: {
		mEditorItem: editorItem
	},
	mounted() {
		this.init(); 
	},
	watch:{
		value(newValue){
			if(!this.isModelChange){
				if(this.$refs.content){
					this.$refs.content.innerHTML = this.getValue();
				}else if(this.$refs.codeView){
					this.$refs.codeView.innerText = this.getValue();
				}
				this.updateHtmlText();
			}
		}
	},
	methods: {
		//获取菜单项组件数组
		setMenuRefs(el){
			if(el){
				this.menuRefs.push(el);
			}
		},
		//初始化
		init() {
			//将自定义的菜单项浮层配置与默认配置整合
			this.defaultLayerProps = this.initOption(this.defaultLayerProps, this.layerProps);
			//将自定义的菜单栏配置与默认配置整合
			this.defaultMenus = this.initOption(this.defaultMenus, this.menus);
			//将自定义的提示内容与默认提示整合
			this.defaultTooltips = this.initOption(this.defaultTooltips, this.tooltips);
			//将自定义的工具提示组件参数与默认工具提示组件参数整合
			this.defaultTooltipProps = this.initOption(this.defaultTooltipProps, this.tooltipProps);
			//将自定义上传图片配置参数与默认上传图片配置参数整合
			this.defaultUploadImageProps = this.initOption(this.defaultUploadImageProps, this.uploadImageProps);
			//将自定义上传视频配置参数与默认上传视频配置参数整合
			this.defaultUploadVideoProps = this.initOption(this.defaultUploadVideoProps, this.uploadVideoProps);
			//将自定义的视频配置参数与默认的视频配置参数整合
			this.defaultVideoShowProps = this.initOption(this.defaultVideoShowProps, this.videoShowProps);
			//将自定义的菜单项图标配置与默认的菜单项图标配置整合
			this.defaultMenuIcons = this.initOption(this.defaultMenuIcons, this.menuIcons);
			//定义段落分隔符
			document.execCommand('defaultParagraphSeparator', false, 'p');
			//使用css
			document.execCommand('styleWithCSS', false, true);
			//初始化赋值
			this.initalHtml = this.getValue();
			this.$nextTick(()=>{
				this.updateHtmlText();
			})
			if (this.autofocus) {
				this.collapseToEnd();
			}
		},
		//对外提供的用以插入图片的api
		insertImage(url) {
			if (this.disabled) {
				return;
			}
			document.execCommand('insertHtml', false, `<img src="${url}" class="mvi-editor-image" />`);
		},
		//对外提供的用以插入视频的api
		insertVideo(url) {
			if (this.disabled) {
				return;
			}
			let video = $util.string2dom(`<video src="${url}" class="mvi-editor-video"></video>`);
			if (this.defaultVideoShowProps.muted) {
				video.setAttribute('muted', 'muted');
			}
			if (this.defaultVideoShowProps.loop) {
				video.setAttribute('loop', 'loop');
			}
			if (this.defaultVideoShowProps.controls) {
				video.setAttribute('controls', 'controls');
			}
			if (this.defaultVideoShowProps.autoplay) {
				video.setAttribute('autoplay', 'autoplay');
			}
			document.execCommand('insertHtml', false, video.outerHTML);
		},
		//对外提供的用以清除内容的api
		empty() {
			if (this.disabled) {
				return;
			}
			if(this.$refs.content){
				this.$refs.content.innerHTML = '<p><br></p>';
			}else if(this.$refs.codeView){
				this.$refs.codeView.innerText = '<p><br></p>';
			}
			this.updateHtmlText()
			this.updateValue()
			this.collapseToEnd()
		},
		//保存选区，可对外提供
		saveRange() {
			if (this.disabled) {
				return;
			}
			let selection = window.getSelection();
			if (selection.getRangeAt && selection.rangeCount) {
				this.range = selection.getRangeAt(0);
			}
		},
		//恢复选区，可对外提供
		restoreRange() {
			if (this.disabled) {
				return;
			}
			let selection = window.getSelection();
			selection.removeAllRanges();
			if (this.range) {
				selection.addRange(this.range);
			}
		},
		//将编辑区域光标移至最后，可对外提供
		collapseToEnd() {
			if (this.disabled) {
				return;
			}
			let el = null;
			if (this.$refs.content) {
				el = this.$refs.content;
			} else if (this.$refs.codeView) {
				el = this.$refs.codeView;
			}
			el.focus();
			let selection = window.getSelection();
			selection.selectAllChildren(el);
			selection.collapseToEnd();
		},
		//根据选区获取节点，可对外提供
		getSelectNode() {
			if (this.disabled) {
				return;
			}
			if (!this.range) {
				return null;
			}
			let node = this.range.commonAncestorContainer;
			if ($util.isElement(node)) {
				return node;
			} else {
				return node.parentNode;
			}
		},
		//改变菜单项激活状态，可对外提供
		changeActive() {
			if (this.disabled) {
				return;
			}
			if (!this.showMenus) {
				return;
			}
			this.saveRange();
			let node = this.getSelectNode();
			this.menuRefs.forEach(item => {
				switch (item.value) {
					case 'bold':
						if (this.compareCss(node, 'font-weight', 'bold') || this.compareCss(node, 'font-weight', '700')) {
							item.menuActive = true;
						} else {
							item.menuActive = false;
						}
						break;
					case 'italic':
						if (this.compareCss(node, 'font-style', 'italic')) {
							item.menuActive = true;
						} else {
							item.menuActive = false;
						}
						break;
					case 'underline':
						if (this.compareCss(node, 'text-decoration-line', 'underline')) {
							item.menuActive = true;
						} else {
							item.menuActive = false;
						}
						break;
					case 'strikeThrough':
						if (this.compareCss(node, 'text-decoration-line', 'line-through')) {
							item.menuActive = true;
						} else {
							item.menuActive = false;
						}
						break;
					case 'subscript':
						if (this.compareCss(node, 'vertical-align', 'sub')) {
							item.menuActive = true;
						} else {
							item.menuActive = false;
						}
						break;
					case 'superscript':
						if (this.compareCss(node, 'vertical-align', 'super')) {
							item.menuActive = true;
						} else {
							item.menuActive = false;
						}
						break;
					case 'link':
						if (this.compareTag(node, 'a')) {
							item.menuActive = true;
						} else {
							item.menuActive = false;
						}
						break;
					case 'quote':
						if (this.compareTag(node, 'blockquote')) {
							item.menuActive = true;
						} else {
							item.menuActive = false;
						}
						break;
					case 'table':
						if (this.compareTag(node, 'table')) {
							item.menuActive = true;
						} else {
							item.menuActive = false;
						}
						break;
					case 'code':
						if (this.compareTag(node, 'pre')) {
							item.menuActive = true;
						} else {
							item.menuActive = false;
						}
						break;
					case 'codeView':
						if (this.codeViewShow) {
							item.menuActive = true;
						} else {
							item.menuActive = false;
						}
						break;
					default:
						//如果不是自定义的菜单项，则不激活
						let selectKeys = [
							'undo',
							'redo',
							'removeFormat',
							'selectAll',
							'divider',
							'tag',
							'fontSize',
							'fontFamily',
							'foreColor',
							'backColor',
							'list',
							'justify',
							'image',
							'video'
						];
						if (selectKeys.lastIndexOf(item.value) > -1) {
							item.menuActive = false;
							return;
						}
						item.menuActive = this.customActive(item.value, node) || false;
				}
			});
		},
		//编辑区域获取焦点
		contentFocus(){
			if(this.disabled){
				return
			}
			if(this.border && this.activeColor){
				this.$refs.content.style.borderColor = this.activeColor
			}
			this.changeActive();
			this.$nextTick(()=>{
				this.$emit('focus',{
					html:this.html,
					text:this.text
				})
			})
		},
		//编辑区域失去焦点
		contentBlur(){
			if(this.disabled){
				return
			}
			if(this.border && this.activeColor){
				this.$refs.content.style.borderColor = ''
			}
			this.changeActive()
			this.$nextTick(()=>{
				this.$emit('blur',{
					html:this.html,
					text:this.text
				})
			})
		},
		//输入框输入
		contentInput() {
			if (this.disabled) {
				return;
			}
			if (!this.$refs.content) {
				return;
			}
			if (this.$refs.content.innerHTML == '' || this.$refs.content.innerHTML == '<br>' || this.$refs.content.innerHTML == '<p></p>') {
				this.$refs.content.innerHTML = '<p><br></p>';
			}
			this.updateHtmlText();
			this.updateValue();
			this.changeActive();
			this.$nextTick(()=>{
				this.$emit('input',{
					html:this.html,
					text:this.text
				})
			})
		},
		//源码视图输入
		codeViewInput() {
			if (this.disabled) {
				return;
			}
			if (!this.$refs.codeView) {
				return;
			}
			this.updateHtmlText()
			this.updateValue();
			this.$emit('input',{
				html:this.html,
				text:this.text
			})
		},
		//tab键按下
		tabDown(event) {
			if (this.disabled) {
				return;
			}
			if (event.keyCode == 9) {
				event.preventDefault();
				let node = this.getSelectNode();
				if (this.compareCss(node, 'font-family', 'Consolas')) {
					document.execCommand('insertHtml', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
				} else {
					document.execCommand('insertHtml', false, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
				}
			}
		},
		//初始化对象参数方法
		initOption(defaultObj, propObj) {
			let obj = {};
			Object.assign(obj, defaultObj);
			Object.assign(obj, propObj);
			return obj;
		},
		//判断某个节点是否在指定标签下，可对外提供
		compareTag(el, tag) {
			if ($util.isContains(this.$refs.content, el)) {
				if (el.tagName.toUpperCase() == tag.toUpperCase()) {
					return true;
				} else {
					return this.compareTag(el.parentNode, tag);
				}
			} else {
				return false;
			}
		},
		//判断某个节点是否在指定样式下，可对外提供
		compareCss(el, cssName, cssValue) {
			if ($util.isContains(this.$refs.content, el)) {
				if ($util.getCssStyle(el, cssName) == cssValue) {
					return true;
				} else {
					return this.compareCss(el.parentNode, cssName, cssValue);
				}
			} else {
				return false;
			}
		},
		//根据标签名获取某个节点，可对外提供
		getCompareTag(el, tag) {
			if ($util.isContains(this.$refs.content, el)) {
				if (el.tagName.toUpperCase() == tag.toUpperCase()) {
					return el;
				} else {
					return this.getCompareTag(el.parentNode, tag);
				}
			} else {
				return null;
			}
		},
		//根据css获取某个节点，可对外提供
		getCompareTagForCss(el, cssName, cssValue) {
			if ($util.isContains(this.$refs.content, el)) {
				if ($util.getCssStyle(el, cssName) == cssValue) {
					return el;
				} else {
					return this.getCompareTagForCss(el.parentNode, cssName, cssValue);
				}
			} else {
				return null;
			}
		},
		//获取经过处理的value值
		getValue(){
			if (this.value == '' || this.value == '<br>' || this.value == '<p></p>') {
				return '<p><br></p>';
			} else {
				return this.value;
			}
		},
		//根据html值更新value值，可对外提供
		updateValue(){
			this.isModelChange = true;
			this.$emit('update:value',this.html);
			this.$nextTick(()=>{
				this.isModelChange = false;
			})
		},
		//根据编辑器的值更新html和text值，可对外提供
		updateHtmlText(){
			if (this.$refs.content) {
				this.html = this.$refs.content.innerHTML;
				this.text = this.$refs.content.innerText;
			} else if (this.$refs.codeView) {
				this.html = this.$refs.codeView.innerText;
				let el = $util.string2dom(`<div>${this.$refs.codeView.innerText}</div>`);
				this.text = el.innerText;
			}
		}
	}
};
</script>

<style lang="less">
@import '../../css/mvi-basic.less';

.mvi-editor-image {
	display: inline-block;
	width: auto;
	height: auto;
	max-width: 100%;
}

.mvi-editor-video {
	display: inline-block;
	width: auto;
	height: auto;
	max-width: 100%;
}

/* 表格demo样式 */
.mvi-editor-table-demo {
	width: 100%;
	border: 1px solid @border-color;
	margin: 0;
	padding: 0;
	font-size: @font-size-default;
	color: @font-color-default;
	border-collapse: collapse;
	margin-bottom: @mp-sm;

	tbody {
		margin: 0;
		padding: 0;

		tr {
			margin: 0;
			padding: 0;

			&:first-child {
				background-color: @bg-color-dark;

				td {
					font-weight: bold;
				}
			}

			td {
				font-size: @font-size-default;
				color: @font-color-default;
				margin: 0;
				border-bottom: 1px solid @border-color;
				border-right: 1px solid @border-color;
				padding: @mp-xs;
				text-align: center;

				&:last-child {
					border-right: none;
				}
			}
		}
	}
}
</style>
<style lang="less" scoped>
@import '../../css/mvi-basic.less';

.mvi-editor {
	display: block;
	position: relative;
	width: 100%;
}

.mvi-editor-menus {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	width: 100%;
	flex-wrap: wrap;
	-webkit-flex-wrap: wrap;
	background-color: #fff;
	margin-bottom: @mp-sm;
	border: 1px solid @border-color;
	border-radius: @radius-default;
}

.mvi-editor-body {
	display: block;
	position: relative;
	width: 100%;

	.mvi-editor-codeview {
		display: block;
		position: relative;
		width: 100%;
		border: 1px solid #000;
		height: 8rem;
		background-color: #000;
		border-radius: @radius-default;
		margin: 0;
		padding: @mp-sm;
		overflow-x: hidden;
		overflow-y: auto;
		font-size: @font-size-default;
		color: #fff;
		font-family: Consolas;

		&.mvi-editor-codeview-auto {
			height: auto;
			min-height: 8rem;
			overflow: hidden;
		}
	}

	.mvi-editor-content {
		display: block;
		position: relative;
		width: 100%;
		border: 1px solid @border-color;
		height: 8rem;
		background-color: #fff;
		border-radius: @radius-default;
		margin: 0;
		padding: @mp-sm;
		overflow-x: hidden;
		overflow-y: auto;
		font-size: @font-size-default;
		color: @font-color-default;
		transition: border-color 600ms;

		&.mvi-editor-content-auto {
			height: auto;
			min-height: 8rem;
			overflow: hidden;
		}

		&.mvi-editor-content-empty::before {
			position: absolute;
			top: @mp-sm;
			left: @mp-sm;
			content: attr(data-placeholder);
			font-size: inherit;
			color: inherit;
			opacity: 0.5;
			line-height: inherit;
			vertical-align: middle;
		}
	}
}
</style>

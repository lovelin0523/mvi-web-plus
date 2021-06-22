<template>
	<div class="mvi-page">
		<div v-if="firstText || firstIconType || firstIconUrl" :disabled="page==1 || null" @click="pageFirst" :class="['mvi-page-first',(active&&page!=1)?'mvi-page-active':'']" :style="{color:(page==1?'':(color?color:''))}">
			<m-icon :class="['mvi-page-icon',firstText?'mvi-page-margin-right':'']" v-if="firstIconType || firstIconUrl" :type="firstIconType" :url="firstIconUrl" :spin="firstIconSpin" :size="firstIconSize" :color="firstIconColor" />
			<span v-if="firstText" v-text="firstText"></span>
		</div>
		<div v-if="prevText || prevIconType || prevIconUrl" :disabled="page==1 || null" @click="pagePrev" :class="['mvi-page-prev',(active&&page!=1)?'mvi-page-active':'']" :style="{color:(page==1?'':(color?color:''))}">
			<m-icon :class="['mvi-page-icon',prevText?'mvi-page-margin-right':'']" v-if="prevIconType|| prevIconUrl" :type="prevIconType" :url="prevIconUrl" :size="prevIconSize" :spin="prevIconSpin" :color="prevIconColor" />
			<span v-if="prevText" v-text="prevText"></span>
		</div>
		<div class="mvi-page-numbers">
			<div class="mvi-page-numbers-simple" v-if="simple">{{page}} / {{total}}</div>
			<div class="mvi-page-numbers-items" v-else>
				<!--total不超过overNumber -->
				<div v-if="total<=overNumber" :class="['mvi-page-numbers-item',page==item?'mvi-page-number-active':'',(active&&page!=item)?'mvi-page-active':'']" v-for="(item,index) in total" v-text="item" @click="toPage(item)" :style="pageStyle(item)"></div>
				<!-- total超过overNumber -->
				<div v-if="total>overNumber && page > (overNumber-1)/2+1" :class="['mvi-page-numbers-item',active?'mvi-page-active':'']"
				@click="toPage(page-(overNumber-1))" :style="{color:color?color:''}">...</div>
				<div v-if="total>overNumber" :class="['mvi-page-numbers-item',page==item?'mvi-page-number-active':'',(active&&page!=item)?'mvi-page-active':'']" v-for="(item,index) in arry" v-text="item" @click="toPage(item)" :style="pageStyle(item)"></div>
				<div v-if="total>overNumber && page < (total - (overNumber-1)/2)" :class="['mvi-page-numbers-item',active?'mvi-page-active':'']"
				@click="toPage(page+(overNumber-1))" :style="{color:color?color:''}">...</div>
			</div>
		</div>
		<div v-if="nextText || nextIconType || nextIconUrl" :disabled="page==total || null" @click="pageNext" :class="['mvi-page-next',(active&&page!=total)?'mvi-page-active':'']" :style="{color:page==total?'':(color?color:'')}">
			<span v-if="nextText" v-text="nextText"></span>
			<m-icon :class="['mvi-page-icon',nextText?'mvi-page-margin-left':'']" v-if="nextIconType|| nextIconUrl" :type="nextIconType" :url="nextIconUrl" :size="nextIconSize" :spin="nextIconSpin" :color="nextIconColor" />
		</div>
		<div v-if="lastText || lastIconType || lastIconUrl" :disabled="page==total || null" @click="pageLast" :class="['mvi-page-last',(active&&page!=total)?'mvi-page-active':'']" :style="{color:(page==total?'':(color?color:''))}">
			<span v-if="lastText" v-text="lastText"></span>
			<m-icon :class="['mvi-page-icon',lastText?'mvi-page-margin-left':'']" v-if="lastIconType || lastIconUrl" :type="lastIconType" :url="lastIconUrl" :size="lastIconSize" :spin="lastIconSpin" :color="lastIconColor" />
		</div>
	</div>
</template>

<script>
	import $util from "../../util/util"
	export default {
		name: "m-page",
		data(){
			return {
				el:null
			}
		},
		emits:['update:page','change'],
		props: {
			page: { //当前页
				type: Number,
				default: 1
			},
			total: { //总页数
				type: Number,
				default: 1
			},
			overNumber: { //显示的页码数
				type: Number,
				default: 3,
				validator(value){
					if(value%2==0){
						return false;
					}else{
						return true;
					}
				}
			},
			prevText: { //上一页显示文字
				type: String,
				default: null
			},
			nextText: { //下一页显示文字
				type: String,
				default: null
			},
			prevIcon:{
				type:[String,Object],
				default:null
			},
			nextIcon:{
				type:[String,Object],
				default:null
			},
			simple: { //简单模式
				type: Boolean,
				default: false
			},
			firstText:{
				type:String,
				default:null
			},
			lastText:{
				type:String,
				default:null
			},
			firstIcon:{
				type:[Object,String],
				default:null
			},
			lastIcon:{
				type:[Object,String],
				default:null
			},
			color:{//自定义字体颜色及选中的背景色
				type:String,
				default:null
			},
			active:{//是否显示点击态
				type:Boolean,
				default:true
			}
		},
		computed: {
			pageStyle(){
				return item=>{
					let style = {};
					if(this.page == item){
						if(this.el){
							style.color = $util.getCssStyle(this.el,'background-color');
						}
						style.backgroundColor = (this.color?this.color:'');
					}else{
						style.color = (this.color?this.color:'');
					}
					return style;
				}
			},
			arry(){
				let arry = [];
				if(this.page <= (this.overNumber-1)/2+1){
					for(let i = 0;i<this.overNumber;i++){
						arry.push(i+1);
					}
				}else if(this.page <= (this.total - (this.overNumber-1)/2)){
					for(let i = 0;i<(this.overNumber-1)/2;i++){
						arry.push(this.page - (((this.overNumber-1)/2)-i));
					}
					arry.push(this.page);
					for(let i = 0;i<(this.overNumber-1)/2;i++){
						arry.push(this.page + (i+1));
					}
				}else {
					for(let i = 0;i<this.overNumber;i++){
						arry.push(this.total - (this.overNumber-1-i));
					}
				}
				return arry;
			},
			firstIconType() {
				let t = 'angle-double-left';
				if ($util.isObject(this.firstIcon)) {
					if (typeof(this.firstIcon.type) == "string") {
						t = this.firstIcon.type;
					}
				} else if (typeof(this.firstIcon) == "string") {
					t = this.firstIcon;
				}
				return t;
			},
			firstIconUrl() {
				let url = null;
				if ($util.isObject(this.firstIcon)) {
					if (typeof(this.firstIcon.url) == "string") {
						url = this.firstIcon.url;
					}
				}
				return url;
			},
			firstIconSpin() {
				let spin = false;
				if ($util.isObject(this.firstIcon)) {
					if (typeof(this.firstIcon.spin) == "boolean") {
						spin = this.firstIcon.spin;
					}
				}
				return spin;
			},
			firstIconSize(){
				let size = null;
				if ($util.isObject(this.firstIcon)) {
					if (typeof(this.firstIcon.size) == "string") {
						size = this.firstIcon.size;
					}
				}
				return size;
			},
			firstIconColor(){
				let color = null;
				if ($util.isObject(this.firstIcon)) {
					if (typeof(this.firstIcon.color) == "string") {
						color = this.firstIcon.color;
					}
				}
				return color;
			},
			lastIconType() {
				let t = 'angle-double-right';
				if ($util.isObject(this.lastIcon)) {
					if (typeof(this.lastIcon.type) == "string") {
						t = this.lastIcon.type;
					}
				} else if (typeof(this.lastIcon) == "string") {
					t = this.lastIcon;
				}
				return t;
			},
			lastIconUrl() {
				let url = null;
				if ($util.isObject(this.lastIcon)) {
					if (typeof(this.lastIcon.url) == "string") {
						url = this.lastIcon.url;
					}
				}
				return url;
			},
			lastIconSpin() {
				let spin = false;
				if ($util.isObject(this.lastIcon)) {
					if (typeof(this.lastIcon.spin) == "boolean") {
						spin = this.lastIcon.spin;
					}
				}
				return spin;
			},
			lastIconSize(){
				let size = null;
				if ($util.isObject(this.lastIcon)) {
					if (typeof(this.lastIcon.size) == "string") {
						size = this.lastIcon.size;
					}
				}
				return size;
			},
			lastIconColor(){
				let color = null;
				if ($util.isObject(this.lastIcon)) {
					if (typeof(this.lastIcon.color) == "string") {
						color = this.lastIcon.color;
					}
				}
				return color;
			},
			prevIconType() {
				let t = 'angle-left';
				if ($util.isObject(this.prevIcon)) {
					if (typeof(this.prevIcon.type) == "string") {
						t = this.prevIcon.type;
					}
				} else if (typeof(this.prevIcon) == "string") {
					t = this.prevIcon;
				}
				return t;
			},
			prevIconUrl() {
				let url = null;
				if ($util.isObject(this.prevIcon)) {
					if (typeof(this.prevIcon.url) == "string") {
						url = this.prevIcon.url;
					}
				}
				return url;
			},
			prevIconSpin() {
				let spin = false;
				if ($util.isObject(this.prevIcon)) {
					if (typeof(this.prevIcon.spin) == "boolean") {
						spin = this.prevIcon.spin;
					}
				}
				return spin;
			},
			prevIconSize(){
				let size = null;
				if ($util.isObject(this.prevIcon)) {
					if (typeof(this.prevIcon.size) == "string") {
						size = this.prevIcon.size;
					}
				}
				return size;
			},
			prevIconColor(){
				let color = null;
				if ($util.isObject(this.prevIcon)) {
					if (typeof(this.prevIcon.color) == "string") {
						color = this.prevIcon.color;
					}
				}
				return color;
			},
			nextIconType() {
				let t = 'angle-right';
				if ($util.isObject(this.nextIcon)) {
					if (typeof(this.nextIcon.type) == "string") {
						t = this.nextIcon.type;
					}
				} else if (typeof(this.nextIcon) == "string") {
					t = this.nextIcon;
				}
				return t;
			},
			nextIconUrl() {
				let url = null;
				if ($util.isObject(this.nextIcon)) {
					if (typeof(this.nextIcon.url) == "string") {
						url = this.nextIcon.url;
					}
				}
				return url;
			},
			nextIconSpin() {
				let spin = false;
				if ($util.isObject(this.nextIcon)) {
					if (typeof(this.nextIcon.spin) == "boolean") {
						spin = this.nextIcon.spin;
					}
				}
				return spin;
			},
			nextIconSize(){
				let size = null;
				if ($util.isObject(this.nextIcon)) {
					if (typeof(this.nextIcon.size) == "string") {
						size = this.nextIcon.size;
					}
				}
				return size;
			},
			nextIconColor(){
				let color = null;
				if ($util.isObject(this.nextIcon)) {
					if (typeof(this.nextIcon.color) == "string") {
						color = this.nextIcon.color;
					}
				}
				return color;
			}
		},
		mounted() {
			this.el = this.$el;
		},
		methods: {
			//上一页
			pagePrev() {
				if (this.page == 1) {
					return;
				}
				let page = this.page - 1;
				this.$emit('update:page', page);
				this.$emit('change',page)
			},
			//下一页
			pageNext() {
				if (this.page == this.total) {
					return;
				}
				let page = this.page + 1;
				this.$emit('update:page', page);
				this.$emit('change', page);
			},
			//首页
			pageFirst(){
				if(this.page == 1){
					return;
				}
				this.$emit('update:page',1);
				this.$emit('change', 1);
			},
			//尾页
			pageLast(){
				if(this.page == this.total){
					return;
				}
				this.$emit('update:page',this.total);
				this.$emit('change', this.total);
			},
			//指定页
			toPage(page){
				if(this.page == page){
					return;
				}
				if(page >= this.total){
					page = this.total;
				}
				if(page <= 1){
					page = 1;
				}
				this.$emit('update:page',page);
				this.$emit('change',page);
			}
		}
	}
</script>

<style scoped lang="less">
	@import "../../css/mvi-basic.less";
	
	.mvi-page {
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		width: 100%;
		height: @medium-height;
		border: 1px solid @border-color;
		font-size: @font-size-default;
		border-radius: @radius-default;
	}
	
	.mvi-page-first{
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		position: relative;
		flex: 1;
		height: 100%;
		padding: 0 @mp-md;
		border-right: 1px solid @border-color;
		color: @info-normal;
		white-space: nowrap;
		cursor: pointer;
	}
	
	.mvi-page-last{
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		position: relative;
		height: 100%;
		flex: 1;
		padding: 0 @mp-md;
		border-left: 1px solid @border-color;
		color: @info-normal;
		white-space: nowrap;
		cursor: pointer;
	}
	
	.mvi-page-prev {
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		position: relative;
		flex: 1;
		height: 100%;
		padding: 0 @mp-md;
		border-right: 1px solid @border-color;
		color: @info-normal;
		white-space: nowrap;
		cursor: pointer;
	}

	.mvi-page-next {
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		position: relative;
		height: 100%;
		flex: 1;
		padding: 0 @mp-md;
		border-left: 1px solid @border-color;
		color: @info-normal;
		white-space: nowrap;
		cursor: pointer;
	}
	
	.mvi-page-active:active::before{
		.mvi-active();
	}
	
	.mvi-page-prev[disabled],.mvi-page-next[disabled],
	.mvi-page-first[disabled],.mvi-page-last[disabled]{
		color: @font-color-mute;
	}

	.mvi-page-numbers {
		display: block;
		height: 100%;
	}

	.mvi-page-numbers-simple {
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		color: @font-color-sub;
		vertical-align: middle;
		padding: 0 @mp-lg;
		white-space: nowrap;
	}

	.mvi-page-numbers-items {
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 100%;
		position: relative;
		.mvi-page-numbers-item {
			width: @small-height;
			display: flex;
			display: -webkit-flex;
			justify-content: center;
			align-items: center;
			position: relative;
			height: 100%;
			border-right: 1px solid @border-color;
			color: @info-normal;
			white-space: nowrap;
			cursor: pointer;
			&:last-child {
				border-right: none;
			}
			&.mvi-page-number-active {
				background-color: @info-normal;
				color: #fff;
			}
		}
	}
	
	.mvi-page-icon.mvi-page-margin-right{
		margin-right: @mp-xs;
	}
	
	.mvi-page-icon.mvi-page-margin-left{
		margin-left: @mp-xs;
	}
</style>

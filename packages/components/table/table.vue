<template>
	<div :class="['mvi-table',outBorder?'mvi-table-border':'']">
		<div :class="['mvi-table-header',headClass?headClass:'']" v-if="columnsData.length!=0">
			<table cellpadding="0" cellspacing="0">
				<colgroup>
					<col :ref="setHeadColRefs" :style="colgroupStyle(item,index)" v-for="(item,index) in columnsData"/>
					<col v-if="isScroll" :style="{width:scrollWidth+'px'}"/>
				</colgroup>
				<thead>
					<tr>
						<th :ref="setHeadThRefs" :class="tableHeaderThClass" v-for="(item,index) in columnsData">
							<div>
								<m-checkbox v-if="item.key=='checkbox'" icon-size="0.24rem" :class="(item.value?'mvi-table-checkbox':'')"
								 v-model:checked="selectAll" @change="allSelect" :icon-type="(item.iconType?item.iconType:'success')"
								 :icon-color="(item.iconColor?item.iconColor:null)" :fill-color="(item.fillColor?item.fillColor:null)"
								 :label="item.value?item.value:''"></m-checkbox>
								<span v-else-if="item.value" v-html="item.value"></span>
								<span class="mvi-table-sortable" v-if="item.sortable">
									<m-icon @click="sortAsc($event,item)" class="mvi-table-sortable-icon"
									 type="caret-up" />
									<m-icon @click="sortDesc($event,item)" class="mvi-table-sortable-icon"
									 type="caret-down" />
								</span>
							</div>
						</th>
						<th v-if="isScroll" :style="{width:scrollWidth+'px'}"></th>
					</tr>
				</thead>
			</table>
		</div>
		<div v-if="loading" class="mvi-table-loading">
			<div>
				<m-loading color="#c8c9cc" size="0.3rem"></m-loading>
				<div class="mvi-table-loading-text" v-html="loadText"></div>
			</div>
		</div>
		<div v-else-if="sortData.length == 0" class="mvi-table-no-data" v-html="noDataMsg"></div>
		<div v-else class="mvi-table-body" :style="bodyStyle" ref="body">
			<table cellpadding="0" cellspacing="0">
				<colgroup>
					<col :ref="setBodyCols" :style="colgroupStyle(item,index)" v-for="(item,index) in columnsData"/>
				</colgroup>
				<tbody>
					<tr v-for="(item,index) in sortData" :class="bodyTrClass(item,index)">
						<td :class="[rowBorder?'mvi-table-body-td-border':'',(item.cellClassName&&item.cellClassName[item2.key])?item.cellClassName[item2.key]:'',item2.className?item2.className:'',cellClass(item,index,item2,index2)?cellClass(item,index,item2,index2):'']" v-for="(item2,index2) in columnsData" @click="cellClick($event,item,index,item2,index2)">
							<m-checkbox v-if="item2.key=='checkbox'" icon-size="0.24rem" v-model:checked="checkRows" :value="index" :icon-type="(item2.iconType?item2.iconType:'success')"
							 @change="selectCheck" :icon-color="(item2.iconColor?item2.iconColor:null)" :fill-color="(item2.fillColor?item2.fillColor:null)" :disabled="(item.checkDisabled?true:false)"></m-checkbox>
							<slot name="custom" :row="item" :column="item2" :row-index="index" :column-index="index2" v-if="(item2.key=='custom') && ($slots.custom)"></slot>
							<span v-else v-html="textFilter(item,item2)"></span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
	import $util from "../../util/util"
	export default {
		name: "m-table",
		emits:['cell-click','check','sort-desc','sort-asc'],
		data() {
			return {
				checkRows: [], //选择的列
				selectAll: false,
				sortData:[],//渲染在表格上的数据
				isScroll:false,//表格内容是否有垂直滚动条
				scrollWidth:0,//滚动条宽度
				headCols:[],//表格头col数组
				bodyCols:[],//表格主体col数组
				headThs:[],//表格头列元素数组
			}
		},
		props: {
			data: { //表格内容数据
				type: Array,
				default: function() {
					return [];
				}
			},
			columns: { //表格头数据
				type: Array,
				default: function() {
					return [];
				}
			},
			outBorder: { //是否显示外边框
				type: Boolean,
				default: false
			},
			rowBorder: { //是否显示行边框
				type: Boolean,
				default: false
			},
			stripe: { //是否显示条纹
				type: Boolean,
				default: false
			},
			height: { //设置表格主体高度，固定表格头部
				type: String,
				default: null
			},
			rowClass:{//设置行样式
				type:String,
				default:null
			},
			cellClass: { //自定义单元格样式
				type: Function,
				default: function() {

				}
			},
			noDataMsg: { //无数据的文本提示
				type: String,
				default: "暂时没有数据"
			},
			loading: { //是否加载状态
				type: Boolean,
				default: false
			},
			loadText: { //加载时的文本提示
				type: String,
				default: "正在加载数据..."
			},
			headClass:{//表头样式
				type:String,
				default:null
			},
			customSortAsc:{//自定义升序排序
				type:Function,
				default:null
			},
			customSortDesc:{//自定义降序排序
				type:Function,
				default:null
			},
			sortActiveColor:{//排序激活颜色
				type:String,
				default:null
			}
		},
		computed: {
			bodyTrClass(){
				return (item,index)=>{
					let cls = [];
					if(this.rowClass){
						cls.push(this.rowClass)
					}
					if(item.className){
						cls.push(item.className)
					}
					if(index%2==1 && this.stripe){
						cls.push('mvi-table-stripe')
					}
					return cls;
				}
			},
			tableHeaderThClass(){
				let cls = ['mvi-table-header-th'];
				if(this.rowBorder){
					cls.push('mvi-table-header-th-border');
				}
				return cls;
			},
			bodyStyle() {
				let style = {};
				if (this.height) {
					style.maxHeight = this.height;
					style.overflow = 'auto';
				}
				return style;
			},
			colgroupStyle() {
				return item => {
					let style = {}
					if(item.width){
						style.width = item.width;
					}
					return style
				}
			},
			columnsData() {
				let arr = [];
				this.columns.forEach((column) => {
					if (!column.hidden) {
						arr.push(column);
					}
				})
				return arr;
			},
			textFilter() {
				return (item, item2) => {
					let text = item[item2.key];
					if (typeof item2.filter == 'function') {
						text = item2.filter(item[item2.key]);
					}
					return text;
				}
			}
		},
		watch:{
			data(newValue){
				this.sortData = this.getSortData();
				this.$nextTick(()=>{
					this.columnsAlign();
				})
			},
			loading(newValue){
				this.$nextTick(()=>{
					this.columnsAlign();
				})
			}
		},
		created() {
			this.sortData = this.getSortData()
		},
		mounted() {
			this.columnsAlign();
			window.addEventListener('resize',this.columnsAlign);
		},
		methods: {
			//设置表格主体col数组
			setBodyCols(el){
				if(el){
					this.bodyCols.push(el)
				}
			},
			//设置表格头列数组
			setHeadThRefs(el){
				if(el){
					this.headThs.push(el)
				}
			},
			//设置表格头col数组
			setHeadColRefs(el){
				if(el){
					this.headCols.push(el)
				}
			},
			//表头表主体对齐设置
			columnsAlign(){
				if(this.$refs.body){
					//判断表格主体是否含有滚动条，与表头对齐设置
					this.isScroll = $util.getScrollHeight(this.$refs.body) > this.$refs.body.clientHeight;
					if(this.isScroll){
						this.scrollWidth = this.$refs.body.offsetWidth - this.$refs.body.clientWidth;
					}
					this.$nextTick(()=>{
						if(this.headThs.length>0){
							this.headThs.forEach((el,index)=>{
								if(!this.columnsData[index].width && this.headCols.length>0 && this.headCols[index] 
								&& this.bodyCols.length>0 && this.bodyCols[index]){
									this.headCols[index].style.width = this.bodyCols[index].style.width = el.offsetWidth + 'px';
								}
							})
						}
					})
				}
			},
			//点击单元格
			cellClick(event, item, index, item2, index2) {
				this.$emit('cell-click', {
					row: item,
					rowIndex: index,
					column: item2,
					columnIndex: index2
				});
			},
			//选择单个复选框
			selectCheck(value) {
				event.stopPropagation();
				let length = this.sortData.length;
				let length2 = 0;
				for (let i = 0; i < length; i++) {
					if (!this.sortData[i].checkDisabled) {
						length2++;
					}
				}
				if (this.checkRows.length == length2) {
					this.selectAll = true;
				} else {
					this.selectAll = false;
				}
				let checkRowsData = []
				this.checkRows.forEach(item=>{
					for(let i = 0;i < length;i++){
						if(i == item){
							checkRowsData.push(this.sortData[i]);
							break;
						}
					}
				})
				this.$emit('check', checkRowsData);
			},
			//复选框全选
			allSelect(value) {
				this.checkRows = [];
				let length = this.sortData.length;
				if (value) { //全选
					for (let i = 0; i < length; i++) {
						if (!this.sortData[i].checkDisabled) {
							this.checkRows.push(i);
						}
					}
				} else {
					this.checkRows = [];
				}
				let checkRowsData = []
				this.checkRows.forEach(item=>{
					for(let i = 0;i < length;i++){
						if(i == item){
							checkRowsData.push(this.sortData[i]);
							break;
						}
					}
				})
				this.$emit('check', checkRowsData);
			},
			//升序排序
			sortAsc(event,column) {
				let children = this.$el.querySelectorAll('.mvi-table-sortable-icon')
				children.forEach(child=>{
					$util.removeClass(child,'mvi-table-sortable-icon-active');
					if(this.sortActiveColor){
						child.style.color = '';
					}
				})
				$util.addClass(event.currentTarget,'mvi-table-sortable-icon-active');
				if(this.sortActiveColor){
					event.currentTarget.style.color = this.sortActiveColor;
				}
				if(typeof this.customSortAsc == 'function' && this.customSortAsc){
					this.customSortAsc(column,this.sortData)
				}else {
					this.sortData = this.sortData.sort(function(a, b) {
						let str1 = a[column.key].toString();
						let str2 = b[column.key].toString();
						return str1.localeCompare(str2, 'zh-CN')
					})
					this.$emit('sort-asc', this.sortData);
				}
			},
			//降序排序
			sortDesc(event,column) {
				let children = this.$el.querySelectorAll('.mvi-table-sortable-icon')
				children.forEach(child=>{
					$util.removeClass(child,'mvi-table-sortable-icon-active');
					if(this.sortActiveColor){
						child.style.color = '';
					}
				})
				$util.addClass(event.currentTarget,'mvi-table-sortable-icon-active');
				if(this.sortActiveColor){
					event.currentTarget.style.color = this.sortActiveColor;
				}
				if(typeof this.customSortDesc == 'function' && this.customSortDesc){
					this.customSortDesc(column,this.sortData)
				}else {
					this.sortData = this.sortData.sort(function(a, b) {
						let str1 = a[column.key].toString();
						let str2 = b[column.key].toString();
						return -str1.localeCompare(str2, 'zh-CN')
					})
					this.$emit('sort-desc', this.sortData);
				}
			},
			//根据data获取sortData
			getSortData(){
				let arr = [];
				this.data.forEach((row) => {
					if (!row.hidden) {
						arr.push(row);
					}
				})
				return arr;
			}
		},
		beforeUnmount() {
			window.removeEventListener('resize',this.columnsAlign);
		}
	}
</script>

<style lang="less" scoped>
	@import "../../css/mvi-basic.less";

	.mvi-table {
		display: block;
		width: 100%;
		padding: 0;
		margin: 0;
		background-color: #fff;
		font-size: @font-size-default;
		color: @font-color-default;
	}

	.mvi-table-border {
		border: 1px solid @border-color;
		border-radius: @radius-default;
	}

	.mvi-table-header {
		display: flex;
		display: -webkit-flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		background-color: @bg-color-dark;
		border-top-left-radius: @radius-default;
		border-top-right-radius: @radius-default;
		border-bottom: 1px solid @border-color;

		table {
			width: 100%;
			border-collapse: collapse;
		}
		
		thead{
			width: 100%;
		}

		th.mvi-table-header-th {
			padding: @mp-sm;
			text-align: center;
			font-weight: bold;

			&>div {
				display: inline-flex;
				display: -webkit-inline-flex;
				justify-content: flex-start;
				align-items: center;
				height: 100%;
				vertical-align: middle;
			}

			.mvi-table-sortable {
				display: inline-flex;
				display: -webkit-inline-flex;
				justify-content: space-between;
				flex-direction: column;
				-ms-flex-direction: column;
				-webkit-flex-direction: column;
				margin-left: @mp-xs;
				color: @font-color-mute;
				height: 100%;

				.mvi-table-sortable-icon {
					font-size: 0.6em;
					width: 100%;
					margin-bottom: 0;
				}

				.mvi-table-sortable-icon.mvi-table-sortable-icon-active {
					color: @info-normal;
				}
			}

		}

		th.mvi-table-header-th.mvi-table-header-th-border {
			border: 1px solid @border-color;
			border-bottom: none;
			border-top: none;
		}

		tr>th.mvi-table-header-th.mvi-table-header-th-border:first-child {
			border-left: none;
		}

		tr>th.mvi-table-header-th.mvi-table-header-th-border:last-child {
			border-right: none;
		}

		.mvi-table-checkbox {
			margin-right: @mp-xs/2;
		}

	}

	.mvi-table-body {
		display: block;
		width: 100%;

		table {
			width: 100%;
			border-collapse: collapse;
		}

		tr.mvi-table-stripe {
			background-color: @bg-color-default;
		}

		td {
			padding: @mp-sm;
			text-align: center;
			border-bottom: 1px solid @border-color;
		}

		tr:last-child>td {
			border-bottom: none;
		}

		td.mvi-table-body-td-border {
			border-left: 1px solid @border-color;
			border-right: 1px solid @border-color;
		}

		tr>td.mvi-table-body-td-border:first-child {
			border-left: none;
		}

		tr>td.mvi-table-body-td-border:last-child {
			border-right: none;
		}
	}

	.mvi-table-loading {
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		padding: @mp-lg 0;

		&>div {
			display: flex;
			display: -webkit-flex;
			justify-content: flex-start;
			align-items: center;
		}

		.mvi-table-loading-text {
			color: @font-color-mute;
			font-size: @font-size-small;
			margin-left: @mp-xs;
		}
	}

	.mvi-table-no-data {
		display: block;
		width: 100%;
		text-align: center;
		padding: @mp-lg 0;
		color: @font-color-mute;
		font-size: @font-size-small;
	}
</style>

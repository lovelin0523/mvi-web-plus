<template>
	<div class="mvi-eitor-item" :data-id="`mvi-editor-root-${uid}-${value}`">
		<m-tooltip v-if="editor.useTooltip && editor.defaultTooltips[value]" :disabled="editor.disabled || (value!='codeView' && editor.codeViewShow)" :title="editor.defaultTooltips[value]" trigger="hover" :placement="editor.defaultTooltipProps.placement" :timeout="editor.defaultTooltipProps.timeout" :color="editor.defaultTooltipProps.color" :text-color="editor.defaultTooltipProps.textColor" :border-color="editor.defaultTooltipProps.borderColor" :offset="editor.defaultTooltipProps.offset" :z-index="editor.defaultTooltipProps.zIndex" :fixed="editor.defaultTooltipProps.fixed" :fixed-auto="editor.defaultTooltipProps.fixedAuto" :width="editor.defaultTooltipProps.width" :animation="editor.defaultTooltipProps.animation" :show-triangle="editor.defaultTooltipProps.showTriangle">
			<div class="mvi-editor-target" @click="targetTrigger" :disabled="editor.disabled || (value!='codeView' && editor.codeViewShow) || null"  :data-id="`mvi-editor-target-${uid}-${value}`" :style="editorTargetStyle">
				<m-icon :type="editor.defaultMenuIcons[value]" />
			</div>
		</m-tooltip>
		<div v-else :class="['mvi-editor-target',menuActive?'mvi-editor-active':'']" @click="targetTrigger" :disabled="editor.disabled || (value!='codeView' && editor.codeViewShow) || null" :data-id="`mvi-editor-target-${uid}-${value}`" :style="editorTargetStyle">
			<m-icon :type="editor.defaultMenuIcons[value]" />
		</div>
		<m-layer v-model="layerShow" ref="layer" :placement="editor.defaultLayerProps.placement" :z-index="editor.defaultLayerProps.zIndex" :fixed="editor.defaultLayerProps.fixed" :fixed-auto="editor.defaultLayerProps.fixedAuto" :offset="editor.defaultLayerProps.offset" :wrapper-class="editor.defaultLayerProps.wrapperClass" :timeout="editor.defaultLayerProps.timeout" :show-triangle="editor.defaultLayerProps.showTriangle" :animation="editor.defaultLayerProps.animation" :shadow="editor.defaultLayerProps.shadow" :border="editor.defaultLayerProps.border" :border-color="editor.defaultLayerProps.borderColor" :background="editor.defaultLayerProps.background" :closable="(editor.trigger=='click'?true:false)" :target="`[data-id='mvi-editor-target-${uid}-${value}']`" :root="`[data-id='mvi-editor-root-${uid}-${value}']`">
			<div class="mvi-editor-layer">
				<!-- 插入图片或者视频 -->
				<div class="mvi-editor-medias" v-if="value == 'image' || value == 'video' ">
					<m-tabs v-model="tabIndex" flex="flex-start" offset="0.4rem" :active-color="editor.activeColor" inactive-color="#808080">
						<m-tab v-for="(item,index) in menu" :title="item.label">
							<div ref="upload" class="mvi-editor-upload" v-if="item.value == 'upload'">
								<m-icon type='upload-square' />
							</div>
							<div v-if="item.value == 'remote'" class="mvi-editor-remote">
								<input class="mvi-editor-remote-input" @focus="inputFocus" @blur="inputBlur" v-model.trim="remoteUrl" :placeholder="value=='image'?'图片链接':'视频链接'" type="text" />
								<div class="mvi-editor-remote-insert" :style="activeColorStyle" @click="insertRemote">插入</div>
							</div>
						</m-tab>
					</m-tabs>
				</div>
				<!-- 插入链接 -->
				<div v-else-if="value == 'link'" class="mvi-editor-links">
					<m-tabs flex="flex-start" offset="0.4rem" :active-color="editor.activeColor" inactive-color="#808080">
						<m-tab :title="menu[0].label">
							<div v-if="menu[0].value == 'link'" class="mvi-editor-link">
								<input ref="linkText" class="mvi-editor-link-input" @focus="inputFocus" @blur="inputBlur" v-model.trim="linkText" placeholder="链接文字" type="text" />
								<input ref="linkUrl" class="mvi-editor-link-input" @focus="inputFocus" @blur="inputBlur" v-model.trim="linkUrl" placeholder="链接地址" type="text">
								<div class="mvi-editor-link-footer">
									<m-checkbox label="新窗口打开" label-placement="right" icon-size="0.24rem" label-size="0.24rem" label-color="#808080" :fill-color="editor.activeColor" v-model="linkTarget"></m-checkbox>
									<div class="mvi-editor-link-operation">
										<span class="mvi-editor-link-delete" v-if="menuActive" @click="deleteLink">删除链接</span>
										<span class="mvi-editor-link-insert" :style="activeColorStyle" @click="insertLink">插入</span>
									</div>
								</div>
							</div>
						</m-tab>
					</m-tabs>
				</div>
				<!-- 设置颜色 -->
				<div class="mvi-editor-colors" v-else-if="value == 'foreColor' || value == 'backColor'">
					<m-tooltip :disabled="!(item.label && editor.useTooltip)" trigger="hover" :title="item.label" v-for="(item,index) in menu" :placement="editor.defaultTooltipProps.placement" :timeout="editor.defaultTooltipProps.timeout" :color="editor.defaultTooltipProps.color" :text-color="editor.defaultTooltipProps.textColor" :border-color="editor.defaultTooltipProps.borderColor" :offset="editor.defaultTooltipProps.offset" :z-index="editor.defaultTooltipProps.zIndex" :fixed="editor.defaultTooltipProps.fixed" :width="editor.defaultTooltipProps.width" :wrapper-class="editor.defaultTooltipProps.wrapperClass" :animation="editor.defaultTooltipProps.animation">
						<span @click="doSelect(item)" class="mvi-editor-color" :style="{backgroundColor:item.value}"></span>
					</m-tooltip>
				</div>
				<!-- 插入表格 -->
				<div v-else-if="value == 'table'" class="mvi-editor-tables">
					<m-tabs flex="flex-start" offset="0.4rem" :active-color="editor.activeColor" inactive-color="#808080">
						<m-tab :title="menuActive?'编辑表格':menu[0].label">
							<div v-if="menu[0].value == 'table'" class="mvi-editor-table">
								<div class="mvi-editor-table-edit" v-if="menuActive">
									<span @click="addTableRow" class="mvi-editor-table-add" :style="activeColorStyle">增加行</span>
									<span @click="removeTableRow" class="mvi-editor-table-delete">删除行</span>
									<span @click="addTableColumn" class="mvi-editor-table-add" :style="activeColorStyle">增加列</span>
									<span @click="removeTableColumn" class="mvi-editor-table-delete">删除列</span>
								</div>
								<div class="mvi-editor-table-create" v-else>
									创建<input ref="rowsInput" class="mvi-editor-table-input" @focus="inputFocus" @blur="inputBlur" v-model.trim.number="tableRows" />
									行<input ref="columnsInput" class="mvi-editor-table-input" @focus="inputFocus" @blur="inputBlur" v-model.trim.number="tableColumns" />列的表格
								</div>
								<div class="mvi-editor-table-footer">
									<span class="mvi-editor-table-delete" v-if="menuActive" @click="deleteTable">删除表格</span>
									<span class="mvi-editor-table-insert" :style="activeColorStyle" v-else @click="insertTable">插入</span>
								</div>
							</div>
						</m-tab>
					</m-tabs>
				</div>
				<!-- 其他 -->
				<div v-else>
					<div class="mvi-editor-el" v-for="(item,index) in menu" @click="doSelect(item)">
						<m-icon class="mvi-editor-el-icon" v-if="item.icon" :type="item.icon" />
						<span v-text="item.label"></span>
					</div>
				</div>
			</div>
		</m-layer>
		<!-- table模板 -->
		<table v-if="value == 'table'" style="display: none;" ref="table" class="mvi-editor-table-demo" cellpadding="0"
		 cellspacing="0" mvi-editor-insert-table>
			<tbody mvi-editor-insert-table>
				<tr v-for="item in tableRows" mvi-editor-insert-table>
					<td v-for="el in tableColumns" mvi-editor-insert-table></td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	import { getCurrentInstance } from "vue"
	import $util from "../../util/util"
	import Upload from "../upload/upload"
	export default {
		name: 'm-editor-item',
		props: {
			value: { //key值
				type: String,
				default: null
			},
			menu: { //菜单项值
				type: [Array, Boolean],
				default: function() {
					return false;
				}
			}
		},
		setup() {
			const instance = getCurrentInstance();
			return {
				uid:instance.uid
			}
		},
		data() {
			return {
				layerShow: false, //layer开关
				tabIndex: 0, //媒体layer浮层默认显示的tab序列
				remoteUrl: '', //插入的网络图片或者视频地址
				linkUrl: '', //插入的链接
				linkText: '', //链接内容
				linkTarget: false, //链接是否在新窗口打开
				tableRows: 5, //表格行数
				tableColumns: 5, //表格列数
				menuActive: false, //菜单项是否激活状态，激活状态下如果是浮层显示浮层内容有些会有不同
			}
		},
		inject: ['editor'],
		computed: {
			//激活颜色设置
			activeColorStyle(){
				let style = {}
				if(this.editor.activeColor){
					style.color = this.editor.activeColor;
				}
				return style;
			},
			//菜单项样式
			editorTargetStyle(){
				let style = {}
				if(this.editor.activeColor && this.menuActive){
					style.color = this.editor.activeColor;
				}
				return style
			},
			//是否为下拉
			hasSelect() {
				return Array.isArray(this.menu)
			},
			//上传文件配置
			uploadOptions() {
				return {
					allowedFileType: this.value == 'image' ? this.editor.defaultUploadImageProps.allowedFileType : this.editor.defaultUploadVideoProps
						.allowedFileType,
					multiple: this.value == 'image' ? this.editor.defaultUploadImageProps.multiple : this.editor.defaultUploadVideoProps
						.multiple,
					accept: this.value == 'image' ? this.editor.defaultUploadImageProps.accept : this.editor.defaultUploadVideoProps.accept,
					minSize: this.value == 'image' ? this.editor.defaultUploadImageProps.minSize : this.editor.defaultUploadVideoProps
						.minSize,
					maxSize: this.value == 'image' ? this.editor.defaultUploadImageProps.maxSize : this.editor.defaultUploadVideoProps
						.maxSize,
					minLength: this.value == 'image' ? this.editor.defaultUploadImageProps.minLength : this.editor.defaultUploadVideoProps
						.minLength,
					maxLength: this.value == 'image' ? this.editor.defaultUploadImageProps.maxLength : this.editor.defaultUploadVideoProps
						.maxLength,
					select: files => {
						this.editor.restoreRange();
						//使用base64
						if (this.editor.useBase64) {
							files.forEach((file) => {
								$util.dataFileToBase64(file).then(base64 => {
									if (this.value == 'image') {
										this.editor.insertImage(base64);
									} else {
										this.editor.insertVideo(base64);
									}
								})
							})
						} else {
							//自定义一个事件，让开发者自定义上传
							if (this.value == 'image') {
								this.editor.$emit('upload-image', files)
							} else if (this.value == 'video') {
								this.editor.$emit('upload-video', files)
							}
						}
						this.hideLayer()
					},
					error: (state, message, file) => {
						if (this.value == 'image') {
							if (typeof this.editor.uploadImageError == 'function') {
								this.editor.uploadImageError(state, message, file)
							} else {
								this.$msgbox({
									message: message,
									animation: 'scale'
								})
							}
						} else {
							if (typeof this.editor.uploadVideoError == 'function') {
								this.editor.uploadVideoError(state, message, file)
							} else {
								this.$msgbox({
									message: message,
									animation: 'scale'
								})
							}
						}
						this.hideLayer()
					}
				}
			}
		},
		mounted() {
			if (this.editor.trigger == 'hover') {
				this.$el.addEventListener('mouseenter', this.showLayer);
				this.$el.addEventListener('mouseleave', this.hideLayer);
			}
		},
		methods: {
			//输入框获取焦点
			inputFocus(event){
				if(this.editor.activeColor){
					event.currentTarget.style.borderColor = this.editor.activeColor;
				}
			},
			//输入框失去焦点
			inputBlur(event){
				if(this.editor.activeColor){
					event.currentTarget.style.borderColor = '';
				}
			},
			//菜单项下拉选择
			doSelect(item) {
				if (this.editor.disabled) {
					return;
				}
				this.editor.restoreRange();
				switch (this.value) {
					case 'tag': //设置dom标签
						document.execCommand('formatBlock', false, item.value);
						break;
					case 'fontSize': //设置字号
						this.editor.$refs.content.style.fontSize = item.value;
						break;
					case 'fontFamily': //设置字体
						document.execCommand('fontName', false, item.value);
						break;
					case 'list': //设置列表
						if (item.value == 'ol') {
							//有序列表
							document.execCommand('insertOrderedList');
						} else {
							//无序列表
							document.execCommand('insertUnorderedList');
						}
						break;
					case 'justify': //对齐方式
						if (item.value == 'left') {
							document.execCommand('justifyLeft');
						} else if (item.value == 'center') {
							document.execCommand('justifyCenter');
						} else if (item.value == 'right') {
							document.execCommand('justifyRight');
						} else if (item.value == 'justify') {
							document.execCommand('justifyFull');
						}
						break;
					case 'foreColor': //字体颜色
						document.execCommand('foreColor', false, item.value);
						break;
					case 'backColor': //背景色
						document.execCommand('hiliteColor', false, item.value);
						break;
					default: //自定义操作
						this.editor.$emit('custom', {
							key: this.value,
							itemKey: item.value
						})
				}
				this.hideLayer()
			},
			//显示浮层
			showLayer() {
				if (this.editor.disabled) {
					return;
				}
				if (this.hasSelect) {
					this.layerShow = true;
					this.$nextTick(() => {
						if (this.editor.range) {
							if (this.value == 'link') {
								this.linkInsertSet();
							} else if (this.value == 'table') {
								this.tableInsertSet();
							} else if (this.value == 'image' || this.value == 'video') {
								this.uploadSet();
							}
						}
					})
				}
			},
			//隐藏浮层
			hideLayer() {
				if (this.editor.disabled) {
					return;
				}
				if (this.hasSelect) {
					this.layerShow = false;
				}
			},
			//菜单项点击
			targetTrigger() {
				if (this.editor.disabled) {
					return;
				}
				if (this.value != 'codeView' && this.editor.codeViewShow) {
					return;
				}
				if (this.hasSelect) {
					if (this.editor.trigger == 'click') {
						if (this.layerShow) {
							this.hideLayer()
						} else {
							this.showLayer()
						}
					}
				} else { //直接作用
					this.editor.restoreRange()
					//直接设置
					switch (this.value) {
						case 'undo': //撤销
							document.execCommand('undo');
							break;
						case 'redo': //恢复
							document.execCommand('redo');
							break;
						case 'removeFormat': //移出全部样式
							document.execCommand('removeFormat');
							break;
						case 'selectAll': //全选
							document.execCommand('selectAll');
							break;
						case 'divider': //分割线
							document.execCommand('insertHorizontalRule');
							document.execCommand('insertHtml', false, '<p><br></p>');
							break;
						case 'bold': //加粗
							document.execCommand('bold');
							break;
						case 'italic': //斜体
							document.execCommand('italic');
							break;
						case 'underline': //下划线
							document.execCommand('underline');
							break;
						case 'strikeThrough': //删除线
							document.execCommand('strikeThrough');
							break;
						case 'subscript': //下标
							document.execCommand('subscript');
							break;
						case 'superscript': //上标
							document.execCommand('superscript');
							break;
						case 'quote': //引用
							if (this.menuActive) {
								this.removeBlock()
							} else {
								document.execCommand('formatBlock', false, 'blockquote');
							}
							break;
						case 'code': //代码
							if (this.menuActive) {
								this.removeCode()
							} else {
								document.execCommand('formatBlock', false, 'pre');
							}
							break;
						case 'codeView': //显示源码
							this.editor.codeViewShow = !this.editor.codeViewShow;
							this.$nextTick(() => {
								if (this.editor.codeViewShow) {
									this.editor.$refs.codeView.innerText = this.editor.html;
									this.editor.menuRefs.forEach(child=>{
										if(child.value != 'codeView'){
											child.menuActive = false;
										}else {
											child.menuActive = true;
										}
									})
								} else {
									this.editor.$refs.content.innerHTML = this.editor.html;
									this.editor.menuRefs.forEach(child=>{
										if(child.value != 'codeView'){
											this.editor.changeActive()
										}else {
											child.menuActive = false;
										}
									})
								}
								this.editor.collapseToEnd();
							})
							break;
						default: //自定义
							this.editor.$emit('custom', {
								key: this.value,
								menu:this
							})
					}
				}
			},
			//插入远程图片或者视频
			insertRemote() {
				if (this.editor.disabled) {
					return;
				}
				if (!this.remoteUrl) {
					this.hideLayer()
					return
				}
				this.editor.restoreRange();
				if (this.value == 'image') {
					this.editor.insertImage(this.remoteUrl)
				} else {
					this.editor.insertVideo(this.remoteUrl)
				}
				this.remoteUrl = '';
				this.tabIndex = 0;
				this.hideLayer();
			},
			//上传设置
			uploadSet() {
				if (this.$refs.upload && Object.keys(this.$refs.upload).length > 0) {
					for (let i = 0; i < this.$refs.upload.length; i++) {
						let upload = new Upload(this.$refs.upload[i], this.uploadOptions)
						upload.init()
					}
				}
			},
			//插入链接
			insertLink() {
				if (this.editor.disabled) {
					return;
				}
				if (!this.linkUrl) {
					this.hideLayer()
					return
				}
				if (!this.linkText) {
					this.linkText = this.linkUrl;
				}
				let link = $util.string2dom(`<a href="${this.linkUrl}">${this.linkText}</a>`);
				if (this.linkTarget) {
					link.setAttribute('target', '_blank');
				}
				this.editor.restoreRange();
				if (this.menuActive) {
					let node = this.editor.getSelectNode();
					if (this.editor.compareTag(node,'a')) {
						let a = this.editor.getCompareTag(node,'a');
						a.remove()
					}
				}
				document.execCommand('insertHtml', false, link.outerHTML)
				this.hideLayer()
			},
			//链接插入设置
			linkInsertSet() {
				if (this.menuActive) { //激活状态
					let node = this.editor.getSelectNode();
					let a = this.editor.getCompareTag(node,'a');
					this.linkUrl = a.getAttribute('href'); //初始化赋值
					this.linkText = a.innerText; //初始化赋值
					this.linkTarget = a.hasAttribute('target'); //初始化赋值
					this.$nextTick(() => {
						this.$refs.linkText.focus()
					})
				} else {
					this.linkUrl = '';
					this.linkTarget = false;
					let text = this.editor.range.toString();
					if (text) {
						this.linkText = text;
						this.$refs.linkUrl.focus()
					} else {
						this.linkText = '';
						this.$refs.linkText.focus()
					}
				}
			},
			//删除链接
			deleteLink() {
				if (this.editor.disabled) {
					return;
				}
				this.editor.restoreRange();
				let node = this.editor.getSelectNode();
				if (this.editor.compareTag(node,'a')) {
					let a = this.editor.getCompareTag(node,'a')
					if(a){
						a.remove();
						this.menuActive = false;
					}
				}
				this.editor.updateHtmlText();
				this.editor.updateValue();
				this.hideLayer()
			},
			//表格插入设置
			tableInsertSet() {
				if (this.$refs.rowsInput) {
					this.$refs.rowsInput.focus();
				}
			},
			//插入表格
			insertTable() {
				if (!this.tableRows || !this.tableColumns) {
					this.hideLayer()
					return;
				}
				if (!$util.matchingText(this.tableRows, 'number') || !$util.matchingText(this.tableColumns, 'number')) {
					this.hideLayer();
					return;
				}
				let table = this.$refs.table.cloneNode(true);
				table.style.display = '';
				this.editor.restoreRange();
				document.execCommand('insertHtml', false, table.outerHTML);
				this.hideLayer()
			},
			//增加行
			addTableRow() {
				let node = this.editor.getSelectNode();
				if(this.editor.compareTag(node,'tr')){
					let tr = this.editor.getCompareTag(node,'tr');
					this.copyRowAppend(tr);
				}else if (this.editor.compareTag(node,'tbody')) { //tbody
					let tbody = this.editor.getCompareTag(node,'tbody');
					let children = $util.children(tbody, 'tr');
					this.copyRowAppend(children[children.length - 1]);
				} else if (this.editor.compareTag(node,'table')) { //table
					let table = this.editor.getCompareTag(node,'table')
					let tbody = $util.children(table, 'tbody')[0];
					let children = $util.children(tbody, 'tr');
					this.copyRowAppend(children[children.length - 1]);
				}
				this.editor.updateHtmlText();
				this.editor.updateValue();
				this.hideLayer();
			},
			//删除行
			removeTableRow() {
				let node = this.editor.getSelectNode();
				if(this.editor.compareTag(node,'tr')){
					let tr = this.editor.getCompareTag(node,'tr');
					tr.remove()
				}else if (this.editor.compareTag(node,'tbody')) { //tbody
					let tbody = this.editor.getCompareTag(node,'tbody');
					let children = $util.children(tbody, 'tr');
					children[children.length - 1].remove()
				} else if (this.editor.compareTag(node,'table')) { //table
					let table = this.editor.getCompareTag(node,'table')
					let tbody = $util.children(table, 'tbody')[0];
					let children = $util.children(tbody, 'tr');
					children[children.length - 1].remove()
				}
				this.editor.updateHtmlText();
				this.editor.updateValue();
				this.hideLayer();
			},
			//增加列
			addTableColumn() {
				let node = this.editor.getSelectNode();
				if(this.editor.compareTag(node,'td')){
					let td = this.editor.getCompareTag(node,'td');
					this.copyColumnAppend(td)
				}else if(this.editor.compareTag(node,'tr')){
					let tr = this.editor.getCompareTag(node,'tr');
					let children = $util.children(tr, 'td');
					this.copyColumnAppend(children[children.length - 1]);
				}else if(this.editor.compareTag(node,'tbody')){
					let tbody = this.editor.getCompareTag(node,'tbody');
					let tr = $util.children(tbody, 'tr')[0];
					let childrenTd = $util.children(tr, 'td');
					this.copyColumnAppend(childrenTd[childrenTd.length - 1]);
				}else if(this.editor.compareTag(node,'table')){
					let table = this.editor.getCompareTag(node,'table');
					let tbody = $util.children(table, 'tbody')[0];
					let tr = $util.children(tbody, 'tr')[0];
					let childrenTd = $util.children(tr, 'td');
					this.copyColumnAppend(childrenTd[childrenTd.length - 1]);
				}
				this.editor.updateHtmlText();
				this.editor.updateValue();
				this.hideLayer();
			},
			//删除列
			removeTableColumn() {
				let node = this.editor.getSelectNode();
				if(this.editor.compareTag(node,'td')){
					let td = this.editor.getCompareTag(node,'td');
					this.removeColumn(td);
				}else if(this.editor.compareTag(node,'tr')){
					let tr = this.editor.getCompareTag(node,'tr');
					let children = $util.children(tr, 'td');
					this.removeColumn(children[children.length - 1]);
				}else if(this.editor.compareTag(node,'tbody')){
					let tbody = this.editor.getCompareTag(node,'tbody');
					let tr = $util.children(tbody, 'tr')[0];
					let childrenTd = $util.children(tr, 'td');
					this.removeColumn(childrenTd[childrenTd.length - 1]);
				}else if(this.editor.compareTag(node,'table')){
					let table = this.editor.getCompareTag(node,'table');
					let tbody = $util.children(table, 'tbody')[0];
					let tr = $util.children(tbody, 'tr')[0];
					let childrenTd = $util.children(tr, 'td');
					this.removeColumn(childrenTd[childrenTd.length - 1]);
				}
				this.editor.updateHtmlText();
				this.editor.updateValue();
				this.hideLayer();
			},
			//删除表格
			deleteTable() {
				this.editor.restoreRange();
				let node = this.editor.getSelectNode()
				let table = this.editor.getCompareTag(node,'table');
				if(table){
					table.remove();
					this.menuActive = false;
				}
				this.editor.updateHtmlText();
				this.editor.updateValue();
				this.hideLayer();
			},
			//在指定节点后插入节点
			insertNodeAfter(newNode, targetNode) {
				let parent = targetNode.parentNode;
				let children = $util.children(parent);
				if (children[children.length - 1] == targetNode) {
					parent.appendChild(newNode)
				} else {
					parent.insertBefore(newNode, targetNode.nextSibling);
				}
			},
			//复制表格行进行增加
			copyRowAppend(row) {
				let newRow = row.cloneNode(true);
				newRow.querySelectorAll('td').forEach(td => {
					td.innerText = '';
				})
				this.insertNodeAfter(newRow, row);
			},
			//复制表格列进行增加
			copyColumnAppend(column) {
				//该列在父元素中的序列
				let index = [].indexOf.call($util.children(column.parentNode, column.tagName), column);
				column.parentNode.parentNode.querySelectorAll('tr').forEach(tr => {
					let td = $util.children(tr, 'td')[index];
					let newColumn = td.cloneNode(true);
					newColumn.innerText = '';
					this.insertNodeAfter(newColumn, td);
				})
			},
			//根据表格列删除指定的一列
			removeColumn(column) {
				//该列在父元素中的序列
				let index = [].indexOf.call($util.children(column.parentNode, column.tagName), column);
				column.parentNode.parentNode.querySelectorAll('tr').forEach(tr => {
					let td = $util.children(tr, 'td')[index];
					td.remove();
				})
			},
			//删除代码块
			removeCode() {
				let node = this.editor.getSelectNode()
				let pres = this.editor.$refs.content.querySelectorAll('pre');
				let pre = null;
				let innerHTML = ''
				for (let i = 0; i < pres.length; i++) {
					if ($util.isContains(pres[i], node)) {
						pre = pres[i];
						innerHTML = pre.innerHTML;
						break;
					}
				}
				let pEl = $util.string2dom("<p>" + innerHTML + "</p>");
				this.insertNodeAfter(pEl,pre)
				pre.remove()
				if(this.editor.range){
					this.editor.range.setStartAfter(pEl)
					this.menuActive = false;
				}
				this.editor.updateHtmlText();
				this.editor.updateValue();
			},
			//删除引用
			removeBlock(){
				let node = this.editor.getSelectNode()
				let blockquotes = this.editor.$refs.content.querySelectorAll('blockquote');
				let blockquote = null;
				let innerHTML = ''
				for (let i = 0; i < blockquotes.length; i++) {
					if ($util.isContains(blockquotes[i], node)) {
						blockquote = blockquotes[i];
						innerHTML = blockquote.innerHTML;
						break;
					}
				}
				let pEl = $util.string2dom("<p>" + innerHTML + "</p>");
				if(pEl instanceof HTMLCollection){
					pEl = $util.string2dom("<div>" + innerHTML + "</div>")
				}
				this.insertNodeAfter(pEl,blockquote)
				blockquote.remove()
				if(this.editor.range){
					this.editor.range.setStartAfter(pEl)
					this.menuActive = false;
				}
				this.editor.updateHtmlText();
				this.editor.updateValue();
			}
		},
		beforeUnmount() {
			if (this.editor.trigger == 'hover') {
				this.$el.removeEventListener('mouseenter', this.showLayer);
				this.$el.removeEventListener('mouseleave', this.hideLayer);
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../css/mvi-basic.less";

	.mvi-eitor-item {
		display: block;
		position: relative;

		.mvi-editor-target {
			display: flex;
			justify-content: center;
			align-items: center;
			width: @small-height;
			height: @small-height;
			color: @font-color-sub;
			font-size: @font-size-default;
			margin: 0;
			padding: 0;
			transition: color 200ms;
			-webkit-transition: color 200ms;

			&:hover {
				cursor: pointer;
				color: @font-color-default;
			}

			&[disabled] {
				opacity: .6;
				color: @font-color-sub;
			}
		}

		.mvi-editor-layer {
			display: block;

			&>div {
				display: block;
				padding: @mp-xs 0;
			}

			.mvi-editor-el {
				display: block;
				padding: @mp-sm @mp-md;
				white-space: nowrap;
				font-size: @font-size-default;
				color: @font-color-sub;
				text-align: center;

				&:hover {
					color: @font-color-default;
					cursor: pointer;
					background-color: @bg-color-default;
				}

				.mvi-editor-el-icon {
					margin-right: @mp-sm;
				}
			}

			.mvi-editor-colors {
				width: 3.2rem;
				padding: @mp-xs @mp-xs 0 @mp-xs;

				.mvi-editor-color {
					display: block;
					width: @small-height/2;
					height: @small-height/2;
					position: relative;
					transition: transform 300ms;
					-webkit-transition: transform 300ms;
					-moz-transition: transform 300ms;

					&:hover {
						cursor: pointer;
						transform: translate3d(0, 0, 0) scale(1.2);
						z-index: 2;
					}
				}
			}

			.mvi-editor-medias {
				width: 4rem;

				.mvi-editor-upload {
					display: block;
					width: 100%;
					padding: @mp-sm 0;
					font-size: 0.72rem;
					color: @font-color-sub;
					text-align: center;

					&:hover {
						cursor: pointer;
						color: @font-color-default;
					}
				}

				.mvi-editor-remote {
					display: block;
					width: 100%;
					padding: @mp-sm @mp-sm 0 @mp-sm;

					.mvi-editor-remote-input {
						appearance: none;
						-webkit-appearance: none;
						-moz-appearance: none;
						display: block;
						width: 100%;
						margin: 0;
						padding: @mp-xs;
						border: none;
						border-bottom: 1px solid @border-color;
						font-size: @font-size-default;
						color: @font-color-default;
						line-height: 1.5;
						transition: border-color 400ms;
						-moz-transition: border-color 400ms;
						-webkit-transition: border-color 400ms;
					}

					.mvi-editor-remote-insert {
						display: block;
						width: 100%;
						padding-top: @mp-sm;
						text-align: right;
						color: @primary-normal;

						&:hover {
							cursor: pointer;
						}
					}
				}
			}

			.mvi-editor-links {
				width: 6rem;

				.mvi-editor-link {
					display: block;
					width: 100%;
					padding: @mp-sm @mp-sm 0 @mp-sm;

					.mvi-editor-link-input {
						appearance: none;
						-webkit-appearance: none;
						-moz-appearance: none;
						display: block;
						width: 100%;
						margin: 0;
						padding: @mp-xs;
						border: none;
						border-bottom: 1px solid @border-color;
						font-size: @font-size-default;
						color: @font-color-default;
						line-height: 1.5;
						margin-bottom: @mp-sm;
						transition: border-color 400ms;
						-moz-transition: border-color 400ms;
						-webkit-transition: border-color 400ms;
					}

					.mvi-editor-link-footer {
						display: flex;
						display: -webkit-flex;
						justify-content: space-between;
						align-items: center;
						width: 100%;
						margin-top: @mp-sm;
						padding: @mp-xs 0;

						.mvi-editor-link-operation {
							display: flex;
							justify-content: flex-start;
							align-items: center;

							.mvi-editor-link-delete {
								color: @font-color-sub;
								font-size: @font-size-default;
								margin-right: @mp-md;

								&:hover {
									color: @font-color-default;
									cursor: pointer;
								}
							}

							.mvi-editor-link-insert {
								color: @primary-normal;
								font-size: @font-size-default;

								&:hover {
									cursor: pointer;
								}
							}
						}
					}
				}
			}

			.mvi-editor-tables {
				width: 6rem;

				.mvi-editor-table {
					display: block;
					width: 100%;
					padding: @mp-md @mp-md 0 @mp-md;

					.mvi-editor-table-create {
						display: block;
						width: 100%;
						text-align: center;
						padding-bottom: @mp-md;

						.mvi-editor-table-input {
							appearance: none;
							-webkit-appearance: none;
							-moz-appearance: none;
							display: inline-block;
							width: 1rem;
							margin: 0;
							padding: 0;
							text-align: center;
							border: none;
							border-bottom: 1px solid @border-color;
							font-size: @font-size-default;
							color: @font-color-default;
							line-height: 1.5;
							transition: border-color 400ms;
							-moz-transition: border-color 400ms;
							-webkit-transition: border-color 400ms;
						}
					}

					.mvi-editor-table-edit {
						display: flex;
						display: -webkit-flex;
						justify-content: space-between;
						align-items: center;
						width: 100%;

						&>span {
							display: inline-block;
							padding: @mp-xs @mp-sm;
							border-radius: @radius-default;

							&:hover {
								cursor: pointer;
								background-color: @bg-color-default;
							}
						}

						.mvi-editor-table-add {
							color: @primary-normal;
						}

						.mvi-editor-table-delete {
							color: @error-normal;
						}
					}

					.mvi-editor-table-footer {
						display: flex;
						justify-content: flex-end;
						align-items: center;
						width: 100%;
						margin-top: @mp-xs;

						.mvi-editor-table-delete {
							color: @font-color-sub;
							font-size: @font-size-default;
							padding: @mp-xs @mp-sm;
							border-radius: @radius-default;

							&:hover {
								color: @font-color-default;
								cursor: pointer;
								background-color: @bg-color-default;
							}
						}

						.mvi-editor-table-insert {
							color: @primary-normal;
							font-size: @font-size-default;
							border-radius: @radius-default;
							padding: @mp-xs @mp-sm;

							&:hover {
								cursor: pointer;
								background-color: @bg-color-default;
							}
						}
					}
				}
			}
		}
	}
</style>

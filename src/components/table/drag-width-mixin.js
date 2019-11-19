// 列宽度拖动
import { bind, unbind, getViewportOffset } from './util.js'
import {hasClass, addClass, removeClass} from './dom.js'

export default {

  data () {
    return {
      draggingTarget: null, // 当前拖动的元素
      draggingColumn: null, // 当前拖动的列
      isDragging: false, // 是否正在拖动
      draggingStartX: 0, // 拖动开始横坐标
      draggingEndX: 0, // 拖动结束横坐标
      minColumnWidth: 30 // 列允许拖动后的最小宽度
    }
  },

  methods: {

    handleTitleMouseMove (event, column) {

      if (!this.columnWidthDrag) {
        return false
      }

      let target, rect

      if (this.isDragging) {
        this.setDragLinePosition(event)
      }

      // 复杂表头，多列时不允许拖动
      if (column.children && Array.isArray(column.children)) {

        if (column.children.length > 1) {
          return false
        }
      }

      // 最后一列不允许拖动
      /*if (this.columns[this.columns.length - 1].title === column.title) {
        return false;
      }*/

      if (!this.border) {
        return false
      }

      target = event.target

      while (target && ((target.className && !hasClass(target, 'v-table-title-cell')) || !target.className)) {
        target = target.parentNode
      }

      this.draggingTarget = target;

      rect = target.getBoundingClientRect()

      const bodyStyle = document.body.style

      if (rect.width >= this.minColumnWidth && rect.right - event.pageX < 10) {

        if (!this.isDragging) { // 拖动中不设置
          this.draggingColumn = this.columns.find(x => x.title === column.title)
          if (!this.draggingColumn.width) {
            this.draggingColumn.width = rect.width;
          }
        }

        bodyStyle.cursor = 'col-resize'
      } else {
        if (!this.isDragging) { // 拖动中不设置
          this.draggingColumn = null
          bodyStyle.cursor = ''
        }
      }
    },

    handleTitleMouseOut () {

      if (!this.isDragging) {

        document.body.style.cursor = ''
      }
    },

    handleTitleMouseDown (event, column) {

      if (!this.draggingColumn || !this.border) {
        return false
      }

      this.isDragging = true

      this.draggingStartX = event.clientX

      this.setDragLinePosition(event)

      document.onselectstart = function () {
        return false
      }
      document.ondragstart = function () {
        return false
      }

      bind(document, 'mousemove', this.handleDragMouseMove)
      bind(document, 'mouseup', this.handleDragMouseUp)
    },

    handleDragMouseMove (e) {

      if (!this.isDragging) {
        return false
      }

      this.setDragLinePosition(e)
    },

    setDragLinePosition (e) {
      const tableLeft = getViewportOffset(this.$el).left,
        dragLine = this.$el.querySelector('.v-table-drag-line'),
        clientX = e.clientX

      if (!this.draggingColumn || this.draggingColumn.width + (clientX - this.draggingStartX) <= this.minColumnWidth) {
        return
      }

      dragLine.style.left = (clientX - tableLeft) + 'px'
    },

    // 拖动时mouseup
    handleDragMouseUp (e) {

      if (!this.isDragging) {
        return false
      }

      this.draggingEndX = e.clientX

      var differ = this.draggingEndX - this.draggingStartX

      // 差值大于1才处理
      if (Math.abs(differ) > 1) {

        let draggingColumn = this.draggingColumn
        let target = this.draggingTarget

        while (target && ((target.className && !hasClass(target, 'kh-table-wrapper')) || !target.className)) {
          target = target.parentNode
        }

        if (draggingColumn.width + differ < this.minColumnWidth) {
          draggingColumn.width = this.minColumnWidth

          target.style.width = (target.offsetWidth + draggingColumn.width - this.minColumnWidth) + 'px'
        } else {
          draggingColumn.width += differ
          target.style.width = (target.offsetWidth + differ) + 'px'
        }
      }
      this.draggingColumn = null
      this.draggingTarget = null
      document.body.style.cursor = ''
      this.isDragging = false

      document.onselectstart = function () {
        return true
      }
      document.ondragstart = function () {
        return true
      }

      unbind(document, 'mousemove', this.handleDragMouseMove)
      unbind(document, 'mouseup', this.handleDragMouseUp)
    }

  }

}

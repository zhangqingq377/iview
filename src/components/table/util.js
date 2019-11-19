import { deepCopy } from '../../utils/assist';

const convertColumnOrder = (columns, fixedType) => {
    let list = [];
    let other = [];
    columns.forEach((col) => {
        if (col.fixed && col.fixed === fixedType) {
            list.push(col);
        } else {
            other.push(col);
        }
    });
    return list.concat(other);
};

export {convertColumnOrder};

// set forTableHead to true when convertToRows, false in normal cases like table.vue
const getAllColumns = (cols, forTableHead = false) => {
    const columns = deepCopy(cols);
    const result = [];
    columns.forEach((column) => {
        if (column.children) {
            if (forTableHead) result.push(column);
            result.push.apply(result, getAllColumns(column.children, forTableHead));
        } else {
            result.push(column);
        }
    });
    return result;
};

export {getAllColumns};

const convertToRows = (columns, fixedType = false) => {
    const originColumns = fixedType ? fixedType === 'left' ? deepCopy(convertColumnOrder(columns, 'left')) : deepCopy(convertColumnOrder(columns, 'right')) : deepCopy(columns);
    let maxLevel = 1;
    const traverse = (column, parent) => {
        if (parent) {
            column.level = parent.level + 1;
            if (maxLevel < column.level) {
                maxLevel = column.level;
            }
        }
        if (column.children) {
            let colSpan = 0;
            column.children.forEach((subColumn) => {
                traverse(subColumn, column);
                colSpan += subColumn.colSpan;
            });
            column.colSpan = colSpan;
        } else {
            column.colSpan = 1;
        }
    };

    originColumns.forEach((column) => {
        column.level = 1;
        traverse(column);
    });

    const rows = [];
    for (let i = 0; i < maxLevel; i++) {
        rows.push([]);
    }

    const allColumns = getAllColumns(originColumns, true);

    allColumns.forEach((column) => {
        if (!column.children) {
            column.rowSpan = maxLevel - column.level + 1;
        } else {
            column.rowSpan = 1;
        }
        rows[column.level - 1].push(column);
    });

    return rows;
};

export {convertToRows};

const getRandomStr = function (len = 32) {
    const $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    const maxPos = $chars.length;
    let str = '';
    for (let i = 0; i < len; i++) {
        str += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return str;
};

export {getRandomStr};

const getViewportOffset = function (element) {

    var doc = document.documentElement,
      box = typeof element.getBoundingClientRect !== "undefined" ? element.getBoundingClientRect() : 0,
      scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
      scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0),
      offsetLeft = box.left + window.pageXOffset,
      offsetTop = box.top + window.pageYOffset;


    var left = offsetLeft - scrollLeft,
      top = offsetTop - scrollTop;

    return {
        left: left,
        top: top,
        right: window.document.documentElement.clientWidth - box.width - left,
        bottom: window.document.documentElement.clientHeight - box.height - top,
        right2: window.document.documentElement.clientWidth - left,
        bottom2: window.document.documentElement.clientHeight - top,
    }
};

export {getViewportOffset};

/*
     * 事件绑定
     *
     * @method bind
     * @param  {dom||window}   elem        需要绑定的dom节点或window对象
     * @param  {String}        event       绑定的事件名称
     * @param  {Function}      handler     事件处理方法
     */
const bind = function (elem, event, handler){
    if (elem && elem !== 'undefined' && event && handler) {

        event = event === 'mousewheel' ? (document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll") : event;

        if (document.attachEvent) { //if IE (and Opera depending on user setting)

            elem.attachEvent("on" + event, handler);
        }
        else { //WC3 browsers

            elem.addEventListener(event, handler, false);
        }
    }
};
export {bind};
/*
 * 移除事件绑定
 *
 * @method unbind
 * @param  {dom||window}   elem         需要移除绑定的dom节点或window对象
 * @param  {String}        event        绑定的事件名称
 * @param  {Function||Array<Function>}  handler    事件处理方法，可以为数组
 */
const unbind = function (elem, event, handler){
    if (elem && elem !== 'undefined' && event && handler) {

        event = event === 'mousewheel' ? (document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll") : event;

        var handlers = [];
        if (Array.isArray(handler) && handler.length > 0) {
            handlers = handler;
        } else {
            handlers.push(handler);
        }

        if (document.removeEventListener) {

            handlers.forEach(e => {
                elem.removeEventListener(event, e, false);
            })
        }
        else {

            handlers.forEach(e => {
                elem.removeEventListener('on' + event, e);
            })
        }
    }
};
export {unbind};




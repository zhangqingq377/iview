<template>
    <div :class="classes" :style="styles" @click="back">
        <slot>
            <div :class="innerClasses">
                <i class="kh-icon kh-icon-ios-arrow-up"></i>
            </div>
        </slot>
    </div>
</template>
<script>
    import { scrollTop } from '../../utils/assist';
    import { on, off } from '../../utils/dom';
    const prefixCls = 'kh-back-top';

    export default {
        props: {
            height: {
                type: Number,
                default: 400
            },
            bottom: {
                type: Number,
                default: 30
            },
            right: {
                type: Number,
                default: 30
            },
            scrollId: {
                type: String,
                default: ''
            },
            duration: {
                type: Number,
                default: 1000
            }
        },
        data () {
            return {
                backTop: false
            };
        },
        mounted () {
//            window.addEventListener('scroll', this.handleScroll, false);
//            window.addEventListener('resize', this.handleScroll, false);
            if (this.scrollId && document.getElementById(this.scrollId)) {
                on(document.getElementById(this.scrollId), 'scroll', this.handleScroll);
                on(document.getElementById(this.scrollId), 'resize', this.handleScroll);
            } else {
                on(window, 'scroll', this.handleScroll);
                on(window, 'resize', this.handleScroll);
            }
        },
        beforeDestroy () {
//            window.removeEventListener('scroll', this.handleScroll, false);
//            window.removeEventListener('resize', this.handleScroll, false);
            if (this.scrollId && document.getElementById(this.scrollId)) {
                off(document.getElementById(this.scrollId), 'scroll', this.handleScroll);
                off(document.getElementById(this.scrollId), 'resize', this.handleScroll);
            } else {
                off(window, 'scroll', this.handleScroll);
                off(window, 'resize', this.handleScroll);
            }
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-show`]: this.backTop
                    }
                ];
            },
            styles () {
                return {
                    bottom: `${this.bottom}px`,
                    right: `${this.right}px`
                };
            },
            innerClasses () {
                return `${prefixCls}-inner`;
            }
        },
        methods: {
            handleScroll () {
                if (this.scrollId && document.getElementById(this.scrollId)) {
                    this.backTop = document.getElementById(this.scrollId).scrollTop >= this.height;
                } else this.backTop = window.pageYOffset >= this.height;
            },
            back () {
                if (this.scrollId && document.getElementById(this.scrollId)) {
                    const sTop = document.getElementById(this.scrollId).scrollTop;
                    scrollTop(document.getElementById(this.scrollId), sTop, 0, this.duration);
                    this.$emit('on-click');
                } else {
                    const sTop = document.documentElement.scrollTop || document.body.scrollTop;
                    scrollTop(window, sTop, 0, this.duration);
                    this.$emit('on-click');
                }

            }
        }
    };
</script>

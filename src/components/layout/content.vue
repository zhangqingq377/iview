<template>
    <div :class="wrapClasses"><slot></slot></div>
</template>
<script>
    const prefixCls = 'kh-layout';
    export default {
        name: 'Content',
        computed: {
            wrapClasses () {
                return `${prefixCls}-content`;
            }
        }
    };
</script>

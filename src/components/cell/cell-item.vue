<template>
    <div class="kh-cell-item">
        <div class="kh-cell-icon">
            <slot name="icon"></slot>
        </div>
        <div class="kh-cell-main">
            <div class="kh-cell-title"><slot>{{ title }}</slot></div>
            <div class="kh-cell-label"><slot name="label">{{ label }}</slot></div>
        </div>
        <div class="kh-cell-footer">
            <span class="kh-cell-extra"><slot name="extra">{{ extra }}</slot></span>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            title: {
                type: String,
                default: ''
            },
            label: {
                type: String,
                default: ''
            },
            extra: {
                type: String,
                default: ''
            },
        }
    };
</script>

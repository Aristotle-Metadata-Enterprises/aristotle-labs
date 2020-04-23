<template>
    <div class="error-group">
        <error v-for="error in errors" :key="error" :error="error" />
    </div>
</template>

<script>
import Error from '@/components/error/Error.vue'

export default {
    components: {
        'error': Error
    },
    props: {
        // An array of NiceError objects to display
        errors: {
            type: Array,
            required: true,
        }
    }
}
</script>

<style scoped>
.error-group {
    width: 40%;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
}
</style>

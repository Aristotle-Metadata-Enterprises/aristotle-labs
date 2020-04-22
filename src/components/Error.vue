<template>
    <div class="alert alert-danger">
        {{ message }}
    </div>
</template>

<script>
export default {
    props: {
        message: {
            type: String,
            required: true,
        }
    }
}
</script>

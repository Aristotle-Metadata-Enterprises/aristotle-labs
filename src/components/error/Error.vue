<template>
    <div class="alert alert-danger">
        {{ error.message }}
    </div>
</template>

<script>
import { NiceError } from '@/error/class.js'
export default {
    props: {
        error: {
            type: NiceError,
            required: true,
        }
    }
}
</script>

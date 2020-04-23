<template>
    <div class="error-group">
        <div v-for="message in messages" :key="message" class="alert alert-danger">
            {{ message }}
        </div>
    </div>
</template>

<script>
import { NiceError } from '@/error/class.js'

export default {
    props: {
        // An array of NiceError objects to display
        errors: {
            type: Array,
            required: true,
        }
    },
    computed: {
        messages: function() {
            // use a set to avoid duplicate messages
            let messages = new Set()
            for (let error of this.errors) {
                if (error instanceof NiceError) {
                    messages.add(error.message)
                } else {
                    // Use generic message if we didnt get a NiceError
                    messages.add('An error has occurred')
                }
            }
            return messages
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

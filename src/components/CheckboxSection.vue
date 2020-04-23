<template>
    <div class="form-block form-check">
        <span :data-aristotle-concept-id="id">{{ name }}</span>
        <div v-for="o in options" :key="o.id">
            <input type="checkbox" class="form-check-input" :id="o.id" :value="o.name" @change="updateCheckedOptions" v-model="checkedOptions">
            <label :for="o.id" class="form-check-label">{{ o.name }}</label>
        </div>
    </div>
</template>

<script>
import aristotleTooltip from '@aristotle-metadata-enterprises/aristotle_tooltip'
import '@aristotle-metadata-enterprises/aristotle_tooltip/dist/tooltip.css'

export default {
    name: "CheckboxSection",
    props: {
        name: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
        options: {
            type: Array,
            required: true,
        }
    },
    data: () => ({
        checkedOptions: []
    }),
    mounted() {
        aristotleTooltip({
            'url': 'https://registry.aristotlemetadata.com',
            'definitionWords': 50,
            'longDefinitionWords': 75,
            'placement': 'top',
        });
    },
    methods: {
        updateCheckedOptions: function () {
            this.$emit('updateCheckedOpt', this.checkedOptions, this.name)
        },
    }
}
</script>

<style scoped>
.form-block {
    display: block;
    margin: 20px;
}
</style>
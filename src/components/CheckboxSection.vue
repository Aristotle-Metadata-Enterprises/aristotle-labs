<template>
    <div>
        <strong class="pl-20" :data-aristotle-concept-id="id">{{ name }}</strong>
        <div class="form-block form-check">
            <div v-for="o in options" :key="o.id">
                <input type="checkbox" class="form-check-input" :id="o.id" :value="o.name" @change="updateCheckedOptions" v-model="checkedOptions">
                <label :for="o.id" class="form-check-label">{{ o.name }}</label>
            </div>
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
            'placement': 'left',
        });
        this.initialiseOptions()
    },
    methods: {
        updateCheckedOptions: function () {
            this.$emit('updateCheckedOpt', this.checkedOptions, this.name)
        },
        initialiseOptions: function () {
            for(let option of this.options) {
                this.checkedOptions.push(option.name)
            }
            this.updateCheckedOptions()
        }
    }
}
</script>

<style scoped>
.form-block {
    display: block;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
}
.pl-20 {
    padding-left: 20px;
}
</style>
<template>
    <div>
        <div ref="title">
            <strong class="ml-20" :data-aristotle-concept-id="id">{{ name }}</strong>
        </div>
        <div class="form-block">
            <div v-for="o in options" :key="o.id">
            <div class="form-check" ref="content" :data-tippy-content="o.definition">
                <input type="checkbox" class="form-check-input" :id="o.id" :value="o.name" @change="updateCheckedOptions" v-model="checkedOptions">
                <label :for="o.id" class="form-check-label">{{ o.name }}</label>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import aristotleTooltip from '@aristotle-metadata-enterprises/aristotle_tooltip'
import '@aristotle-metadata-enterprises/aristotle_tooltip/dist/tooltip.css'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light-border.css';

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
    mounted: function() {
        aristotleTooltip({
            'selector': this.$refs.title,
            'definitionWords': 50,
            'longDefinitionWords': 75,
            'placement': 'left',
        })
        tippy(this.$refs.content, {
            placement: 'left',
            theme: 'light-border',
            duration: [275, 1250],
            flipOnUpdate: true,
        })
        this.initialiseOptions()
    },
    methods: {
        updateCheckedOptions: function () {
            this.$emit('updateCheckedOpt', this.checkedOptions)
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
    margin: 10px 20px;
}
.ml-20 {
    margin-left: 20px;
}
</style>

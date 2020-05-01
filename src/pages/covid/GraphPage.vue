<template>
    <div class="covid-graph mt-3 mb-3">
        <h1 class="text-center">
            Aristotle COVID-19 Dashboard - Bar chart view
        </h1>
        <hr>
        <div class="container">
            <div class="row">
                <div class="col-sm-12">
                    <div>
                    This dashboard provides an interactive display of <a class="no-logo" href="https://registry.aristotlemetadata.com/item/604099/" data-aristotle-concept-id="604099">COVID-19</a> based off data published by the European Centre for Disease Control. This data has been enhanced with metadata from an Aristotle Metadata Registry. Hover over any <span class="aristotle-green">green text</span> or text with the Aristotle Cloud logo to show more information about data, classifications or glossary definitions.
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <loading v-if="loading" />
        <template v-else class="container">
            <div class="row">
                <div class="col-sm-8">
                    <div class="graph-title">{{ graphTitle }}</div>
                    <bar-graph :selected="allSelected" :raw_data="raw_data" :distribution_map="distributionDataMap"
                                :data_element_options="options"/>
                    {{ currentDataElementDefinition }}
                </div>
                <div class="col-sm-4">
                    <div class="card bg-light option-selector">
                        <radio-selector
                                v-model="selected"
                                description="Select data to display"
                                :options="options"
                        />
                        <radio-selector
                                v-model="selectedCategory"
                                description="Choose a category data element"
                                :options="categoryOptions"
                        />

                        <div class="well-help">
                            Hover over an option to see more information about the data.
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <h2 class="text-center">
            How the data was created
        </h2>
        <metadata-display :selected="allSelected" :dss="dss" tooltips />
        <about-this-display />
    </div>
</template>


<script>
import RadioSelector from '@/components/RadioSelector.vue'
import BarGraph from '@/components/BarGraph.vue'
import MetadataDisplay from '@/components/MetadataDisplay.vue'
import AboutThisDisplay from '@/components/AboutThisDisplay.vue'
import Loading from '@/components/Loading.vue'
import aristotleTooltip from '@aristotle-metadata-enterprises/aristotle_tooltip'
import {
    getCovidData,
    getDistribution,
    getDatasetSpecification,
} from '@/data/covid.js'

import {
    getDistributionOptions,
    mapDistributionData,
    filterNumberDataElements,
    filterValueDataElements,
} from '@/data/api.js'
import { getTextForValue } from '@/utils/options.js'

export default {
    data: () => ({
        loading: true,
        distribution: {},
        dss: {},
        raw_data: {},
        selected: '',
        selectedCategory: '',
        currentDataElementDefinition: '',
        options: [],
        categoryOptions: [],
        dataMap: new Map(),
        distributionDataMap: {},
    }),
    components: {
        'radio-selector': RadioSelector,
        'bar-graph': BarGraph,
        'metadata-display': MetadataDisplay,
        'about-this-display': AboutThisDisplay,
        'loading': Loading,
    },
    mounted: function() {
        let dataPromise = getCovidData().then((raw_data) => {
            this.raw_data = raw_data;
        }).catch((error) => {
            this.errors.push(error)
        });

        let distPromise = getDistribution().then((data) => {
            this.distribution = data;
            this.options = getDistributionOptions(data, filterNumberDataElements);
            this.categoryOptions = getDistributionOptions(data, filterValueDataElements);
            this.distributionDataMap = mapDistributionData(data)
        }).catch((error) => {
            this.errors.push(error)
        })

        let dssPromise = getDatasetSpecification().then((data) => {
            this.dss = data
        }).catch((error) => {
            this.errors.push(error)
        })

        aristotleTooltip({
            'selector': this.$refs.block,
            'url': 'https://registry.aristotlemetadata.com',
            'definitionWords': 50,
            'longDefinitionWords': 75,
            'placement': 'bottom',
        });

        // Stop loading once all promises resolved
        Promise.all([dataPromise, distPromise, dssPromise]).finally(() => {
            if (this.options.length > 0) {
                this.selected = this.options[0].value
            }
            if (this.categoryOptions.length > 0) {
                this.selectedCategory = this.categoryOptions[0].value
            }
            this.loading = false;
        })
    },
    watch: {
        selected: function () {
            this.currentDataElementDefinition = this.$sanitize(this.options.find(obj => {
                return obj.value === this.selected
            }).definition)
        }
    },
    computed: {
        graphTitle: function() {
            let selectionText = getTextForValue(this.options, this.selected)
            let categoryText = getTextForValue(this.categoryOptions, this.selectedCategory)
            if (selectionText && categoryText) {
                return `${selectionText} by ${categoryText} over time`
            }
            // Fallback title
            return 'Covid Graph'
        },
        allSelected: function () {
            return [this.selected, this.selectedCategory]
        }
    }
}
</script>

<style>
/* pull all this out as its used in both graphs */
/* not scoped as we need to target the labels */
.graph-title {
    font-size: 110%;
    font-weight: 600;
    text-align: center;
}

.option-selector {
    margin-top:30px;
}
.option-selector label {
    font-size: 90%;
}
.well-help {
    margin:0px 15px;
    font-size: 90%;
}


*[data-aristotle-concept-id] {
    border-bottom: 0px dashed #356a69;
}
a[data-aristotle-concept-id] {
    color: #356a69;
    font-weight: 600;
    border-bottom: 1px dashed #356a69;
}
a[data-aristotle-concept-id]:hover {
    color: #356a69;
    border-bottom: 1px solid #356a69;
    text-decoration: none;
}
:not(a)[data-aristotle-concept-id]:after {
    content: "\2021";
    color: #356a69;
    font-weight: 600;
    margin-left: 3px;
    font-size: 80%;
    vertical-align: top;
}

</style>
<template>
    <div class="covid-graph mt-3 mb-3">
        <h1 class="text-center">
            Aristotle COVID-19 Dashboard - Bar chart view
        </h1>
        <tabs :tabs="tabs" />
        <covid-header-text />
        <loading v-if="loading" />
        <template v-else class="container">
            <div class="row">
                <div class="col-sm-8">
                    <div class="graph-title">{{ graphTitle }}</div>
                    <div class="graph-description">{{ currentDataElementDefinition }}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-8">
                    <bar-graph :selected="allSelected" :raw_data="raw_data" :distribution_map="distributionDataMap"
                                :data_element_options="options"/>
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
                    </div>
                </div>
            </div>
            <covid-metadata-display id="metadatadisplay" :selected="allSelected" :dss="dss" />
        </template>
        <about-this-display />
    </div>
</template>


<script>
import RadioSelector from '@/components/RadioSelector.vue'
import BarGraph from '@/components/BarGraph.vue'
import CovidHeaderText from '@/components/CovidHeaderText.vue'
import CovidMetadataDisplay from '@/components/CovidMetadataDisplay.vue'
import AboutThisDisplay from '@/components/AboutThisDisplay.vue'
import Loading from '@/components/Loading.vue'
import Tabs from "@/components/Tabs.vue"
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
        tabs: [],
    }),
    components: {
        'radio-selector': RadioSelector,
        'bar-graph': BarGraph,
        'covid-header-text': CovidHeaderText,
        'covid-metadata-display': CovidMetadataDisplay,
        'about-this-display': AboutThisDisplay,
        'loading': Loading,
        'tabs': Tabs,
    },
    mounted: function() {
        let dataPromise = getCovidData().then((raw_data) => {
            this.raw_data = raw_data
            this.tabs = [
                {
                    name: "Maps",
                    active: false,
                    link: '#/covid/map'
                },
                {
                    name: "Graph",
                    active: true,
                    link: '#/covid/graph'
                },
            ]
        }).catch((error) => {
            this.errors.push(error)
        });

        let distPromise = getDistribution().then((data) => {
            this.distribution = data
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
    margin-left: 60px;
}
.graph-description {
    font-size: 90%;
    margin-left: 10%;
    margin-right: 10%;
}

.option-selector {
    margin-top:5px;
}
.option-selector label {
    font-size: 90%;
}
.well-help {
    margin:0px 15px;
    font-size: 90%;
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

</style>

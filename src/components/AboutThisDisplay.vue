<template>
    <div>
        <h2 class="text-center">
            About this dashboard
        </h2>
        <div class="container" style="padding-bottom:80px;">
            <p>
            This dashboard shows COVID-19 case data from the <a href="https://registry.aristotlemetadata.com/item/604036/" data-aristotle-concept-id="604036">European Center for Disease Control</a> based on data collected by the 
            <a href="https://registry.aristotlemetadata.com/item/603889/" data-aristotle-concept-id="603889">World Health Organisation</a>.
            </p><p>
            This dashboard shows more than just a standard representation of  data. It also shows important information about how the data is stored, including codes and classifications, data types and definitions of business terminology. This information is known as <em>metadata</em> and gives people the necessary details to accurately interpret data. Without metadata, it can be difficult to determine what data means and where it has come from.
            </p>
            <div class="h4 text-center">Where did this metadata come from?</div>
            <p>
            We examined <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports">World Health Organisation Situation Reports</a> and <a href="https://apps.who.int/iris/bitstream/handle/10665/331234/WHO-2019-nCoV-SurveillanceCRF-2020.2-eng.pdf">case collection forms</a> to gather details on how data about COVID-19 was collected and aggregated by the World Health Organisation before reporting. We then entered this information into an
            <a href="https://registry.aristotlemetadata.com/item/604036/" data-aristotle-concept-id="604036">Aristotle Metadata Registry</a>
            to make the information available online in a central location.
            The metadata gathered includes data files and standards, but also definitions for important statistical classifications such as <a href="https://registry.aristotlemetadata.com/item/604038/" data-aristotle-concept-id="604038">modes of transmission</a> and <a href="https://registry.aristotlemetadata.com/item/604042/" data-aristotle-concept-id="604042">region classifications</a>.
            </p>

            <div class="h4 text-center">How metadata enhances data visualisations</div>
            <p>
            By entering this information into a metadata registry, not only was it more accessible to people browsing for information, we are able to
            <a href="https://registry.aristotlemetadata.com/api/">access it using our API</a> to produce the interactive graphs above and put business
            definitions along side the data so people can see what the data means and where it came from.
            </p>
            <p>
                Because all of these definitions are available via the API, they can be queried and displayed on the dashboard so someone reading the data can see the definitions alongside the data before they make a selection.
                <div class="text-center">
                    <img class="img-fluid" src="@/assets/covid-animated-tooltip.gif" alt="Tooltip example">
                </div>
            </p>
            <div class="h4 text-center">How metadata keeps data accessible and protected</div>
            <p>
            On this dashboard, the <a href="https://registry.aristotlemetadata.com/item/603889/" data-aristotle-concept-id="603889">source data collected</a> (shown in the above diagram under inputs) by the
            <a href="https://who.int">World Health Organisation</a> is sensitive information about individuals, however the <a>data collection forms</a> are made available.
            Because the metadata about how the data is collected is published, we can trace all of the transformations to the data before being grouped and
            <a href="https://registry.aristotlemetadata.com/item/604036/" data-aristotle-concept-id="604036">published at a country and region level</a>.
            </p>
            <p>
            By recording metadata about data during all stages of data collection, more information is available to people without them needing direct access to
            the data.
            </p>

        </div>
        <div class="scroller">
            <a href=""> <!-- Harry - can you make this target the subway map -->
                <span class="info">Scroll for more info
                </span>
                &darr;
            </a>
        </div>
    </div>
</template>

<script>
import aristotleTooltip from '@aristotle-metadata-enterprises/aristotle_tooltip'

export default {
    mounted: function() {
        aristotleTooltip({
            'selector': this.$refs.block,
            'url': 'https://registry.aristotlemetadata.com',
            'definitionWords': 50,
            'longDefinitionWords': 75,
            'placement': 'bottom',
        });
    }
}

</script>

<style>
.scroller {
    position: absolute;
    bottom: 20px;
    right: 40px;
    background-color: #4e8382;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 30px;
    text-align: center;
    padding-top: 4px;
    font-size: 20pt;
    font-weight: bold;
}
.scroller a, .scroller a:hover {
    color: white;
    text-decoration: none;
}

.scroller:hover {
    width: 180px;
}

.scroller .info {
    font-size: 12pt;
    display: none;
}

.scroller:hover .info {
    font-size: 10pt;
    font-weight: normal;
    display: inline-block;
}
</style>

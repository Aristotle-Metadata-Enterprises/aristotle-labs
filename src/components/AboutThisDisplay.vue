<template>
    <div>
        <h2 class="text-center">
            About this dashboard
        </h2>
        <div class="container">
            <p>
            This dashboard shows COVID-19 case data from the <a href="https://registry.aristotlemetadata.com/item/604036/" data-aristotle-concept-id="604036">European Center for Disease Control</a> based on data collected by the 
            <a href="https://registry.aristotlemetadata.com/item/603889/" data-aristotle-concept-id="603889">World Health Organisation</a>.
            </p><p>
            What we've shown in these graphs isn't just a representation of the data. We've also recorded important definitions about the data such as codes and classifications, data types and business definitions. This information is commonly known as <em>metadata</em> and gives people the necessary details to accurately interpret data.
            </p>
            <p>
            Aristotle's metadata analysts examined <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports">World Health Organisation Situation Reports</a> and case collection forms to gather these data definitions to show how the data was collected and transformed before being shared with the world.
            </p>
            <p>
            The metadata gathered includes data files and standards, but also definitions for important statistical classifications such as [[modes of transmission]] and [[region classifications]].
            </p><p>
            By recording all of these important definitions in a metadata registry we're able to use our APIs to bring this information into the graph to put these business definitions along side the data so people know what the data means and where it came from.
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

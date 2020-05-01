<template>
    <div class="home-page">
        <div class="jumbotron bg-light">
            <div class="container">
                <h1 class="display-4">
                    <i class="fas fa-flask" />
                    Aristotle Labs
                </h1>
                <p class="lead">
                    Metadata isn't just about describing data, it's about <em>empowering data</em>
                    to unlock its full potential.
                </p>
                <hr class="my-4">
                <p>
                    Below are a few of the projects built on the <a href="https://aristotlemetadata.com">Aristotle
                    Metadata Registry</a>
                    that demonstrate how a metadata registry makes data make sense.
                </p>
                <p class="lead">
                    <a class="btn btn-primary btn-lg" href="https://aristotlemetadata.com" role="button">
                        Learn more &raquo;
                    </a>
                </p>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h2>COVID-19 World Map</h2>
                    <p>
                        Using authoritative COVID-19 data from the ECDC and the WHO, use metadata selections to view
                        a world map of COVID-19 data. You can also press play to view the progression of the pandemic
                        across the globe.
                    </p>
                    <p>
                        <router-link class="btn btn-secondary" :to="{name: 'covidMap'}">
                            Covid Map &raquo;
                        </router-link>
                    </p>
                </div>
                <div class="col-md-6">
                    <h2>COVID-19 Bar Chart</h2>
                    <p>
                        Using authoritative COVID-19 data from the ECDC and the WHO, use metadata selections to view
                        a bar chart of COVID-19 Data. There is also a metadata display to discover exactly how the
                        data is collected and collated.
                    </p>
                    <p>
                        <router-link class="btn btn-secondary" :to="{name: 'covidGraph'}">
                            Covid Graph &raquo;
                        </router-link>
                    </p>
                </div>
            </div>
            <hr>
        </div>
    </div>
</template>

<script>
export default {}
</script>

<style scoped>
</style>
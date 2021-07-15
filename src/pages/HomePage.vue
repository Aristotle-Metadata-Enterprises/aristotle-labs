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
                <hr class="m-4">
                <p>
                    Below are a few of the projects built on the <a href="https://aristotlemetadata.com">Aristotle
                    Metadata Registry</a>
                    that demonstrate how a metadata registry makes data make sense.
                </p>
                <p class="lead">
                    <a class="btn btn-outline-dark" href="https://aristotlemetadata.com" role="button">
                        Learn more about the Aristotle Metadata Registry &raquo;
                    </a>
                </p>
            </div>
        </div>
        <div class="container">
            <div class="card-deck mb-3">
                <div class="card">
                    <img class="card-img-top" src="@/assets/landing-covid-bar.png" alt="">
                    <div class="card-body">
                        <h5 class="card-title">
                            COVID-19 Bar chart
                        </h5>
                        <p class="card-text">
                        View data from the European Center for Disease Control and the World Health Organisation,
                            use metadata selections to examine a bar chart of COVID-19 Data. 
                            There is also a metadata display to discover exactly how the data was collected and collated.
                        </p>
                    </div>
                    <div class="card-footer">
                        <router-link class="btn btn-primary" :to="{name: 'covidGraph'}">
                            See the COVID Graph &raquo;
                        </router-link>
                    </div>
                </div>
                <div class="card">
                    <img class="card-img-top" src="@/assets/landing-covid-map.png" alt="">
                    <div class="card-body">
                        <h5 class="card-title">
                            COVID-19 Map chart
                        </h5>
                        <p class="card-text">
                        View an interactive map based on COVID-19 data from the European Center for Disease Control and the World Health Organisation.
                            This dashboard includes Aristotle Metadata that provides additional context to data and an interactive time slider to view the progression of the pandemic across the globe.
                        </p>
                    </div>
                    <div class="card-footer">
                        <router-link class="btn btn-primary" :to="{name: 'covidMap'}">
                            See the COVID Map &raquo;
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="card-deck mb-3">
                <div class="card">
                    <img class="card-img-top" src="@/assets/sddf_excel.png" alt="">
                    <div class="card-body">
                        <h5 class="card-title">
                            Simple Data Dictionary Format Importer
                        </h5>
                        <p class="card-text">
                            View the Documentation for the Aristotle Simple Data Dictionary Importer.
                        </p>
                    </div>
                    <div class="card-footer">
                        <router-link class="btn btn-primary" :to="{name: 'sddf'}">
                            See the SDDF Documentation &raquo;
                        </router-link>
                    </div>
                </div>
                <div class="card">
                    <img class="card-img-top" src="@/assets/cropped_3d_graph.png">
                    <div class="card-body">
                        <h5 class="card-title">
                            3D Graph Lab
                        </h5>
                        <p class="card-text">
                            View a 3D graph of an Aristotle Data Set Specification
                        </p>
                    </div>
                    <div class="card-footer">
                        <a href="https://aristotle3d.netlify.app/" class="btn btn-primary">
                            See the 3D graph &raquo;
                        </a>
                    </div>
                </div>
                <div class="card">
                    <img class="card-img-top" src="@/assets/review_tool_screenshot.png">
                    <div class="card-body">
                        <h5 class="card-title">
                            Aristotle Metadata Advanced Review tool
                        </h5>
                        <p class="card-text">
                            Use the API-driven beta of our Advanced Review tool
                            to perform quality control of your content.
                        </p>
                    </div>
                    <div class="card-footer">
                        <a href="https://aristotle-pro-reviews.netlify.app/" class="btn btn-primary">
                            Load the Advanced Review tool &raquo;
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <hr class="m-5">
    </div>
</template>

<script>
export default {}
</script>

<style scoped>
.card-body {
    border-top: 1px solid lightgray;
}
</style>

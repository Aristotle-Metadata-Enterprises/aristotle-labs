<template>
    <div class="root">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <img class="navbar-brand img-fluid aristotle-logo" src="./aris_logo_small.png">
            <a class="navbar-brand" href="#">Aristotle Labs</a>

            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            COVID-19 Tools
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <router-link class="dropdown-item" :to="{name: 'covidGraph'}">
                                Covid Graph
                            </router-link>
                            <router-link class="dropdown-item" :to="{name: 'covidMap'}">
                                Covid Map
                            </router-link>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>

        <router-view/>
    </div>
</template>

<style>
    .aristotle-logo {
        height: auto;
        width: 5% !important;
    }

    /* Custom styling for navbar to make it aristotle green */
    .navbar-custom {
        background-color: #ff5500;
    }

    /* change the brand and text color */
    .navbar-custom .navbar-brand,
    .navbar-custom .navbar-text {
        color: rgba(255, 255, 255, .8);
    }

    /* change the link color */
    .navbar-custom .navbar-nav .nav-link {
        color: rgba(255, 255, 255, .5);
    }

    /* change the color of active or hovered links */
    .navbar-custom .nav-item.active .nav-link,
    .navbar-custom .nav-item:hover .nav-link {
        color: #ffffff;
    }

</style>


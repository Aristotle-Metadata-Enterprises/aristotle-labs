<template>
    <div class="root">
        <nav class="navbar navbar-custom navbar-expand-lg">
            <img class="navbar-brand img-fluid aristotle-logo" src="./aris_logo_small.png" alt="Aristotle Logo">
            <router-link class="navbar-brand" :to="{name: 'homePage'}">
                Aristotle Labs
            </router-link>

            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon" />
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <router-link class="nav-link" :to="{name: 'homePage'}">
                            Home <span class="sr-only">(current)</span>
                        </router-link>
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
        <div class="container-fluid container-main">
            <router-view />
        </div>
        <footer class="footer footer-custom">
            <div class="container text-center text-white">
                <div class="promo">
                    <div>
                        <img alt="Aristotle logo" class="navbar-brand img-fluid aristotle-logo" src="./aris_logo_small.png">
                    </div>
                    <div>
                        <p>
                            Aristotle Labs - powered by the Aristotle Metadata Registry
                        </p>
                        <p>© 2020 Copyright:
                            <a class="text-white" href="https://aristotlemetadata.com/">Aristotle Cloud Services Australia</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<style scoped>
html, body {
    min-height: 100vh;
    height: 100%;
}

footer .promo {
    display: table;
    margin: auto;
}
footer .promo > div {
    display:table-cell;
    vertical-align: middle;
}
footer .promo p {
    margin: 0.1em;
}

body {
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
}
.root {
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
    height: 100%
}
.container-main {
    flex-grow: 2;
}
.aristotle-logo {
    /* height: auto;
    width: 3% !important; */
    margin-top: 5px;
}

.footer-custom {
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #356a69;
}

/* Custom styling for navbar to make it aristotle green */
.navbar-custom {
    background-color: #356a69;
}

/* change the brand and text color */
.navbar-custom .navbar-brand,
.navbar-custom .navbar-text {
    color: white;
}

/* change the link color */
.navbar-custom .navbar-nav .nav-link {
    color: white;
}

/* change the color of active or hovered links */
.navbar-custom .nav-item.active .nav-link,
.navbar-custom .nav-item:hover .nav-link {
    color: white;
}

/* for dropdown only - change the color of droodown */
.navbar-custom .dropdown-menu {
    background-color: white;
}

.navbar-custom .dropdown-item {
    color: black;
}

.navbar-custom .dropdown-item:hover,
.navbar-custom .dropdown-item:focus {
    color: black;
    background-color: white;
}
</style>


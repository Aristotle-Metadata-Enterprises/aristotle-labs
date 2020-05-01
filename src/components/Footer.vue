<template>
    <footer class="footer footer-custom">
        <div class="container text-center text-white">
            <div class="promo">
                <div>
                    <img alt="Aristotle logo" class="navbar-brand img-fluid aristotle-logo" src="@/assets/aris_logo_small.png">
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
</template>

<style scoped>
.footer-custom {
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #356a69;
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
</style>

<template>
    <div class="root">
        <p>
            <router-link :to="{name: 'covidGraph'}">
                Covid Graph
            </router-link>
            <router-link :to="{name: 'covidMap'}">
                Covid Map
            </router-link>
        </p>
        <router-view />
    </div>
</template>

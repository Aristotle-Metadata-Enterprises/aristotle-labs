<template>
    <h1>Hello {{ name }}</h1>    
</template>

<script>
export default {
    data: () => ({
       'name': 'World'
    })
}
</script>

<style>
h1 {
    border-bottom: 1px solid steelblue;
}
</style>

<template>
  <div id="app">
    <h1>FargoRate Team Builder</h1>
    <h4>search for players by name below and add them to your roster by hitting ' + '. Identify required players (IE yourself) with ' ☆ '</h4>
    <hr>
    <playerSearch></playerSearch>
  </div>
</template>

<script>
import playerSearch from './components/playerSearch.vue'
export default {
  name: 'app',
  components: {
    playerSearch
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  margin-left:auto;
  margin-right:auto;
  max-width:720px;
}
</style>

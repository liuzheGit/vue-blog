<template>
  <div id="app">
    <i-header />
    <router-view/>

    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
  import Header from './components/Header'
export default {
  name: 'app',
  components: {
    'i-header': Header
  },
  created(){
    this.$Progress.start();

    this.$router.beforeEach((to, from, next) => {
      if(to.meta.progress !== undefined){
        let meta = to.meta.progress
        this.$Progress.parseMeta(meta)
      }

      this.$Progress.start()
      next()
    })

    this.$router.afterEach((to, from) => {
      this.$Progress.finish()
    })
  },
  mounted(){
    this.$Progress.finish();
  }
}
</script>

<style lang="scss">
</style>

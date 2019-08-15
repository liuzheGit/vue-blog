<template>
  <div class="home">
    <div class="banner">
      <p class="big">let's share</p>
      <p class="small">精品博客</p>
    </div>
  </div>
</template>

<script>
  import Test from '@/components/Test'
// @ is an alias to /src

export default {
  name: 'home',
  components: {
    Test
  },
  mounted(){
    this.$Progress.finish()
  }
}
</script>

<style lang="scss">
  .home{
    .banner{
      height: 400px;
      background: #003333;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .big{
        font-size: 40px;
        text-transform: uppercase;
      }
      .small{
        margin-top: 20px;
        font-size: 16px;
      }
    }
  }
</style>

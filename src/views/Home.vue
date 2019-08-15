<template>
  <div class="home">
    <div class="banner">
      <p class="big">let's share</p>
      <p class="small">精品博客</p>
    </div>
    <div class="one container clearfix" v-if="one">
      <img :src="one.img_url" :alt="one.vol" class="one-img">
      <p class="word">
        {{one.word}}
        <br>
        <span class="right">--{{one.word_from}}</span>
      </p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.defaults.transformRequest = [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
  }]
  import Test from '@/components/Test'
  // @ is an alias to /src

  export default {
    name: 'home',
    data() {
      return {
        one: null
      }
    },
    components: {
      Test
    },
    created() {
      this.getOne();
    },
    mounted() {
      this.$Progress.finish()
    },
    methods: {
      getOne() {
        axios({
          method: 'post',
          url: 'https://api.hibai.cn/api/index/index',
          data: {
            TransCode: '030111',
            OpenId: '123456789'
          },
        }).then(({data}) => {
          let {Body} = data;
          this.one = Body;
        })
      }
    }
  }
</script>

<style lang="scss">
  .home {
    .banner {
      height: 400px;
      background: #003333;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .big {
        font-size: 40px;
        text-transform: uppercase;
      }
      .small {
        margin-top: 20px;
        font-size: 16px;
      }
    }
  }
  .one{
    margin-top: 20px;
    position: relative;
    .one-img{
      width: 500px;
      float: left;
    }
  }
</style>

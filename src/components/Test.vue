<template>
  <div class="test container">
    <el-select v-model="form.category" placeholder="请选择">
      <el-option
        v-for="item in categories"
        :key="item.get('objectId')"
        :value-key="item.get('objectId')"
        :label="item.get('name')"
        :value="item">
      </el-option>
    </el-select>
    <el-button @click="con">按钮</el-button>
  </div>
</template>

<script>
  export default {
    name: "Test",
    data() {
      return {
        categories: [],
        form: {
          category: null,
          title: ''
        }
      }
    },
    created() {
      this.getData();
      console.log(this.categories)
    },
    mounted() {

    },
    methods: {
      JSONparse(data){
        return JSON.parse(JSON.stringify(data))
      },
      con(){
        console.log(this.form.category.get('name'))
      },
      getData() {
        const cq = new this.$api.SDK.Query('Category');
        cq.find().then(function (items) {
          this.categories = items;
          // this.form.category = this.JSONparse(items[2]);
          // console.log(this.categories)
        }.bind(this))
            .catch(err => console.log(err))
      },
      // selectChange(value){
      //   // let data = this.JSONparse(value)
      //   // console.log(data);
      //   console.log(value)
      //   this.form.category = value
      // }
    }
  }
</script>

<style scoped lang="scss">

</style>
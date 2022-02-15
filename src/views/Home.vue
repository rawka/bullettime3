<template>
  <div class="home">
    <div class="video" v-for="video in videos" :key="video._id">
      <video :src="video.path" loop controls>
        Не поддерживается
      </video>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
      videos: null
    }
  },
  mounted() {
    axios.get(this.$root.address+'api/published').then(response => (this.videos = response.data))
  },
  sockets: {
    connect: function (){
      console.log("conn")
    },
    published: function (video) {
      this.videos.unshift(video)
    },
    unpublished: function (id) {
      let i = this.videos.map(data => data._id).indexOf(id)
      this.videos.splice(i, 1)
    },
    deleted: function (id) {
      let i = this.videos.map(data => data._id).indexOf(id)
      this.videos.splice(i, 1)
    }
  },
}
</script>

<style scoped>
  video {
    width: 100%;
    max-height: 100%;
  }
</style>

<template>
  <div class="tablet">
      <slider width="640px" :indicators="false" :control-btn="false" :duration="5000" @change="playstop">
          <slider-item v-for="(video,index) in videos" :key="video._id">
              <video :ref="'video'+index" :src="video.path" muted>
                  Не поддерживается
              </video>
          </slider-item>
      </slider>

      <img src = "../assets/qr.svg" alt="QR"/>
  </div>
</template>

<script>
  import axios from 'axios'
  import { Slider, SliderItem } from 'vue-easy-slider'
    export default {
    name: 'Home',
    components: {
        Slider,
        SliderItem,
    },
    data() {
      return {
        videos: null
      }
    },
    mounted() {
      axios.get(this.$root.address+'api/published').then(response => (this.videos = response.data))
    },
    methods: {
        playstop(i) {
            this.$refs['video'+i][0].play()
            if (i !== 0) {
                this.$refs['video'+(i-1)][0].pause()
            } else {
                const len = this.videos.length
                this.$refs['video'+(len - 1)][0].pause()
            }
        }
    },
    sockets: {
      connect: function (){
        console.log("conn")
      },
      published: function () {
        //this.videos.unshift(video)
        this.$router.go('/tablet')
      },
      unpublished: function () {
          //this.videos.unshift(video)
          this.$router.go('/tablet')
      },
      deleted: function () {
        //let i = this.videos.map(data => data._id).indexOf(id)
        //this.videos.splice(i, 1)
        this.$router.go('/tablet')
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


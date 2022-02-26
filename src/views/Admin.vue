<template>
  <div class="admin">
    <div class="global__controls">
      <button class="btn btn-green" v-on:click="del(video._id, video.name)">Запустить EXE</button>
      <button class="btn btn-green" v-on:click="del(video._id, video.name)">Запустить BAT</button>
      <button class="btn btn-red" v-on:click="del(video._id, video.name)">Удалить все</button>
    </div>
    <div class="video" v-for="video in videos" :key="video._id">
      <video :src="video.path" loop controls>
        Не поддерживается
      </video>
      <div class="controls">
        <img src = "../assets/qr__wifi.svg" alt="QR" class="qr"/>
        <button v-if="video.publish" class="btn btn-grey" v-on:click="unpublish(video._id)">Убрать</button>
        <button v-else class="btn btn-green" v-on:click="publish(video._id)">Опубликовать</button>
        <img src = "../assets/qr__site.svg" alt="QR" class="qr"/>
      </div>
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
    sockets: {
      connect: function (){
        console.log("conn")
      },
      add_video: function (video) {
        this.videos.unshift(video)
      }
    },
    mounted() {
      axios.get(this.$root.address+'api/all').then(response => (this.videos = response.data))
    },
    methods: {
      publish: function (id) {
        axios.post(this.$root.address+'api/publish',{id:id})
        this.$socket.emit('publish', id)
        let i = this.videos.map(data => data._id).indexOf(id)
        this.videos[i].publish = true
      },
      unpublish: function (id) {
        axios.post(this.$root.address+'api/unpublish',{id:id})
        this.$socket.emit('unpublish', id)
        let i = this.videos.map(data => data._id).indexOf(id)
        this.videos[i].publish = false
      },

      del: function (id,name) {
        let params = {id:id, name:name}
        axios.delete(this.$root.address+'api/del',{data: params}).then(() => {
          let i = this.videos.map(data => data._id).indexOf(id)
          this.videos.splice(i, 1)
        })
        this.$socket.emit('delete', id)
      }
    }
  }
</script>

<style scoped>
  video {
    width: 100%;
    max-height: 100%;
  }
  .video {
    padding-bottom: 20px;
  }
  .admin {
    display: flex;
    flex-direction: column;
    max-width: 640px;
  }
  .controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
  }
  .btn {
    font-size: 16px;
    width: 150px;
    height: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 5px;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
    color: azure;
  }
  .btn-grey {
    background: #616161;
  }
  .btn-green {
    background: #009900;
  }
  .btn-red {
    background: #e62222;
  }
  .global__controls {
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
  }
</style>
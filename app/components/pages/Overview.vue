<template>
  <div>
   
    <div class="modal" :class="{ 'is-active': addFloorOpened }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Ajouter un étage</p>
          <button @click.prevent="addFloorOpened = false" class="delete"></button>
        </header>
        <section class="modal-card-body">
          <div class="content">
            <label class="label">Nom de l'étage</label>
            <p class="control">
              <input v-model="floorNameInput" class="input" type="text" placeholder="Premier étage">
            </p>
          </div>
        </section>
        <footer class="modal-card-foot">
          <a @click="addFloor" class="button is-primary">Ajouter</a>
        </footer>
      </div>
    </div>

     <div class="modal" :class="{ 'is-active': addRoomOpened }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Ajouter une salle</p>
          <button @click.prevent="addRoomOpened = false" class="delete"></button>
        </header>
        <section class="modal-card-body">
          <div class="content">
            <label class="label">Nom de la salle</label>
            <p class="control">
              <input v-model="roomNameInput" class="input" type="text" placeholder="chambre">
            </p>
          </div>
        </section>
        <footer class="modal-card-foot">
          <a @click="addRoom" class="button is-primary">Ajouter</a>
        </footer>
      </div>
    </div>

    <h1 class="title">Vue d'ensemble</h1>
    <h2 class="subtitle">
      Ici, vous pouvez modéliser votre maison sous forme d'étages et de pièces.
    </h2>

    <div @click="addFloorOpened = true" class="notification is-primary clickable">
      <div class="content">
        <p class="title">
          <span class="icon"><i class="fa fa-plus"></i></span>
          Ajouter un étage
        </p>
      </div>
    </div>

    <template v-for="floor in infrastructure.house.floors">
      <div @click= "mapFloorId = floor.id" class="notification is-primary clickable">
        <button @click="deleteFloor(floor.id)" class="delete"></button>
        <p class="title">
          <span class="icon"><i class="fa fa-eye"></i></span>
          {{ floor.name }}
        </p>
      </div>

      <div @click="openaddRoomModal(floor.id)" class="notification is-info clickable">
        <p class="title">
          <span class="icon"><i class="fa fa-plus"></i></span>
          Ajouter une salle
        </p>
      </div>
    </template>
    <template v-for = "floor in infrastructure.house.floors">
      <div v-if = "floor.id === mapFloorId">
    <grid-layout
            :layout="floor.roomsMap"
            :col-num="12"
            :row-height="30"
            :is-draggable="true"
            :is-resizable="true"
            :vertical-compact="true"
            :margin="[10, 10]"
            :use-css-transforms="true"
    >

        <grid-item v-for="item in floor.roomsMap"
                   :x="item.x"
                   :y="item.y"
                   :w="item.w"
                   :h="item.h"
                   :i="item.i">
            <span class="text">
              <template v-for = "room in floor.rooms">
                <p v-if="room.tagId === item.i">{{ room.name }}</p>
              </template>
            </span>
        </grid-item>
    </grid-layout>
    </div>
    </template>

  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import {mapState, mapActions} from 'eva.js'
import {GridLayout, GridItem} from 'vue-grid-layout/dist/vue-grid-layout.js'

export default {
  data () {
    return {
      canvas: null,
      floorNameInput: '',
      addFloorOpened: false,
      roomNameInput: '',
      addRoomOpened: false,
      mapFloorId: null,
      floorId: null,
      windowWidth: window.innerWidth,
      layout: [
        {"x":0,"y":0,"w":2,"h":2,"i":"0"},
        {"x":0,"y":0,"w":2,"h":2,"i":"0a"},
        {"x":2,"y":0,"w":2,"h":4,"i":"1"},
        {"x":4,"y":0,"w":2,"h":5,"i":"2"},
        {"x":6,"y":0,"w":2,"h":3,"i":"3"},
        {"x":8,"y":0,"w":2,"h":3,"i":"4"},
        {"x":10,"y":0,"w":2,"h":3,"i":"5"},
        {"x":0,"y":5,"w":2,"h":5,"i":"6"},
        {"x":2,"y":5,"w":2,"h":5,"i":"7"},
        {"x":4,"y":5,"w":2,"h":5,"i":"8"},
        {"x":6,"y":4,"w":2,"h":4,"i":"9"},
        {"x":8,"y":4,"w":2,"h":4,"i":"10"},
        {"x":10,"y":4,"w":2,"h":4,"i":"11"},
        {"x":0,"y":10,"w":2,"h":5,"i":"12"},
        {"x":2,"y":10,"w":2,"h":5,"i":"13"},
        {"x":4,"y":8,"w":2,"h":4,"i":"14"},
        {"x":6,"y":8,"w":2,"h":4,"i":"15"},
        {"x":8,"y":10,"w":2,"h":5,"i":"16"},
        {"x":10,"y":4,"w":2,"h":2,"i":"17"},
        {"x":0,"y":9,"w":2,"h":3,"i":"18"},
        {"x":2,"y":6,"w":2,"h":2,"i":"19"}
    ]
    }
  },
  components: {
    GridLayout,
    GridItem
  },
  watch: {
    layout: {
      handler: debounce(function (val, oldVal) {
        console.log(val)
      }, 200),
      deep: true
    }
  },
  computed: {
    ...mapState(['infrastructure'])
  },
  methods: {
    updateMap() {

    },
    addFloor () {
      this.addFloorAction({ name: this.floorNameInput })
      this.addFloorOpened = false
    },
    addRoom () {
      this.addRoomOpened = false
      this.addRoomAction({ name: this.roomNameInput, floor_id: this.floorId })
    },
    openaddRoomModal (id) {
      this.addRoomOpened = true
      this.floorId = id
    },
    async deleteFloor (floorId) {
      await this.deleteFloorAction({ floorId })
    },
    ...mapActions({ addFloorAction: 'addFloor', addRoomAction: 'addRoom', deleteFloorAction: 'deleteFloor' })
  }
}
</script>

<style lang="sass" scoped>
  .clickable
    cursor: pointer

  .vue-grid-layout 
    background: #eee

  .columns 
    -moz-columns: 120px
    -webkit-columns: 120px
    columns: 120px

  .vue-grid-item
    background: #fff
    border: 1px solid black

  .vue-grid-item.resizing 
    opacity: 0.9

  .vue-grid-item.static 
    background: #cce

  .vue-grid-item .text 
    font-size: 24px
    text-align: center
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    margin: auto
    height: 24px

  .vue-grid-item .minMax 
    font-size: 12px

</style>

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

    <nav class="nav has-shadow">
  <div class="container">
    <div class="nav-left">
      <a class="nav-item">

      </a>
       <template v-for="floor in infrastructure.house.floors">
      <a @click= "updateRoomLayout(floor.id)" :class="(mapFloorId === floor.id) ? 'nav-item is-tab is-hidden-mobile is-active' : 'nav-item is-tab is-hidden-mobile'">{{ floor.name }}</a>
       <button @click="deleteFloor(floor.id)" class="delete"></button>
       </template>
    </div>
     <a @click= "addFloorOpened = true">Ajouter un étage</a>
     <div v-if="mapFloorId">
     <a @click="openaddRoomModal(mapFloorId)" class= "bouton">Ajouter une salle</a>
     </div>
    </nav>

    <grid-layout v-if="mapFloorId"
            :layout="layout"
            :col-num="12"
            :row-height="30"
            :is-draggable="true"
            :is-resizable="true"
            :vertical-compact="true"
            :margin="[10, 10]"
            :use-css-transforms="true"
    >

        <grid-item v-for="item in layout"
                   :x="item.x"
                   :y="item.y"
                   :w="item.w"
                   :h="item.h"
                   :i="item.i"
     :class="{ 'is-active': route.path === '/peripheriques' }"><router-link :to="`/peripheriques?tag=${item.i}`" exact> <i class="fa fa-eye"></i></router-link>
        
                   

                <span class="text">
                <p>{{ getRoomFromTagId(item.i).name }}</p>
                </span>
                <button @click="deleteRoom(getRoomFromTagId(item.i).id)" class="is-info delete "></button>

        </grid-item>
    </grid-layout>

  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import {mapState, mapActions} from 'eva.js'
import {GridLayout, GridItem} from 'vue-grid-layout/dist/vue-grid-layout.min.js'

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
      windowWidth: window.innerWidth
    }
  },
  components: {
    GridLayout,
    GridItem
  },
  watch: {
    layout: {
      handler: debounce(function (val, oldVal) {
        this.updateMap()
      }, 200),
      deep: true
    }
  },
  computed: {
    layout () {
      return this.mapFloorId ? this.infrastructure.house.floors[this.mapFloorId].roomsMap : []
    },
    ...mapState(['infrastructure', 'route'])
  },
  methods: {
    updateMap () {
      if (!this.mapFloorId) return
      this.updateMapAction({ floorId: this.mapFloorId, map: this.layout })
    },
    updateRoomLayout (floorId) {
      this.mapFloorId = floorId
    },
    addFloor () {
      this.addFloorAction({ name: this.floorNameInput })
      this.addFloorOpened = false
    },
    addRoom () {
      this.addRoomOpened = false
      this.addRoomAction({ name: this.roomNameInput, floor_id: this.floorId })
    },
    async deleteRoom (roomId) {
      await this.deleteRoomAction({ floorId: this.mapFloorId, roomId })
    },
    getRoomFromTagId (tagId) {
      const room = Object.values(this.infrastructure.house.floors[this.mapFloorId].rooms).find(el => el.tagId === tagId)

      if (room) return room
      else return { name: '', id: '' }
    },
    openaddRoomModal (id) {
      this.addRoomOpened = true
      this.floorId = id
    },
    async deleteFloor (floorId) {
      this.mapFloorId = null
      await this.deleteFloorAction({ floorId })
    },
    ...mapActions({ updateMapAction: 'updateMap', addFloorAction: 'addFloor', addRoomAction: 'addRoom', deleteFloorAction: 'deleteFloor', deleteRoomAction: 'deleteRoom' })
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
    background: #e74c3c
    border: 1px solid black

  .vue-grid-item.resizing
    opacity: 0.9

  .vue-grid-item.static
    background: #cce

  .bouton
    margin-left: 2cm
    color: blue

  .vue-grid-item .text
    font-size: 24px
    text-align: center
    position: absolute
    color: white
    top: 0
    bottom: 0
    left: 0
    right: 0
    margin: auto
    height: 24px

  .vue-grid-item .minMax
    font-size: 12px

</style>

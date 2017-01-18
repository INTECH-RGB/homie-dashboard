<template>
  <div>
    <help :visible="help" @close="help = false"></help>

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

    <h1 class="title">
      Vue d'ensemble
      <a href="#" @click.prevent="help = true" data-balloon="Aide" data-balloon-pos="up">
        <span class="icon is-medium">
          <i class="fa fa-question-circle-o"></i>
        </span>
      </a>
    </h1>
    <h2 class="subtitle">
      Ici, vous pouvez modéliser votre maison sous forme d'étages et de pièces.
    </h2>
    <div v-if="Object.values(this.infrastructure.house.floors).length === 0">
    Vous n'avez pas encore d'étage, pour en créer un, cliquez sur "ajouter un étage" à droite.
    </div>
    <div v-else>
      Vous disposez de {{ Object.values(this.infrastructure.house.floors).length }} étage{{ Object.values(this.infrastructure.house.floors).length > 1 ? 's' : '' }} et de {{ pieces }} pièce{{ pieces > 1 ? 's' : '' }}.
    </div>
    </br>

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
     :class="{ 'is-active': route.path === '/peripheriques' }">


                <button @click="deleteRoom(getRoomFromTagId(item.i).id)" class="is-info delete "></button>
                <span class="text">
                <p>{{ getRoomFromTagId(item.i).name }}</p>
               <router-link :to="`/peripheriques?tag=${item.i}`" exact> <p><i class="fa fa-cog"> {{ getPeripheriqueNumber(item.i) }}  </i></p></router-link>
                </span>


        </grid-item>
    </grid-layout>

  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import {mapState, mapActions} from 'eva.js'
import {GridLayout, GridItem} from 'vue-grid-layout/dist/vue-grid-layout.min.js'

import Help from '../help/Overview'

export default {
  data () {
    return {
      help: false,
      canvas: null,
      floorNameInput: '',
      addFloorOpened: false,
      roomNameInput: '',
      addRoomOpened: false,
      mapFloorId: null,
      floorId: null,
      floorsNumber: null,
      windowWidth: window.innerWidth
    }
  },
  components: {
    Help,
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
    pieces: function () {
      let roomsNumber = 0
      for (let floor of Object.values(this.infrastructure.house.floors)) {
        let rooms = Object.values(floor.rooms)
        roomsNumber += rooms.length
      }
      return roomsNumber
    },
    ...mapState(['infrastructure', 'route'])
  },
  methods: {
    updateMap () {
      if (!this.mapFloorId) return
      for (let i = 0; i < this.layout.length; i++) {
        if (this.layout[i].h < 3) this.layout[i].h = 3
        if (this.layout[i].w < 2) this.layout[i].w = 2
      }
      this.updateMapAction({ floorId: this.mapFloorId, map: this.layout })
    },
    updateRoomLayout (floorId) {
      this.mapFloorId = floorId
    },
    getPeripheriqueNumber (roomId) {
      let compt = 0
      for (let device of Object.values(this.infrastructure.devices)) {
        console.log(device)
        for (let node of Object.values(device.nodes)) {
          if (node.tags.includes(roomId)) {
            compt++
          }
        }
      }
      return compt
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

  .fa
    color: white

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

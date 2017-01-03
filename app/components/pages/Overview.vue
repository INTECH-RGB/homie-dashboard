<template>
  <div>
    <grid-layout :layout="layout"
               :col-num="12"
               :row-height="30"
               :is-draggable="true"
               :is-resizable="true"
               :vertical-compact="true"
               :use-css-transforms="true"
    >
      <grid-item v-for="item in layout"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
              >
          <span class="text">{{item.i}}</span>
      </grid-item>
    </grid-layout>
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
      <div class="notification is-primary clickable">
        <button @click="deleteFloor(floor.id); canvas.reset()" class="delete"></button>
        <p class="title">
          <span class="icon"><i class="fa fa-eye"></i></span>
          {{ floor.name }}
        </p>
      </div>

      <div @click="openaddRoomModal(floor.id); canvas.reset()" class="notification is-info clickable">
        <p class="title">
          <span class="icon"><i class="fa fa-plus"></i></span>
          Ajouter une salle
        </p>
      </div>
    </template>
    <canvas id="canvas" :width="windowWidth" height="800"></canvas>

  </div>
</template>

<script>
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
      floorId: null,
      windowWidth: window.innerWidth,
      layout: [{ x: 0, y: 0, w: 2, h: 2, i: '0' }]
    }
  },
  components: {
    GridLayout,
    GridItem
  },
  computed: {
    ...mapState(['infrastructure'])
  },
  methods: {
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
</style>

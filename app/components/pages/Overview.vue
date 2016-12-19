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

    <div class="tile is-ancestor">
      <div class="tile is-parent is-12 is-vertical">
        <div v-for="floor in infrastructure.house.floors" class="tile is-child notification is-primary clickable">
          <div class="content">
            <p class="title">{{ floor.name }}</p>
             <div @click="openaddRoomModal(floor.id)" class="tile is-child notification is-primary clickable">
          <div class="content">
            <p class="title">
              <span class="icon"><i class="fa fa-plus"></i></span>
              Ajouter une salle
            </p>
          </div>
        </div>
          </div>
        </div>

        <div @click="addFloorOpened = true" class="tile is-child notification is-primary clickable">
          <div class="content">
            <p class="title">
              <span class="icon"><i class="fa fa-plus"></i></span>
              Ajouter un étage
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'eva.js'
import uuid from 'uuid'

export default {
  data () {
    return {
      floorNameInput: '',
      addFloorOpened: false,
      roomNameInput: '',
      addRoomOpened: false,
      floorId: null
    }
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
      let tag = "room:" + uuid()
      this.createTag(tag)
      this.addRoomOpened = false
      this.addRoomAction({ name: this.roomNameInput, floor_id: this.floorId, tag_id: tag })
      
      
    },
    openaddRoomModal(id) {
      this.addRoomOpened = true
      this.floorId = id

    },
    async createTag (tagId) {
      await this.createTagAction({ id: tagId })
    },
    ...mapActions({ createTagAction: 'createTag', addFloorAction: 'addFloor', addRoomAction: 'addRoom' })
  }
}
</script>

<style lang="sass" scoped>
  .clickable
    cursor: pointer
</style>

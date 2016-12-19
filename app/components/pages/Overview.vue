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

    <h1 class="title">Vue d'ensemble</h1>
    <h2 class="subtitle">
      Ici, vous pouvez modéliser votre maison sous forme d'étages et de pièces.
    </h2>

    <div class="tile is-ancestor">
      <div class="tile is-parent is-12 is-vertical">
        <div v-for="floor in infrastructure.house.floors" class="tile is-child notification is-primary clickable">
          <div class="content">
            <p class="title">{{ floor.name }}</p>
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

export default {
  data () {
    return {
      floorNameInput: '',
      addFloorOpened: false
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
    ...mapActions({ addFloorAction: 'addFloor' })
  }
}
</script>

<style lang="sass" scoped>
  .clickable
    cursor: pointer
</style>

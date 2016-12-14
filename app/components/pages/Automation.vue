<template>
  <div>
    <h1 class="title">Automatisation</h1>
    <h2 class="subtitle">
      Automatisez votre maison.
    </h2>

    <nav class="level">
      <div class="level-item has-text-centered">
        <h3 class="title is-3">Quand</h3>
      </div>

      <div class="level-item has-text-centered">
        <p class="control">
          <span class="select">
            <select>
              <option>Sélectionnez une propriété...</option>
              <template v-for="device in infrastructure.devices">
                <optgroup v-for="node in device.nodes" :label="`${device.id} - ${node.id}`">
                  <option v-for="property in node.properties" :value="property.id">{{ property.id }}</option>
                </optgroup>
              </template>
            </select>
          </span>
        </p>
      </div>

      <div class="level-item has-text-centered">
        <p class="control">
          <span class="select">
            <select>
              <option>Sélectionnez une condition...</option>
              <optgroup label="Comparaison">
                <option value="">est égal à</option>
                <option value="">est différent de</option>
                <option value="">est supérieur à</option>
                <option value="">est inférieur à</option>
              </optgroup>
            </select>
          </span>
        </p>
      </div>

      <div class="level-item has-text-centered">
        <p class="control">
          <input class="input" type="text" placeholder="Text input">
        </p>
      </div>

      <div class="level-item has-text-centered">
        <h3 class="title is-3">alors</h3>
      </div>

      <div class="level-item has-text-centered">
        <p class="control">
          <span class="select">
            <select>
              <option>Sélectionnez une propriété...</option>
              <template v-for="device in infrastructure.devices">
                <optgroup v-for="node in device.nodes" :label="`${device.id} - ${node.id}`">
                  <option v-for="property in node.properties" :value="property.id">{{ property.id }}</option>
                </optgroup>
              </template>
            </select>
          </span>
        </p>
      </div>

      <div class="level-item has-text-centered">
        <h3 class="title is-3">=</h3>
      </div>

      <div class="level-item has-text-centered">
        <input class="input" type="text" placeholder="Text input">
      </div>
    </nav>
  </div>
</template>

<script>
import {mapState, mapActions} from 'eva.js'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState(['infrastructure'])
  },
  methods: {
    ...mapActions({ deleteTagAction: 'deleteTag' })
  }
}
</script>

<style lang="sass">
</style>

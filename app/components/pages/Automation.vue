<template>
  <div>
    <h1 class="title">Automatisation</h1>
    <h2 class="subtitle">
      Automatisez votre maison.
    </h2>

    <div class="content">
      <p>
        Dans Homie Dashboard, l'automatisation fonctionne avec un système de règles simple,
        basé sur des règles <strong>Si ceci alors cela</strong>.
      </p>

      <p>
        Par exemple, vous pourrez définir des règles de la sorte:

        <blockquote>
          Si l'état "motion" du nœud "motionnode" de l'objet "motiondevice" est "mouvement détecté"<br>
          Alors mettre l'état "on" du nœud "lightnode" de l'objet "lightdevice" sur "allumé"
        </blockquote>
      </p>
    </div>

    <h3 class="title is-3">Ajouter une règle</h3>

    <nav class="level">
      <div class="level-item has-text-centered">
        <h4 class="title is-4">Quand</h3>
      </div>

      <div class="level-item has-text-centered">
        <p class="control">
          <span class="select">
            <select v-model="iProperty">
              <option disabled :value="null">Sélectionnez une propriété...</option>
              <template v-for="device in infrastructure.devices">
                <optgroup v-for="node in device.nodes" :label="`${device.id} - ${node.id}`">
                  <option v-for="property in node.properties" :value="{ deviceId: device.id, nodeId: node.id, propertyId: property.id, nodeType: node.type}">{{ property.id }}</option>
                </optgroup>
              </template>
            </select>
          </span>
        </p>
      </div>

      <div class="level-item has-text-centered" v-if="iProperty">
        <p class="control">
          <span class="select">
            <select v-model="condition">
              <option disabled :value="null">Sélectionnez une condition...</option>
              <option v-for="condition in NODE_TYPES[iProperty.nodeType][iProperty.propertyId].conditions" :value="condition">
                <template v-if="condition === CONDITIONS.IS_ON">est allumé(e)</template>
                <template v-else-if="condition === CONDITIONS.IS_OFF">est éteint(e)</template>
                <template v-else-if="condition === CONDITIONS.IS_OPEN">est ouvert(e)</template>
                <template v-else-if="condition === CONDITIONS.IS_CLOSE">est fermé(e)</template>
                <template v-else-if="condition === CONDITIONS.IS_MOTION">détecte du mouvement</template>
                <template v-else-if="condition === CONDITIONS.IS_NOT_MOTION">ne détecte pas de mouvement</template>
                <template v-else-if="condition === CONDITIONS.EQUALS">est égal à</template>
                <template v-else-if="condition === CONDITIONS.ABOVE">est supérieur à</template>
                <template v-else-if="condition === CONDITIONS.UNDER">est inférieur à</template>
              </option>
            </select>
          </span>
        </p>
      </div>

      <div class="level-item has-text-centered" v-if="condition && condition.hasField">
        <p class="control">
          <input class="input" type="text" placeholder="Valeur" v-model="compared">
        </p>
      </div>

      <template v-if="condition && ((condition.hasField && compared !== '') || (!condition.hasField))">
        <div class="level-item has-text-centered">
          <h4 class="title is-4">alors</h3>
        </div>

        <div class="level-item has-text-centered">
          <p class="control">
            <span class="select">
              <select v-model="oProperty">
                <option disabled :value="null">Sélectionnez une propriété...</option>
                <template v-for="device in infrastructure.devices">
                  <optgroup v-for="node in device.nodes" :label="`${device.id} - ${node.id}`">
                    <option v-if="property.settable" v-for="property in node.properties" :value="{ deviceId: device.id, nodeId: node.id, propertyId: property.id, nodeType: node.type }">{{ property.id }}</option>
                  </optgroup>
                </template>
              </select>
            </span>
          </p>
        </div>

        <div class="level-item has-text-centered" v-if="oProperty">
          <p class="control">
            <span class="select">
              <select v-model="mutation">
                <option disabled :value="null">Sélectionnez un état...</option>
                <option v-for="mutation in NODE_TYPES[oProperty.nodeType][oProperty.propertyId].mutations" :value="mutation">
                  <template v-if="mutation === MUTATIONS.SET_ON">allumé(e)</template>
                  <template v-else-if="mutation === MUTATIONS.SET_OFF">éteint(e)</template>
                  <template v-else-if="mutation === MUTATIONS.SET_OPEN">ouvert(e)</template>
                  <template v-else-if="mutation === MUTATIONS.SET_CLOSE">fermé(e)</template>
                  <template v-else-if="mutation === MUTATIONS.SET_COLOR">couleur à</template>
                  <template v-else-if="mutation === MUTATIONS.SET_PERCENTAGE">pourcentage à</template>
                  <template v-else-if="mutation === MUTATIONS.SET_FLOAT">valeur à</template>
                </option>
              </select>
            </span>
          </p>
        </div>

        <div class="level-item has-text-centered" v-if="mutation && mutation.hasField">
          <input v-model="value" class="input" type="text" placeholder="Valeur">
        </div>

        <div class="level-item has-text-centered">
          <button class="button is-primary" @click.prevent="addIfttt" :disabled="!formIsValid">Ajouter</button>
        </div>
      </template>
    </nav>

    <h3 class="title is-3">Liste des règles</h3>
  </div>
</template>

<script>
import {mapState, mapActions} from 'eva.js'
import {CONDITIONS, MUTATIONS, NODE_TYPES} from '../../../common/node-types'

export default {
  data () {
    return {
      CONDITIONS,
      MUTATIONS,
      NODE_TYPES,
      iProperty: null,
      condition: null,
      compared: null,
      oProperty: null,
      mutation: null,
      value: null
    }
  },
  computed: {
    formIsValid () {
      return (
        this.iProperty &&
        this.condition &&
        (this.condition && ((this.condition.hasField && this.compared !== '') || (!this.condition.hasField))) &&
        this.oProperty &&
        this.oValue !== ''
      )
    },
    ...mapState(['infrastructure'])
  },
  methods: {
    async addIfttt () {
      const iProperty = {
        id: this.iProperty.propertyId,
        nodeId: this.iProperty.nodeId,
        deviceId: this.iProperty.deviceId
      }

      const condition = {
        id: this.condition.id,
        parameter: this.compared
      }

      const oProperty = {
        id: this.oProperty.propertyId,
        nodeId: this.oProperty.nodeId,
        deviceId: this.oProperty.deviceId
      }

      const mutation = {
        id: this.mutation.id,
        parameter: this.value
      }

      await this.addIftttAction({
        iProperty,
        condition,
        oProperty,
        mutation
      })

      this.iProperty = null
      this.condition = null
      this.compared = null
      this.oProperty = null
      this.mutation = null
      this.value = null
    },
    ...mapActions({ addIftttAction: 'addIfttt' })
  }
}
</script>

<style lang="sass">
</style>

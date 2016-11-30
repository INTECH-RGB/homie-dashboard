<template>
  <card-device>
    <div slot="img">
      <img v-if="state.open && state.open.value === '1'" src="../../assets/images/icons/door/door-open.png" alt="" >
      <img v-else-if="state.open && state.open.value === '0'" src="../../assets/images/icons/door/door-close.png" alt="" >
      <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
    </div>
    <div slot="main">
      <div class="has-text-centered">
        <p class="title">
          <template v-if="state.open">
            {{ state.open.value === '1' ? 'Ouverte' : 'Fermée' }}
          </template>
          <template v-else>
            ?
          </template>
        </p>
      </div>
    </div>
  </card-device>
</template>

<script>
import CardDevice from './Card'

export default {
  props: ['state', 'deviceId', 'nodeId'],

  components: {CardDevice}
}
</script>

<style lang="sass">

</style>

<template>
  <node :nodeData="nodeData">
    <template slot="statistics">
      <statistics :deviceId="nodeData.device.id" :nodeId="nodeData.id" :properties="[{ id: 'degrees', name: 'Degrés', graph: true }]"></statistics>
    </template>
    <div slot="img">
      <img src="../../assets/images/icons/temperature/thermometer.png" alt="" >
      <!--<canvas ref="canvas"></canvas>-->
    </div>
    <div slot="main">
      <div class="has-text-centered">
        <p class="title">
          <template v-if="this.nodeData.properties.degrees">
            {{ this.nodeData.properties.degrees.value }} °C
          </template>
          <template v-else>
            ?
          </template>
        </p>
      </div>
    </div>
  </node>
</template>

<script>
import {Component as Node, mixin as nodeMixin} from './Node.js'
import Statistics from './Statistics'

export default {
  mixins: [nodeMixin],

  components: {Node, Statistics}
}
</script>

<style lang="sass">

</style>

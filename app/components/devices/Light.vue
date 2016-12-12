<template>
  <node :hasActions="true" :nodeData="nodeData">
    
    <template slot="img">
      <div class="has-text-centered">
        <i v-if="nodeData.properties.intensity" class="fa fa-lightbulb-o " aria-hidden="true" :style="imgDataStyle"></i>
        <img v-else src="../../assets/images/icons/common/unknown.png" alt="" >
      </div>
    </template>
    <template slot="main">
      <div class="has-text-centered">
      <div id="overlay" style="">
        <chrome-picker :class="overlay" v-model="colors" @change-color="onChange" style="witdh:60px;height:60px"></chrome-picker>
      </div>

      <p class="title">
          <template v-if="nodeData.properties.intensity">
                {{ nodeData.properties.intensity.value }} %
          </template>
          <template v-else>
                ?
          </template>
        </p>
      </div>
    </template>
    <template slot="footer">
      <a href="" class="card-footer-item" @click.prevent="showOverlay()"> Change Color </a> 
    </template>
  </node>
  
</template>

<script>
import {Chrome} from 'vue-color'
import {Component as Node, mixin as nodeMixin} from './Node.js'
import {mapActions} from 'eva.js'

export default {
  mixins: [nodeMixin],
  data () {
    return {
      colors: {
        hex: '#194d33',
        hsl: {
          h: 150,
          s: 0.5,
          l: 0.2,
          a: 1
        },
        hsv: {
          h: 150,
          s: 0.66,
          v: 0.30,
          a: 1
        },
        rgba: {
          r: 25,
          g: 77,
          b: 51,
          a: 1
        },
        a: 1
      },
      overlay: "is-hidden"
    } 
  },
  computed: {
    
    imgDataStyle(){
      if(this.nodeData.properties.intensity && parseInt(this.nodeData.properties.intensity.value) <= 1)
      {
        return {
                fontSize: '1725%',
                opacity: 10 / 100,
                color: 'rgb(0,0,0)'
        }
      }
      else
      {
        return {
                fontSize: '1725%',
                opacity: this.nodeData.properties.intensity.value / 100,
                color: this.nodeData.properties.color ? `rgb(${parseInt(this.nodeData.properties.color.value.split(',')[0])},${parseInt(this.nodeData.properties.color.value.split(',')[1])},${parseInt(this.nodeData.properties.color.value.split(',')[2])}` : 'rgb(0,0,0)'
         }
      }
    },
    styleRedBackground () {
      return {
        backgroundColor: '#e74c3c',
        color: 'black'
      }
    }
  },
  components: {Node, 'chrome-picker': Chrome},
  methods: {
    setIntensity (rangeValue) {
      this.setState({
        deviceId: this.nodeData.device.id,
        nodeId: this.nodeData.id,
        property: 'intensity',
        value: rangeValue.toString()
      })
    },
    ...mapActions(['setState']),
    changeColor (rgb) {
      this.setState({
        deviceId: this.nodeData.device.id,
        nodeId: this.nodeData.id,
        property: 'color',
        value: rgb
      })
    },
    ...mapActions(['setState']),
    onChange(rgb)
    {
      this.changeColor(rgb.rgba.r+','+rgb.rgba.g+','+rgb.rgba.b)
      this.setIntensity(Math.round(rgb.rgba.a * 100))
    },
    showOverlay()
    {
      if(this.overlay === "is-hidden") this.overlay = "is-overlay"
      else this.overlay = "is-hidden"
    }

  }
}

</script>

<style lang="sass">

</style>

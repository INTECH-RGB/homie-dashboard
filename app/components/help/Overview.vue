<template>
  <help :visible="visible" @close="$emit('close')">Vue d'ensemble</help>
</template>

<script>
import Help from './Help'

export default {
  props: ['visible'],
  components: { Help }
}
</script>

<style lang="sass" scoped>
</style>

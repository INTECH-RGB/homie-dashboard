<template>
  <div>
    <help :visible="help" @close="help = false"></help>

    <h1 class="title">
      Automatisation
      <a href="#" @click.prevent="help = true" data-balloon="Aide" data-balloon-pos="up">
        <span class="icon is-medium">
          <i class="fa fa-question-circle-o"></i>
        </span>
      </a>
    </h1>
    <h2 class="subtitle">
      Ici, vous pouvez automatiser les comportements de vos périphériques.
    </h2>
  </div>
</template>

<script>
import Help from '../help/Automation'

export default {
  data () {
    return {
      help: false
    }
  },
  components: {
    Help
  }
}
</script>

<style lang="sass" scoped>
</style>

<template>
  <div>
    <help :visible="help" @close="help = false"></help>

    <h1 class="title">
      Paramètres
      <a href="#" @click.prevent="help = true" data-balloon="Aide" data-balloon-pos="up">
        <span class="icon is-medium">
          <i class="fa fa-question-circle-o"></i>
        </span>
      </a>
    </h1>
    <h2 class="subtitle">
      Ici, vous pouvez paramétrer votre Homie Dashboard.
    </h2>

    <div class="content">
      <h3>Mot de passe</h3>
      <p v-if="!modifyingPassword">•••••••• <a href="#" @click.prevent="modifyingPassword = true">Modifier</a></p>
      <p v-else class="control has-addons">
        <input class="input" type="password" v-model="password" placeholder="Nouveau mot de passe">
        <a class="button is-primary" @click.prevent="updatePassword">
          Enregistrer
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'eva.js'

import Help from '../help/Settings'

export default {
  data () {
    return {
      help: false,
      modifyingPassword: false,
      password: ''
    }
  },
  computed: {
    ...mapState(['infrastructure'])
  },
  methods: {
    async updatePassword () {
      await this.updatePasswordAction({
        password: this.password
      })

      this.password = ''
      this.modifyingPassword = false
    },
    ...mapActions({ updatePasswordAction: 'updatePassword' })
  },
  components: { Help }
}
</script>

<style lang="sass" scoped>
</style>

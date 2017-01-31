<template>
  <section class="hero is-primary is-bold is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <figure class="image is-64x64">
          <img src="../../assets/images/logo_white.png" alt="Logo">
        </figure>
        <h1 class="title">
          Authentifiez-vous.
        </h1>
        <div class="columns">
          <div class="box column is-half is-offset-one-quarter">
            <p class="control has-icon">
              <input v-model="password" @keyup.enter="send" :class="{input: true, 'is-medium': true, 'is-danger': isWrongPassword}" type="password" placeholder="Mot de passe">
              <span class="icon">
                <i class="fa fa-lock"></i>
              </span>
            </p>
            <p class="control has-icon">
              <input v-model="otp" @keyup.enter="send" :class="{input: true, 'is-medium': true, 'is-danger': isWrongPassword}" type="text" placeholder="Code de sécurité">
              <span class="icon">
                <i class="fa fa-shield"></i>
              </span>
              <span v-if="isWrongPassword" class="help is-danger">Les mots de passe sont invalides.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {mapActions} from 'eva.js'

export default {
  data () {
    return {
      password: '',
      otp: '',
      isWrongPassword: false
    }
  },
  methods: {
    async send () {
      const success = await this.login({
        password: this.password,
        otp: this.otp
      }) // redirected if success
      if (!success) this.isWrongPassword = true
    },
    ...mapActions(['login'])
  }
}
</script>

<style lang="sass" scoped>
  .image
    margin: auto
    margin-bottom: 10px
</style>

<template>
  <section class="hero is-primary is-bold">
    <div class="hero-head">
      <header class="nav">
        <div class="container">
          <div class="nav-left">
            <a class="nav-item is-brand">
              <figure class="image is-24x24">
                <img src="../../assets/images/logo_white.png" alt="Logo">
              </figure>
            </a>
          </div>
        </div>
      </header>
    </div>

    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          Homie Dashboard
        </h1>
        <h2 class="subtitle">
          Contrôlez votre maison.
        </h2>
      </div>
    </div>

    <div class="hero-foot">
      <nav class="tabs is-boxed">
        <div class="container">
          <ul>
            <li :class="{ 'is-active': route.path === '/' }"><router-link to="/" exact>Vue d'ensemble</router-link></li>
            <li :class="{ 'is-active': route.path === '/peripheriques' }"><router-link to="/peripheriques" exact>Périphériques</router-link></li>
          </ul>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
import {mapState} from 'eva.js'

export default {
  computed: {
    ...mapState(['route'])
  }
}
</script>

<style lang="sass">
</style>

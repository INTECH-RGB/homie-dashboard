<template>
  <div class="modal" :class="{ 'is-active': visible }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Aide</p>
        <button @click.prevent="$emit('close')" class="delete"></button>
      </header>
      <section class="modal-card-body">
        <div class="content">
          <slot></slot>
        </div>
      </section>
      <footer class="modal-card-foot">
        <a @click="$emit('close')" class="button is-primary">Fermer</a>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: ['visible']
}
</script>

<style lang="sass" scoped>
</style>

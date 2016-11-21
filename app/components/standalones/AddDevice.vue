<template>
  <section class="hero is-primary is-bold is-fullheight">
    <template v-if="step === 'WAITING_FOR_DEVICE'">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            Connectez-vous au réseau Wi-Fi de votre périphérique.
          </h1>
          <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i><br><br>
          <h2 class="subtitle">
            Si votre périphérique est <strong>Homie-123456abcdef</strong>, le mot de passe est <strong>123456abcdef</strong>.
          </h2>
        </div>
      </div>
    </template>

    <template v-if="step === 'ADD_DEVICE_CONFIRMATION'">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            Homie-{{ deviceInfo['hardware_device_id'] }}
          </h1>
          <h2 class="subtitle">
            Souhaitez-vous ajouter ce périphérique ?
          </h2>
          <a :class="{button: true, 'is-success': true, 'is-loading': putRequestOngoing}" @click.prevent="sendConfiguration">Oui</a>
          <a v-if="!putRequestOngoing" class="button is-black" @click.prevent="step = 'ABORTED'">Non</a>
        </div>
      </div>
    </template>

    <template v-if="step === 'SEND_CONFIG_RESULT'">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            {{ putConfigResult.success ? 'Succès' : 'Échec' }}.
          </h1>
          <div v-if="putConfigResult.success === true" class="notification is-success">
            Votre périphérique va s'afficher dans votre Dashboard d'ici quelques secondes. Vous pouvez fermer cette page.
          </div>
          <div v-else class="notification is-danger">
            Une erreur est survenue. Merci de réessayer. Erreur : {{ putConfigResult.error }}
          </div>
          <a class="button is-black" @click.prevent="close">Fermer</a>
        </div>
      </div>
    </template>

    <template v-if="step === 'ABORTED'">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            Ajout de périphérique annulé.
          </h1>
          <h2 class="subtitle">
            Déconnectez-vous du réseau Wi-Fi <strong>Homie-{{ deviceInfo['hardware_device_id'] }}</strong>, reconnectez-vous à votre réseau habituel puis fermez cette page.
          </h2>
          <a class="button is-black" @click.prevent="close">Fermer</a>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
import axios from 'axios'

import constants from '../../constants'

const STEPS = {
  WAITING_FOR_DEVICE: 'WAITING_FOR_DEVICE',
  ADD_DEVICE_CONFIRMATION: 'ADD_DEVICE_CONFIRMATION',
  SEND_CONFIG_RESULT: 'SEND_CONFIG_RESULT',
  ABORTED: 'ABORTED'
}

export default {
  data () {
    return {
      step: STEPS.WAITING_FOR_DEVICE,
      deviceInfo: {},
      deviceInfoRequestOngoing: false,
      interval: null,
      putConfigResult: {},
      putRequestOngoing: false
    }
  },
  mounted () {
    this.interval = setInterval(this.checkHeartbeat, 2000)
  },
  methods: {
    checkHeartbeat () {
      if (this.deviceInfoRequestOngoing) return

      this.deviceInfoRequestOngoing = true
      axios.get(`${constants.HOMIE_ESP8266_AP_SERVER_URL}/device-info`).then((res) => {
        clearInterval(this.interval)
        this.deviceInfo = res.data
        console.log(this.deviceInfo)
        this.step = STEPS.ADD_DEVICE_CONFIRMATION
      }).catch((err) => {
        console.log(err)
        this.deviceInfoRequestOngoing = false
      })
    },
    sendConfiguration () {
      if (this.putRequestOngoing) return

      this.putRequestOngoing = true
      axios.put(`${constants.HOMIE_ESP8266_AP_SERVER_URL}/config`, {
        name: 'Dashboard test device',
        wifi: {
          ssid: 'SSID',
          password: 'password'
        },
        mqtt: {
          host: 'host'
        },
        ota: {
          enabled: true
        }
      }).then((res) => {
        this.putConfigResult = res.data
        this.step = STEPS.SEND_CONFIG_RESULT
      }).catch((err) => {
        if (err.response) this.putConfigResult = err.response.data
        else this.putConfigResult = { error: err.message }
        this.step = STEPS.SEND_CONFIG_RESULT
      })
    },
    close () {
      window.close()
    }
  }
}
</script>

<style lang="sass">
</style>

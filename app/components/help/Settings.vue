<template>
  <help :visible="visible" @close="$emit('close')">
   <h3>Comment changer mon mot de passe ?</h3>
   <p> Pour cela, il vous suffit de cliquer sur "modifier" situé à droite de votre mot de passe actuel.
     Il ne vous reste plus qu'à entrer le nouveau mot de passe et d'appuyer sur "enregistrer"</p>

     <h3>A quoi sert le QR code ? </h3>
     <p>Il va vous permettre d'obtenir le deuxième mot de passe nécessaire à votre connexion. Pour l'utiliser,
       il faut télécharger l'application "Google Authenticator" sur votre téléphone puis scanner  le QR code.
       Ainsi vous pourrez voir le second mot de passe qui change toutes les 30 secondes présent pour plus de sécurité.</p>

    </help>
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

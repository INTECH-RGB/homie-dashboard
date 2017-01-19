<template>
  <help :visible="visible" @close="$emit('close')">
   <h4> Comment automatiser un périphérique ?</h4>
<p>Pour créer une automatisation :
  <ul>
  <li>commencez par prendre un bloc « si-faire » et placez-le sur la droite.</li>
	<li>Prenez un bloc « condition » et placez le dans le bloc « si », choisissez ensuite le périphérique qui va définir la condition depuis la liste déroulante, définissez aussi la condition en elle-même (est égal, est supérieur etc…) et entrez la valeur voulue.</li>
	<li>Prenez un bloc « action » et placez le dans le bloc « faire », choisissez ensuite le périphérique qui va changer lorsque la condition sera validée depuis la liste déroulante, définissez ce qui va changer sur ce périphérique puis entrez la valeur voulue.</li>
	<li>Il ne vous reste plus qu’à appuyer sur le bouton « enregistrer » pour sauvegarder votre automatisation</li>
  </ul>
  </p>
<p>Note : Vous pouvez insérer un bloc « et » dans le bloc « si » pour pouvoir définir deux conditions.</p>
<h4>Comment supprimer une automatisation ?</h4>
<p>Il suffit de déplacer vos blocs sur la partie gauche de l’écran pour qu’ils disparaissent puis appuyer sur le bouton « enregistrer » pour sauvegarder vos modifications.</p>


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

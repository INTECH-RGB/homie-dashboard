<template>
  <help :visible="visible" @close="$emit('close')">
   <h3> Le plan de votre maison va se diviser en deux parties :
    <ul>
      <li> Vos étages </li>
      <li> 	Vos salles associées à chaque étage </li>
    </ul>
    </h3>

<h4>Comment ajouter un étage ?</h4>
  <p>Cliquez donc sur « ajouter un étage » situé sur la droite de votre page.</p>
<h4>Comment supprimer un étage ?</h4>
  <p>Lorsque vous disposez d’un étage, il apparaît dans l’onglet à gauche du bouton « ajouter une salle ». Pour le supprimer, il suffit de cliquer sur la croix située dans le coin haut droite de votre étage.</p>
<h4>Comment supprimer une salle ?</h4>
  <p>Une fois votre salle présente sur votre plan, il suffit de cliquer sur la croix située dans le coin haut-gauche de votre salle pour la supprimer.</p>
<h4>Comment ajouter une salle ?</h4>
  <p>Pour cela, il faut au préalable avoir un étage existant. Ensuite, il vous suffit de cliquer sur votre étage qui est apparu et à ce moment-là, le bouton « ajouter une salle » apparaît à droite du bouton « ajouter un étage ».</p>
<h4>Est-il possible de changer l’organisation du plan ?</h4>
  <p>Bien sûr, et pour cela il suffit de maintenir votre souris enfoncée sur votre salle et la déplacer où vous souhaitez la voir apparaître. Vous pouvez aussi changer la taille de vos salles. Pour cela, placez votre souris dans le coin bas-droite de votre salle, maintenez votre souris enfoncée et vous pourrez agrandir ou réduire la taille de votre salle.</p>
<h4>A quoi correspond l’ampoule située en dessous du nom de ma salle ?</h4>
  <p>Cette ampoule est associée à un nombre à sa droite. Ce nombre indique combien de périphériques sont associés à votre salle. En cliquant dessus, vous serez directement redirigé vers ces périphériques.</p>
<h4>Comment assigner un périphérique à une salle ?</h4>
<p> Pour cela, dirigez-vous vers la rubrique Aide de la page "périphériques".</p>
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

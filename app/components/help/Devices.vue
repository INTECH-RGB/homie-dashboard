<template>
  <help :visible="visible" @close="$emit('close')">
    <h3>Ici, vous pouvez voir tous les périphériques que vous avez ajoutés.</h3>
<h4>Comment ajouter un tag ?</h4>
<p>Lorsque vous écrivez quelque chose dans la barre de recherche en dessous du descriptif de la page, un bouton « créer le tag » apparaît, il suffit de cliquer dessus.</p>
<h4>Comment filtrer par tag ou par pièce ?</h4>
<p>Lorsque vous cliquez sur la barre de recherche, la liste de tous vos tags et de toutes vos pièces apparaît, il suffit de cliquer sur ceux par lesquels vous voulez filtrer la recherche.</p>
<h4>Comment modifier le nom de mon périphérique ?</h4>
<p>Pour cela, cliquez sur l’écrou dans le coin haut-droite de votre périphérique. La page des options du périphérique s’affiche. Un bouton « modifier » est présent à droite du nom de votre périphérique, cliquez dessus, entrez le nom voulu et appuyez ensuite sur « enregistrer ». Le tour est joué.</p>
<h4>Comment assigner un périphérique à une salle ou un tag ? </h4>
<p>Commencez par afficher les options de votre périphérique en cliquant sur l’écrou dans le coin haut-droite de celui-ci. Ici, vous pouvez voir deux sous-titres, tag et pièces. Il vous suffit de cliquer sur le nom de la salle ou du tag. Ce dernier va s’afficher en vert et sera donc assigné. (Vous pouvez assigner un périphérique à plusieurs tags/pièces si vous le désirez)</p>
<h4>Comment voir les statistiques d’un périphérique ?</h4>
<p>Dans le coin haut-gauche de votre périphérique, à gauche de l’écrou, l’icône statistique est présente. En cliquant dessus, un graphe avec les différentes statistiques possibles s’affichera.</p>
<h4>Je ne veux voir que les périphériques qui sont en ligne ou hors ligne, comment faire ? </h4>
<p>A droite de la page, vous pouvez voir trois boutons : en ligne, tous ou hors ligne. Ces boutons correspondent à l’affichage des périphériques. En cliquant sur « en ligne » seuls les périphériques en ligne s’afficheront. C’est le même fonctionnement pour les deux autres options.</p>
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

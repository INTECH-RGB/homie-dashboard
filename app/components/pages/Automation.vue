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

    <div id="blocklyDiv" style="height: 480px; width: 100%;"></div>
  </div>
</template>

<script>
/* global Blockly */
import Help from '../help/Automation'

export default {
  data () {
    return {
      help: false
    }
  },
  components: {
    Help
  },
  mounted () {
    createCustomBlocks()

    const toolbox = `
      <xml>
        <block type="controls_if"></block>
        <block type="logic_compare"></block>

        <block type="homie_device_node_prop"></block>
        <block type="homie_condition"></block>
      </xml>
    `
    Blockly.inject('blocklyDiv', {toolbox})
  }
}

function createCustomBlocks () {
  Blockly.Blocks['homie_device_node_prop'] = {
    init: function () {
      this.jsonInit({
        'message0': 'propriété %1',
        'args0': [
          {
            'type': 'field_dropdown',
            'name': 'VAR',
            'options': [
              [ 'first thing', 'ITEM1' ],
              [ 'second item', 'ITEM2' ]
            ]
          }
        ],
        'output': 'HomieProperty',
        'colour': 160,
        'tooltip': 'Retourne la valeur de la propriété spécifiée.'
      })
    }
  }

  Blockly.Blocks['homie_condition'] = {
    init: function () {
      var PROPERTIES =
        [[Blockly.Msg.MATH_IS_EVEN, 'EVEN'],
         [Blockly.Msg.MATH_IS_ODD, 'ODD'],
         [Blockly.Msg.MATH_IS_PRIME, 'PRIME'],
         [Blockly.Msg.MATH_IS_WHOLE, 'WHOLE'],
         [Blockly.Msg.MATH_IS_POSITIVE, 'POSITIVE'],
         [Blockly.Msg.MATH_IS_NEGATIVE, 'NEGATIVE'],
         [Blockly.Msg.MATH_IS_DIVISIBLE_BY, 'DIVISIBLE_BY']]
      this.setColour(Blockly.Blocks.math.HUE)
      this.appendValueInput('CONDITION_TO_CHECK')
          .setCheck('HomieProperty')
      const dropdown = new Blockly.FieldDropdown(PROPERTIES, function (option) {
        const comparatorInput = (option === 'DIVISIBLE_BY') || (option === 'MULTIPLY_BY')
        this.sourceBlock_.updateShape_(comparatorInput)
      })
      this.appendDummyInput()
          .appendField(dropdown, 'CHECK')
      this.setInputsInline(true)
      this.setOutput(true, 'Boolean')
      this.setTooltip(Blockly.Msg.MATH_IS_TOOLTIP)
    },
    /**
     * Create XML to represent whether the 'divisorInput' should be present.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
      const container = document.createElement('mutation')
      const comparatorInput = (this.getFieldValue('CHECK') === 'DIVISIBLE_BY')
      container.setAttribute('comparator_input', comparatorInput)
      return container
    },
    /**
     * Parse XML to restore the 'divisorInput'.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
      const comparatorInput = (xmlElement.getAttribute('comparator_input') === 'true')
      this.updateShape_(comparatorInput)
    },
    /**
     * Modify this block to have (or not have) an input for 'is divisible by'.
     * @param {boolean} divisorInput True if this block has a divisor input.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function (comparatorInput) {
      // Add or remove a Value Input.
      var inputExists = this.getInput('COMPARATOR')
      if (comparatorInput) {
        if (!inputExists) {
          this.appendValueInput('COMPARATOR')
              .setCheck('Number')
        }
      } else if (inputExists) {
        this.removeInput('COMPARATOR')
      }
    }
  }
}
</script>

<style lang="sass" scoped>
</style>

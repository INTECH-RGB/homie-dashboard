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

    <div ref="blockly" style="height: 480px; width: 100%;"></div>
  </div>
</template>

<script>
/* global Blockly */
import {mapState} from 'eva.js'

import Help from '../help/Automation'

import {CONDITIONS, MUTATIONS, NODE_TYPES} from '../../../common/node-types'

export default {
  data () {
    return {
      help: false
    }
  },
  computed: {
    ...mapState(['infrastructure'])
  },
  watch: {
    infrastructure (val) {
      createCustomBlocks(val, this.$refs.blockly)
    }
  },
  components: {
    Help
  },
  mounted () {
    createCustomBlocks(this.infrastructure, this.$refs.blockly)
  }
}

function createCustomBlocks (infrastructure, blockly) {
  const homieColor = '#e74c3c'
  Blockly.Blocks['homie_device_node_prop_condition'] = {
    init () {
      this.setColour(homieColor)
      const dropdownValues = []
      for (const device of Object.values(infrastructure.devices)) {
        for (const node of Object.values(device.nodes)) {
          for (const property of Object.values(node.properties)) {
            dropdownValues.push([
              `propriété ${device.name} - ${node.id} - ${property.id}`,
              JSON.stringify({
                deviceId: device.id,
                nodeId: node.id,
                nodeType: node.type,
                propertyId: property.id
              })
            ])
          }
        }
      }
      const dropdown = new Blockly.FieldDropdown(dropdownValues, function onChange (option) {
        this.sourceBlock_._updateShapeCondition(option)
      })
      this.appendDummyInput('PROPERTY')
          .appendField(dropdown)
      this.setInputsInline(true)
      this.setOutput(true, 'Boolean')
      this.setTooltip('Vérifie que la condition de propriété spécifiée est vraie')
    },
    /**
     * Create XML to represent whether the 'comparatorInput' should be present.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom () {
      /*const container = document.createElement('mutation')
      container.setAttribute('condition_option', this.getFieldValue('CONDITION'))
      container.setAttribute('comparator_option', this.getFieldValue('COMPARATOR'))
      return container*/
    },
    /**
     * Parse XML to restore the 'comparatorInput'.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation (xmlElement) {
      /*const conditionOption = xmlElement.getAttribute('condition_option')
      const comparatorOption = xmlElement.getAttribute('comparator_option')
      this._updateShapeCondition(conditionOption)
      this._updateShapeComparator(comparatorOption)*/
    },
    _updateShapeCondition (option) {
      // remove current field
      let currentConditionInput = this.getInput('CONDITION')
      if (currentConditionInput) this.removeInput('CONDITION')

      option = JSON.parse(option)
      const propertyConditions = NODE_TYPES[option.nodeType][option.propertyId].conditions

      const conditionsDropdownValues = []

      for (const condition of propertyConditions) {
        conditionsDropdownValues.push([
          condition.id,
          JSON.stringify(condition)
        ])
      }

      const conditionsDropdown = new Blockly.FieldDropdown(conditionsDropdownValues, function onChange (option) {
        this.sourceBlock_._updateShapeComparator(option)
      })
      this.appendDummyInput('CONDITION')
          .appendField(conditionsDropdown)

      currentConditionInput = this.getInput('CONDITION').fieldRow[0].value_
      this._updateShapeComparator(currentConditionInput)
    },
    _updateShapeComparator (option) {
      const currentComparatorInput = this.getInput('COMPARATOR')
      if (currentComparatorInput) this.removeInput('COMPARATOR')

      option = JSON.parse(option)

      if (option.hasField) this.appendValueInput('COMPARATOR')
    }
  }

  Blockly.Blocks['homie_device_node_prop_set'] = {
    init () {
      this.setColour(homieColor)
      const dropdownValues = []
      for (const device of Object.values(infrastructure.devices)) {
        for (const node of Object.values(device.nodes)) {
          for (const property of Object.values(node.properties)) {
            if (!property.settable) continue
            dropdownValues.push([
              `propriété ${device.name} - ${node.id} - ${property.id}`,
              JSON.stringify({
                deviceId: device.id,
                nodeId: node.id,
                nodeType: node.type,
                propertyId: property.id
              })
            ])
          }
        }
      }
      const dropdown = new Blockly.FieldDropdown(dropdownValues, function onChange (option) {
        this.sourceBlock_._updateShapeMutation(option)
      })
      this.appendDummyInput('PROPERTY')
          .appendField(dropdown)
      this.setInputsInline(true)
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setTooltip('Définit la valeur de la propriété spécifiée')
      this.contextMenu = false
    },
    /**
     * Create XML to represent whether the 'comparatorInput' should be present.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom () {
      /*const container = document.createElement('mutation')
      container.setAttribute('condition_option', this.getFieldValue('CONDITION'))
      container.setAttribute('comparator_option', this.getFieldValue('COMPARATOR'))
      return container*/
    },
    /**
     * Parse XML to restore the 'comparatorInput'.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation (xmlElement) {
      /*const conditionOption = xmlElement.getAttribute('condition_option')
      const comparatorOption = xmlElement.getAttribute('comparator_option')
      this._updateShapeCondition(conditionOption)
      this._updateShapeComparator(comparatorOption)*/
    },
    _updateShapeMutation (option) {
      // remove current field
      let currentMutationInput = this.getInput('MUTATION')
      if (currentMutationInput) this.removeInput('MUTATION')

      option = JSON.parse(option)
      const propertyMutations = NODE_TYPES[option.nodeType][option.propertyId].mutations

      const mutationsDropdownValues = []

      for (const mutation of propertyMutations) {
        mutationsDropdownValues.push([
          mutation.id,
          JSON.stringify(mutation)
        ])
      }

      const mutationsDropdown = new Blockly.FieldDropdown(mutationsDropdownValues, function onChange (option) {
        this.sourceBlock_._updateShapeValue(option)
      })
      this.appendDummyInput('MUTATION')
          .appendField(mutationsDropdown)

      currentMutationInput = this.getInput('MUTATION').fieldRow[0].value_
      this._updateShapeValue(currentMutationInput)
    },
    _updateShapeValue (option) {
      const currentValueInput = this.getInput('VALUE')
      if (currentValueInput) this.removeInput('VALUE')

      option = JSON.parse(option)

      if (option.hasField) this.appendValueInput('VALUE')
    }
  }

  const toolbox = `
    <xml>
      <block type="controls_if"></block>

      <block type="homie_device_node_prop_condition"></block>
      <block type="homie_device_node_prop_set"></block>
      <block type="text"></block>
    </xml>
  `

  Blockly.inject(blockly, {toolbox})
}
</script>

<style lang="sass" scoped>
</style>

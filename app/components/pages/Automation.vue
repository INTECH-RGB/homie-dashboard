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

    <div class="block">
      <a class="button is-success" @click.prevent="save">Enregistrer</a>
    </div>
    <div ref="blockly" style="height: 480px; width: 100%;"></div>
  </div>
</template>

<script>
/* global Blockly */
import {mapState, mapActions} from 'eva.js'

import Help from '../help/Automation'

import {NODE_TYPES} from '../../../common/node-types'

export default {
  data () {
    return {
      help: false,
      blocklyWorkspace: null
    }
  },
  computed: {
    ...mapState(['infrastructure'])
  },
  watch: {
    infrastructure (val) {
      createCustomBlocks(val, this)
    }
  },
  components: {
    Help
  },
  methods: {
    async save () {
      const xml = Blockly.Xml.workspaceToDom(this.blocklyWorkspace)
      var xmlText = Blockly.Xml.domToText(xml)

      await this.saveAutomationScript({
        blocklyXml: xmlText,
        script: Blockly.JavaScript.workspaceToCode(this.blocklyWorkspace)
      })
    },
    ...mapActions(['saveAutomationScript'])
  },
  mounted () {
    createCustomBlocks(this.infrastructure, this)
  }
}

function createCustomBlocks (infrastructure, self) {
  const homieColor = '#e74c3c'
  Blockly.Blocks['homie_device_node_prop_condition'] = {
    init () {
      this.setColour(homieColor)
      const dropdownValues = []
      for (const device of Object.values(infrastructure.devices)) {
        for (const node of Object.values(device.nodes)) {
          for (const property of Object.values(node.properties)) {
            dropdownValues.push([
              `condition ${device.name} - ${node.name} - ${property.id}`,
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

      if (dropdownValues.length === 0) return

      const dropdown = new Blockly.FieldDropdown(dropdownValues, function onChange (option) {
        this.sourceBlock_._updateShapeCondition(option)
      })
      this.appendDummyInput('PROPERTY')
          .appendField(dropdown, 'PROPERTY')
      this.setInputsInline(true)
      this.setOutput(true, 'Boolean')
      this.setTooltip('Vérifie que la condition de propriété spécifiée est vraie')

      this._updateShapeCondition(this.getFieldValue('PROPERTY'))
    },
    /**
     * Create XML to represent whether the 'comparatorInput' should be present.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom () {
      const container = document.createElement('mutation')
      container.setAttribute('property_option', this.getFieldValue('PROPERTY'))
      container.setAttribute('condition_option', this.getFieldValue('CONDITION'))
      return container
    },
    /**
     * Parse XML to restore the 'comparatorInput'.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation (xmlElement) {
      const propertyOption = xmlElement.getAttribute('property_option')
      const conditionOption = xmlElement.getAttribute('condition_option')
      this._updateShapeCondition(propertyOption)
      this._updateShapeComparator(conditionOption)
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
          .appendField(conditionsDropdown, 'CONDITION')

      this._updateShapeComparator(this.getFieldValue('CONDITION'))
    },
    _updateShapeComparator (option) {
      const currentComparatorInput = this.getInput('COMPARATOR')
      if (currentComparatorInput) this.removeInput('COMPARATOR')

      option = JSON.parse(option)

      if (option.hasField) {
        this.appendDummyInput('COMPARATOR')
          .appendField(new Blockly.FieldTextInput(''), 'COMPARATOR')
      }
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
              `action ${device.name} - ${node.name} - ${property.id}`,
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

      if (dropdownValues.length === 0) return

      const dropdown = new Blockly.FieldDropdown(dropdownValues, function onChange (option) {
        this.sourceBlock_._updateShapeMutation(option)
      })
      this.appendDummyInput('PROPERTY')
          .appendField(dropdown, 'PROPERTY')
      this.setInputsInline(true)
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setTooltip('Définit la valeur de la propriété spécifiée')
      this.contextMenu = false

      this._updateShapeMutation(this.getFieldValue('PROPERTY'))
    },
    /**
     * Create XML to represent whether the 'comparatorInput' should be present.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom () {
      const container = document.createElement('mutation')
      container.setAttribute('property_option', this.getFieldValue('PROPERTY'))
      container.setAttribute('mutation_option', this.getFieldValue('MUTATION'))
      return container
    },
    /**
     * Parse XML to restore the 'comparatorInput'.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation (xmlElement) {
      const propertyOption = xmlElement.getAttribute('property_option')
      const mutationOption = xmlElement.getAttribute('mutation_option')
      this._updateShapeMutation(propertyOption)
      this._updateShapeValue(mutationOption)
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
          .appendField(mutationsDropdown, 'MUTATION')

      this._updateShapeValue(this.getFieldValue('MUTATION'))
    },
    _updateShapeValue (option) {
      const currentValueInput = this.getInput('VALUE')
      if (currentValueInput) this.removeInput('VALUE')

      option = JSON.parse(option)

      if (option.hasField) {
        this.appendDummyInput('VALUE')
          .appendField(new Blockly.FieldTextInput(''), 'VALUE')
      }
    }
  }

  Blockly.JavaScript['homie_device_node_prop_condition'] = function (block) {
    const property = JSON.parse(block.getFieldValue('PROPERTY'))
    const condition = JSON.parse(block.getFieldValue('CONDITION'))
    const comparator = block.getFieldValue('COMPARATOR')

    let code = `infrastructure.devices['${property.deviceId}'].nodes['${property.nodeId}'].properties['${property.propertyId}'].value`
    switch (condition.id) {
      case 'isMotion':
      case 'isOpen':
      case 'isOn':
      case 'isPressed':
        code += " === '1'"
        break
      case 'isNotMotion':
      case 'isClose':
      case 'isOff':
      case 'isReleased':
        code += " === '0'"
        break
      case 'equals':
        code += ` === '${comparator}'`
        break
      case 'above':
        code += ` > '${comparator}'`
        break
      case 'under':
        code += ` < '${comparator}'`
        break
    }
    return [code, Blockly.JavaScript.ORDER_MEMBER]
  }

  Blockly.JavaScript['homie_device_node_prop_set'] = function (block) {
    const property = JSON.parse(block.getFieldValue('PROPERTY'))
    const mutation = JSON.parse(block.getFieldValue('MUTATION'))
    const value = block.getFieldValue('VALUE')

    let computedValue = value
    switch (mutation.id) {
      case 'setOpen':
      case 'setOn':
        computedValue = '1'
        break
      case 'setClose':
      case 'setOff':
        computedValue = '0'
        break
    }

    const code = `handleAction({ deviceId: '${property.deviceId}', nodeId: '${property.nodeId}', propertyId: '${property.propertyId}', value: '${computedValue}' });\n`
    return code
  }

  const toolbox = `
    <xml>
      <block type="controls_if"></block>
      <block type="logic_operation"></block>

      <block type="homie_device_node_prop_condition"></block>
      <block type="homie_device_node_prop_set"></block>
    </xml>
  `

  if (!self.$refs.blockly) return

  if (self.blocklyWorkspace) self.blocklyWorkspace.dispose()
  self.blocklyWorkspace = Blockly.inject(self.$refs.blockly, {toolbox})
  const xml = Blockly.Xml.textToDom(self.infrastructure.automation)
  Blockly.Xml.domToWorkspace(xml, self.blocklyWorkspace)
  Blockly.JavaScript.addReservedWords('code')
}
</script>

<style lang="sass" scoped>
</style>

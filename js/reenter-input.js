/* global HTMLInputElement, customElements, CustomEvent */

class ReenterInput extends HTMLInputElement {
  connectedCallback () {
    this.relatedField = this.hasAttribute('related-field')
      ? document.querySelector(this.getAttribute('related-field'))
      : undefined

    this.relatedFieldValidationListener = () => {
      const isValid = this.validate()
      if (!isValid) {
        this.reportValidity()
      }
    }
    this.validationListener = () => { this.validate() }
    this.addEventListener('input', this.validationListener)
    this.addEventListener('blur', this.validationListener)
    this.relatedField?.addEventListener('input', this.relatedFieldValidationListener)
    this.relatedField?.addEventListener('blur', this.relatedFieldValidationListener)
  }

  disconnectedCallback () {
    this.removeEventListener('input', this.validationListener)
    this.relatedField?.removeEventListener('input', this.validationListener)
    this.removeEventListener('blur', this.validationListener)
  }

  checkValidity () {
    const validity = super.checkValidity()
    if (!validity) { return false }
    return this.validate()
  }

  reportValidity () {
    this.validate()
    return super.reportValidity()
  }

  validate () {
    if (this.value && (this.value !== this.relatedField?.value)) {
      this.setCustomValidity('fields do not match!!')
      return false
    } else {
      this.setCustomValidity('')
      // Fields only send "invalid" events. There are not "valid" events, so we send our own
      this.dispatchEvent(new CustomEvent('custom:valid'))
      return true
    }
  }
}

customElements.define('reenter-input', ReenterInput, { extends: 'input' })

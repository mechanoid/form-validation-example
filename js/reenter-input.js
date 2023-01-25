/* eslint-env browser */

class ReenterInput extends HTMLInputElement {
  connectedCallback () {
    this.relatedField = this.hasAttribute('related-field')
      ? document.querySelector(this.getAttribute('related-field'))
      : undefined

    const validationListener = () => {
      this.setCustomValidity('') // clean up custom error message state
      this.validate()
    }

    const relatedFieldValidationListener = () => {
      if (!this.value) { return }
      this.validate()
    }

    this.addEventListener('input', validationListener)
    this.addEventListener('blur', validationListener)
    this.relatedField?.addEventListener('input', relatedFieldValidationListener)
    this.relatedField?.addEventListener('blur', relatedFieldValidationListener)
  }

  disconnectedCallback () {
    this.relatedField?.removeEventListener('input', this.validationListener)
  }

  // this will be called e.g. by a form submit
  checkValidity () {
    const validity = super.checkValidity()
    if (!validity) { return false }
    return this.validate()
  }

  validate () {
    // check native constraints
    if (!super.checkValidity()) {
      return false

      // check equality of related field next
    } else if (this.value !== this.relatedField?.value) {
      this.setCustomValidity('fields do not match!!')
      return false

    // everything fine. (tell the input-error-message element!)
    } else {
      // Fields only send "invalid" events. There are not "valid" events, so we send our own
      this.dispatchEvent(new CustomEvent('custom:valid'))
      return true
    }
  }

}

customElements.define('reenter-input', ReenterInput, { extends: 'input' })

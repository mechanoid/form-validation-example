/* global HTMLFormElement, customElements */

class ReactiveForm extends HTMLFormElement {
  connectedCallback () {
    this.fieldValidationHandler = (event) => {
      // stop standard error behaviour (e.g. for required)
      event.preventDefault()
      this.setValidationStatus()
    }

    for (const field of this.elements) { field.addEventListener('invalid', this.fieldValidationHandler) }
  }

  setValidationStatus (event) {
    if (this.isInValidation) return
    this.markAsInValidation()
  }

  get isInValidation () {
    return this.classList.contains('in-validation')
  }

  markAsInValidation () {
    this.classList.add('in-validation')
  }
}

customElements.define('reactive-form', ReactiveForm, { extends: 'form' })

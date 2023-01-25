/* eslint-env browser */

class ReactiveForm extends HTMLFormElement {
  connectedCallback () {
    this.fieldValidationHandler = (event) => {
      // stop standard error behaviour (e.g. for required)
      event.preventDefault()
    }

    for (const field of this.elements) {
      field.addEventListener('invalid', this.fieldValidationHandler)
    }
  }
}

customElements.define('reactive-form', ReactiveForm, { extends: 'form' })

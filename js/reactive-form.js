/* global HTMLFormElement, customElements */

class ReactiveForm extends HTMLFormElement {
  constructor () {
    super()
    this.startedValidation = false
  }

  connectedCallback () {
    for (const field of this.elements) {
      field.addEventListener('invalid', (event) => {
        event.preventDefault() // stops standard error behaviour (e.g. for required)
        this.markAsInvalid()
      })
    }

    this.submitHandler = this.checkValidityStatus.bind(this)
    this.addEventListener('submit', this.submitHandler)
  }

  disconnectedCallback () {
    if (this.submitHandler) {
      this.removeEventListener('submit', this.submitHandler)
    }
  }

  checkValidityStatus (event) {
    console.log('start validation process')
    const isValid = this.checkValidity()

    if (!isValid) {
      event?.preventDefault()
      this.markAsInvalid()
      return false
    } else {
      this.markAsValid()
    }
  }

  get isInValidation () {
    return this.classList.contains('in-validation')
  }

  markAsInvalid () {
    this.classList.add('in-validation')
  }

  markAsValid () { this.classList.remove('in-validation') }
}

customElements.define('reactive-form', ReactiveForm, { extends: 'form' })

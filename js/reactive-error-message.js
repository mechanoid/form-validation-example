/* eslint-env browser */

const errorMessageContainerTemplate = () => '<error-message></error-message>'

const fieldErrorTypes = ['badInput', 'customError', 'patternMismatch', 'rangeOverflow', 'rangeUnderflow', 'stepMismatch', 'tooLong', 'tooShort', 'typeMismatch', 'valueMissing']


const errorMessages = {
  badInput: 'Ihre Eingabe ist fehlerhaft!'
}


class ReactiveErrorMessage extends HTMLElement {
  async connectedCallback () {
    this.input = this.querySelector('input,select,textarea')

    // allow server side rendered error messages
    this.errorMessageContainer = this.querySelector('error-message') || await this.createErrorMessageContainer()

    this.revalidationHandler = (event) => {
      this.cleanup()
      // if (!this.input?.form?.isInValidation) { return }

      this.classList.remove('has-errors')
      this.input.checkValidity()
    }

    this.inputBecomesValidHandler = () => {
      this.cleanup()
    }

    this.inputBecomesInvalidHandler = (e) => {
      // if (!this.input?.form?.isInValidation) { return }
      this.classList.add('has-errors')
      this.writeMessages()
    }

    // this.input?.addEventListener('input', this.revalidationHandler)
    this.input?.addEventListener('blur', this.revalidationHandler)
    this.input?.addEventListener('invalid', this.inputBecomesInvalidHandler)
    this.input?.addEventListener('custom:valid', this.inputBecomesValidHandler)
  }

  cleanup () {
    this.errorMessageContainer.textContent = ''
  }

  async writeMessages () {
    this.cleanup()
    const { validity } = this.input

    const hasErrors = fieldErrorTypes.some((type) => !!validity[type])

    if (hasErrors) {
      this.errorMessageContainer.textContent = this.input.validationMessage
    }
  }

  async createErrorMessageContainer () {
    await this.insertAdjacentHTML('beforeend', errorMessageContainerTemplate())
    return this.querySelector('error-message')
  }
}

customElements.define('reactive-error-message', ReactiveErrorMessage)

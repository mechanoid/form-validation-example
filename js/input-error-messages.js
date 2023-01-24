/* global HTMLElement, customElements */

const errorMessageContainerTemplate = () => '<error-messages></error-messages>'

const fieldErrorTypes = ['badInput', 'customError', 'patternMismatch', 'rangeOverflow', 'rangeUnderflow', 'stepMismatch', 'tooLong', 'tooShort', 'typeMismatch', 'valueMissing']

class InputErrorMessages extends HTMLElement {
  async connectedCallback () {
    this.input = this.querySelector('input,select,textarea')

    // allow server side rendered error messages
    this.errorMessageContainer = this.querySelector('error-messages') || await this.createErrorMessageContainer()

    this.revalidationHandler = (event) => {
      if (!this.input?.form?.isInValidation) { return }
      this.cleanup()
      this.input.checkValidity()
    }

    const throttledWriteMessages = trailingThrottle(() => this.writeMessages())

    this.inputBecomesValidHandler = () => this.cleanup()
    this.inputBecomesInvalidHandler = (e) => {
      if (!this.input?.form?.isInValidation) { return }
      throttledWriteMessages()
    }

    this.input?.addEventListener('invalid', this.inputBecomesInvalidHandler)
    this.input?.addEventListener('input', this.revalidationHandler)
    this.input?.addEventListener('blur', this.revalidationHandler)
    this.input?.addEventListener('custom:valid', this.inputBecomesValidHandler)
  }

  disconnectedCallback () {
    this.input?.removeEventListener('invalid', this.inputBecomesInvalidHandler)
    this.input?.removeEventListener('input', this.revalidationHandler)
    this.input?.removeEventListener('blur', this.revalidationHandler)
    this.input?.removeEventListener('custom:valid', this.inputBecomesValidHandler)
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
    return this.querySelector('error-messages')
  }
}

customElements.define('input-error-messages', InputErrorMessages)

function trailingThrottle (func, waitFor = 300) {
  console.log('init throttled')
  let timeout = null

  return () => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      return func()
    }, waitFor)
  }
}

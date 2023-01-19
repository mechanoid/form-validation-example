/* global HTMLElement, customElements */

const errorMessageTemplate = (message) => `<li>${message}</li>`
const errorMessageListTemplate = () => '<ul></ul>'
const errorMessageContainerTemplate = () => '<error-messages></error-messages>'

const fieldErrorTypes = ['badInput', 'customError', 'patternMismatch', 'rangeOverflow', 'rangeUnderflow', 'stepMismatch', 'tooLong', 'tooShort', 'typeMismatch', 'valueMissing']

// TODO: get error messages from attribute property, e.g. errors="{'badInput':'...',...}"
const errorMessages = {
  badInput: 'errorneous input',
  customError: 'fields must be similar',
  patternMismatch: 'has to comply to pattern /xxx/',
  rangeOverflow: 'to much entries',
  rangeUnderflow: 'not enough entries',
  stepMismatch: 'steps mismatching',
  tooLong: 'too long',
  tooShort: 'too short',
  typeMismatch: 'wrong type!',
  valueMissing: 'this field is required!!'
}

class InputErrorMessages extends HTMLElement {
  async connectedCallback () {
    this.input = this.querySelector('input,select,textarea')
    this.errorMessageContainer = await this.createErrorMessageContainer()

    this.revalidationListener = () => { this.writeMessages() }

    this.input?.addEventListener('invalid', this.revalidationListener)
    this.input?.addEventListener('input', this.revalidationListener)
    this.input?.addEventListener('blur', this.revalidationListener)
    this.input?.addEventListener('custom:valid', this.revalidationListener)
  }

  cleanup () {
    this.errorMessageContainer.innerHTML = ''
  }

  async writeMessages () {
    if (!this.input?.form?.isInValidation) { return }

    this.cleanup()
    const { validity } = this.input

    const errors = fieldErrorTypes.map((errorType) => {
      const hasError = validity[errorType]
      if (hasError) { return errorMessages[errorType] }
      return undefined
    }).filter(x => !!x)

    if (errors.length > 0) {
      const errorList = await this.createErrorList()
      for (const error of errors) {
        errorList.insertAdjacentHTML('beforeend', errorMessageTemplate(error))
      }
    }
  }

  disconnectedCallback () {
    this.input?.removeEventListener('invalid', this.invalidListener)
  }

  async createErrorMessageContainer () {
    await this.insertAdjacentHTML('beforeend', errorMessageContainerTemplate())
    return this.querySelector('error-messages')
  }

  async createErrorList () {
    await this.errorMessageContainer.insertAdjacentHTML('beforeend', errorMessageListTemplate())
    return this.errorMessageContainer.querySelector('ul')
  }
}

customElements.define('input-error-messages', InputErrorMessages)

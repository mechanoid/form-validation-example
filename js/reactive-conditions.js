/* eslint-env browser */

// const errorMessageContainerTemplate = () => '<error-message></error-message>'

// const fieldErrorTypes = ['badInput', 'customError', 'patternMismatch', 'rangeOverflow', 'rangeUnderflow', 'stepMismatch', 'tooLong', 'tooShort', 'typeMismatch', 'valueMissing']

class ReactiveConditions extends HTMLElement {
  async connectedCallback () {
    this.input = this.querySelector('input,select,textarea')

    // allow server side rendered error messages
    this.conditions = Array.from(this.querySelectorAll('[is=condition-item]'))
    console.log(this.conditions)
    this.revalidationHandler = (event) => {
      this.input.checkValidity()
      this.revalidateConditions()
    }

    this.inputBecomesValidHandler = () => {
      this.revalidateConditions()
    }

    this.inputBecomesInvalidHandler = (e) => {
      this.revalidateConditions()
    }

    this.input?.addEventListener('input', this.revalidationHandler)
    this.input?.addEventListener('blur', this.revalidationHandler)
    this.input?.addEventListener('invalid', this.inputBecomesInvalidHandler)
    this.input?.addEventListener('custom:valid', this.inputBecomesValidHandler)
  }

  async revalidateConditions () {
    const { validity } = this.input
    this.conditions.forEach(c => {
      const isValid = !validity[c.condition]
      if (isValid) {
        c.valid = true
      } else {
        c.valid = false
      }
    })
  }
}

class ConditionList extends HTMLUListElement {

}

class ConditionItem extends HTMLLIElement {
  #valid
  get condition () {
    return this.getAttribute('condition')
  }

  set valid (valid) {
    this.#valid = Boolean(valid)
    if (this.#valid) {
      this.classList.remove('invalid')
      this.classList.add('valid')
    } else {
      this.classList.remove('valid')
      this.classList.add('invalid')
    }
  }

  get valid () {
    return this.#valid
  }
}

customElements.define('reactive-conditions', ReactiveConditions)
customElements.define('condition-list', ConditionList, { extends: 'ul' })
customElements.define('condition-item', ConditionItem, { extends: 'li' })

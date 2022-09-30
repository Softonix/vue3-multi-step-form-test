/* eslint-disable cypress/no-unnecessary-waiting */
import FormStepper from '../FormStepper.vue'
import type { ITab } from '@/types'

describe('FormStepper', () => {
  it('renders properly', () => {
    const tabs: ITab[] = [
      { label: 'First Name & Last Name' },
      { label: 'Middle Name' },
      { label: 'Date Of Birth' },
      { label: 'Results' }
    ]
    cy.mount(FormStepper)

    cy.get('#prev-btn').should('contain', 'Previous')
    cy.get('#next-btn').should('contain', 'Next')
    cy.get('[id^="tab-"]').should('have.length', tabs.length)
    cy.get('[id^="pane-"]').should('have.length', tabs.length)

    tabs.forEach((tab, index) => {
      cy.get(`#tab-${index}`).should('contain.text', tab.label)
    })
  })

  it('validates first step', () => {
    cy.mount(FormStepper)

    cy.get('#next-btn').should('contain', 'Next').click()

    cy.get('#pane-0').get('.el-form-item .el-form-item__error')

    cy.get('.el-message')
      .should('have.class', 'el-message--error')
      .should('contain', 'First name or Last name or both are invalid')

    cy.get('#tab-0').should('have.class', 'is-active')
  })

  it('validates second step', () => {
    cy.mount(FormStepper, {
      props: {
        initialTab: 1,
        initialFormModel: {
          firstName: 'First Name',
          lastName: 'Last Name',
          middleName: '',
          dateOfBirth: ''
        }
      }
    })

    cy.get('#next-btn').should('contain', 'Next').click()
    cy.get('#tab-2').should('have.class', 'is-active')
  })

  it('validates third step', () => {
    cy.mount(FormStepper, {
      props: {
        initialTab: 2,
        initialFormModel: {
          firstName: 'First Name',
          lastName: 'Last Name',
          middleName: '',
          dateOfBirth: ''
        }
      }
    })

    cy.get('#next-btn').should('contain', 'Submit').click()

    cy.get('#pane-2').get('.el-form-item .el-form-item__error')

    cy.get('.el-message')
      .should('have.class', 'el-message--error')
      .should('contain', 'Date of birth is required')

    cy.get('#tab-2').should('have.class', 'is-active')
  })

  it('checks submit', () => {
    cy.mount(FormStepper, {
      props: {
        initialTab: 2,
        initialFormModel: {
          firstName: 'First Name',
          lastName: 'Last Name',
          middleName: '',
          dateOfBirth: '1996-01-24'
        }
      }
    })

    cy.get('#next-btn').should('contain', 'Submit').click()

    cy.wait(1000)

    cy.get('.el-message')
      .should('have.class', 'el-message--success')
      .should('contain', 'The form has been successfully submitted!')

    cy.get('#tab-3').should('have.class', 'is-active')
  })

  it('checks results to have correct data', () => {
    const initialFormModel = {
      firstName: 'First Name',
      lastName: 'Last Name',
      middleName: '',
      dateOfBirth: '1996-01-24'
    }

    const modelValues = Object.values(initialFormModel)

    cy.mount(FormStepper, {
      props: {
        initialTab: 3,
        initialFormModel
      }
    })

    cy.get('.el-descriptions__table tr').last().then(() => {
      modelValues.forEach((item, index) => {
        cy.get('td').eq(index).should('contain', item)
      })
    })
  })

  it('checks reset button', () => {
    cy.mount(FormStepper, {
      props: {
        initialTab: 3,
        initialFormModel: {
          firstName: 'First Name',
          lastName: 'Last Name',
          middleName: '',
          dateOfBirth: '1996-01-24'
        }
      }
    })

    cy.get('#next-btn').should('contain', 'Reset').click()

    cy.get('#tab-0').should('be.visible')
  })
})

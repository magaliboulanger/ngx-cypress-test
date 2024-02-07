/// <reference types="cypress" />

describe('First test suite', () =>{

    it('first test', ()=>{
        //visit base url
        cy.visit('/')
        //navigate through the tabs by text 
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //by Tag name
        //cy.get('input')
        
        //by id
        cy.get('#inputEmail1')

        //by class value
        //cy.get('.input-full-with')

        //by name value
        cy.get('[fullwidth]')

        //by attribute and value
        cy.get('[placeholder="Email"]')

        //by entire class value
        cy.get('[class="input-full-width size-medium shape-rectangle"]')

        //by two attributes
        cy.get('[placeholder="Email"][fullwidth]')

        //by tag, attribute, id and class
        cy.get('input[placeholder="Email"]#inputEmail1.input-full-width')

        //by cypress test id
        //cy.get('[data-cy="inputEmail1"]')


    })


    it('second test', ()=>{
        //visit base url
        cy.visit('/')
        //navigate through the tabs by text 
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()
        
        //Theory
        // get() - find elements on the page by locator globally
        // find() - find child elements by locator
        // contains() - find HTML text and by text and locator - returns the first match
       
        cy.contains('Sign in')

        //If I want to find a button in particular that is not the first I could provide more details.
        cy.contains('[status="warning"]', 'Sign in')

        //locator by parent
        cy.contains('nb-card','Horizontal form').find('button')
        //another example finding by parent
        cy.contains('nb-card','Horizontal form').contains('button')
        //this NOT WORK: (because get always get every appearance, not inside previous result)
        cy.contains('nb-card','Horizontal form').get('button')

        //cypres chains and DOM
        cy.get('#inputEmail3')
            .parents('form')
            .find('button')
            .should('contain', 'Sign in')
            .parents('form')
            .find('nb-checkbox')
            .click()
    })

    it('subject of the command',()=>{
        //visit base url
        cy.visit('/')
        //navigate through the tabs by text 
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()
        cy.contains('nb-card','Using the Grid').find('[for="inputEmail1"]').should('contain', 'Email')
        cy.contains('nb-card','Using the Grid').find('[for="inputPassword2"]').should('contain', 'Password')
        

        //CANT DO THINGS LIKE THIS. Cypress is asynchronus.
        //const usingTheGrid = cy.contains('nb-card','Using the Grid')
        //usingTheGrid.find('[for="inputEmail1"]')
        //usingTheGrid.find('[for="inputPassword2"]').should('contain', 'Password')
   

        //1. Cypress alias
        //kind of global variable, very convenient
        cy.contains('nb-card','Using the Grid').as('usingTheGrid')
        cy.get('@usingTheGrid').find('[for="inputEmail1"]').should('contain', 'Email')
        cy.get('@usingTheGrid').find('[for="inputPassword2"]').should('contain', 'Password')
    
        // 2. Cypress then() methods
        cy.contains('nb-card','Using the Grid').then(usingTheGridForm=>{
            //this is jquery, methods like should(by cypress) won't be available
            cy.wrap(usingTheGridForm).find('[for="inputEmail1"]').should('contain', 'Email')
            cy.wrap(usingTheGridForm).find('[for="inputPassword2"]').should('contain', 'Password')
        })

    })

    it('extract text values', ()=>{
        //visit base url
        cy.visit('/')
        //navigate through the tabs by text 
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()


        //1
        cy.get('[for="exampleInputEmail1"]').should('contain','Email address')

        //2
        cy.get('[for=exampleInputEmail1]').then(label=>{
            const labelText = label.text()
            expect(labelText).to.equal('Email address')
            cy.wrap(labelText).should('contain','Email address')
        })

        //3
        cy.get('[for="exampleInputEmail1"]').invoke('text').then(text => {
            expect(text).to.equal('Email address')
        })
        cy.get('[for=exampleInputEmail1]').invoke('text').as('labelText').should('contain','Email address')

        //4
        cy.get('[for=exampleInputEmail1]').invoke('attr', 'class').then(classValue=>{
            expect(classValue).to.equal('label')
        })

        //5 invoke properties
        cy.get('[for=exampleInputEmail1]').type('test@test.com')
        cy.get('[for=exampleInputEmail1]').invoke('prop', 'value').should('contain','test@test.com').then(property => {
            expect(property).to.equal("test@test.com")
        })
    })
    

    it('radio buttons',()=>{
        //visit base url
        cy.visit('/')
        //navigate through the tabs by text 
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()
        cy.contains('nb-card','Using the Grid').find('[type="radio"]').then(radioButtons => {
            cy.wrap(radioButtons).eq(0).check({force: true}).should('be.checked') //force true because it is visually hidden and cypress cant continue
            cy.wrap(radioButtons).eq(1).check({force: true})
            cy.wrap(radioButtons).eq(0).should('not.be.checked')
            cy.wrap(radioButtons).eq(2).should('be.disabled')
        }
        )
    })

    it.only('checkbox', ()=>{
        //visit base url
        cy.visit('/')
        //navigate through the tabs by text 
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click()

        //there are 3 checkboxes, this code checks/unchecks everyone
        cy.get('[type="checkbox"]').check({force: true})
        //same that above
        cy.get('[type="checkbox"]').uncheck({force: true})


        //in following examples, does not matter the status, it acts as a mouse click
        cy.get('[type="checkbox"]').eq(0).click({force: true})
        cy.get('[type="checkbox"]').eq(1).click({force: true})
    })
})

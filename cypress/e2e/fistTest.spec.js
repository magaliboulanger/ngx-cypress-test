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

    it('checkbox', ()=>{
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

    it('Date picker', ()=> {
        
        function selectDayFromCurrent(day){
            //this is a recursive function because we need to repeat this as it is necessary and find the desered date, and javascript is asynchronous
            let date = new Date()
            date.setDate(date.getDate() + day)
            let futureDay = date.getDate()
            let futureMonth = date.toLocaleDateString('en-US', {month:'short'})
            let futureYear = date.getFullYear()
            let dateToAssert = `${futureMonth} ${futureDay}, ${futureYear}`

            cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then( dateAttribute => {
                if(!dateAttribute.includes(futureMonth) || !dateAttribute.includes(futureYear)){
                    cy.get('[data-name="chevron-right"]').click()
                    selectDayFromCurrent(day)
                } else {
                    cy.get('.day-cell').not('.bounding-month').contains(futureDay).click()
                }
            })
            return dateToAssert
        }

            //visit base url
        cy.visit('/')
        //navigate through the tabs by text 
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()
        cy.contains('nb-card', 'Common Datepicker').find('input').then(input => {
            cy.wrap(input).click()
            const dateToAssert = selectDayFromCurrent(200)
            cy.wrap(input).invoke('prop', 'value').should('contain', dateToAssert)
            cy.wrap(input).should('have.value', dateToAssert)
        
        })

    })

    it('Lists and dropdowns', ()=> {
        //visit base url
        cy.visit('/')

        //1
        cy.get('nav').find('nb-select').click()
        cy.get('.options-list').contains('Dark').click()
        cy.get('nav').find('nb-select').should('contain', 'Dark')

        //2
        cy.get('nav').find('nb-select').then(dropDown=>{
            cy.wrap(dropDown).click()
            cy.get('.options-list nb-option').each((listItem, index) =>{
                const itemText = listItem.text().trim()
                cy.wrap(listItem).click()
                cy.wrap(dropDown).should('contain', itemText)
                if (index<3){
                    cy.wrap(dropDown).click() 
                }
            })
        })
    })





    it('Tables', ()=> {
        //visit base url
        cy.visit('/')
        //navigate through the tabs by text 
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()

        //1 - Get the row by text
        cy.get('tbody').contains('tr', 'Larry').then(tableRow=>{
            cy.wrap(tableRow).find('.nb-edit').click()
            cy.wrap(tableRow).find('[placeholder="Age"]').clear().type("25")
            cy.wrap(tableRow).find('.nb-checkmark').click()
            cy.wrap(tableRow).find('td').eq(6).should('contain', '25')
        })

        //2 - Get row by index
        cy.get('thead').find('.nb-plus').click()
        cy.get('thead').find('tr').eq(2).then( tableRow => {
            cy.wrap(tableRow).find('[placeholder="First Name"]').type('John')
            cy.wrap(tableRow).find('[placeholder="Last Name"]').type('Smith')
            cy.wrap(tableRow).find('.nb-checkmark').click()
        })
        cy.get('tbody tr').first().find('td').then(tableColumns=>{
            cy.wrap(tableColumns).eq(2).should('contain', 'John')
            cy.wrap(tableColumns).eq(3).should('contain', 'Smith')
        })

        //3 Get each row validation
        const age = [20, 30, 40, 200]
        cy.wrap(age).each(age => {
            cy.get('thead [placeholder="Age"]').clear().type(age)
            //wait half a second - page has a little animation 
            cy.wait(500)
            cy.get('tbody tr').each(tableRow=>{
                if (age == 200){
                    cy.wrap(tableRow).should('contain', 'No data found')
                } else {
                    cy.wrap(tableRow).find('td').eq(6).should('contain', age)
                }
            })
        })
    })

    it('tooltips', ()=> {
        //visit base url
        cy.visit('/')
        //navigate through the tabs by text 
        cy.contains('Modal & Overlays').click()
        cy.contains('Tooltip').click()

        cy.contains('nb-card', 'Colored Tooltips').contains('Default').click()
        cy.get('nb-tooltip').should('contain', 'This is a tooltip')

    })

    it.only('dialog box', ()=> {
        //visit base url
        cy.visit('/')
        //navigate through the tabs by text 
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()

        //1 This is not a good approach because if the alert is not present, the assertion wont fail, because it wnot be executed
        cy.get('tbody tr').first().find('.nb-trash').click()
        cy.on('window:confirm', (confirm)=>{
            expect(confirm).to.equal('Are you sure you want to delete?')
        })

        //2
        const stub = cy.stub()
        cy.on('window:confirm', stub)
        cy.get('tbody tr').first().find('.nb-trash').click().then(()=>{
            expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
        })

        //3
        cy.get('tbody tr').first().find('.nb-trash').click()
        cy.on('window:confirm', ()=>false)
        
    })

})

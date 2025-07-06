import { test } from '@playwright/test';
import { PageManager } from '@pages/pageManager';
import { login, logout } from '@helpers/helperFunctions';

test.describe('Checkout Tests - Standard Valid Flow', () => {

    let pm: PageManager;
    
    test.beforeEach('navigate to base url and login', async({ page }) => {
        pm = new PageManager(page);
        await login(pm);
    });

    test.afterEach('logout', async() => {
        await logout(pm);
    });
    
    test('Valid Checkout Flow - 1 item', async({}) => {

        await pm.onCartPage().addSingleItemToCart();
        await pm.onCartPage().proceedToCheckout();
        await pm.onCartPage().fillInPersonDetails();
        await pm.onCartPage().proceedToFinish();
        await pm.onCartPage().completeOrder();

    });

    test('Valid Checkout Flow - multiple items', async({}) => {
        // TO DO 

    });

});

test.describe('Checkout Tests - Negative Cases, Form Validations', () => {

    let pm: PageManager;
    
    test.beforeEach('navigate to base url and login', async({ page }) => {
        pm = new PageManager(page);
        await login(pm);
    });

    test.afterEach('logout', async() => {
        await logout(pm);
    });

    test('Checkout, validate Empty Fields', async({}) => {
        await pm.onCartPage().addSingleItemToCart();
        await pm.onCartPage().proceedToCheckout();
        await pm.onCartPage().validateEmptyInputFields();        
    });

    test('Checkout, validate Empty Lastname Field', async({}) => {
        await pm.onCartPage().addSingleItemToCart();
        await pm.onCartPage().proceedToCheckout();
        await pm.onCartPage().validateEmptyLastNameField();        
    });

    test('Checkout, validate Empty ZipCode Field', async({}) => {
        await pm.onCartPage().addSingleItemToCart();
        await pm.onCartPage().proceedToCheckout();
        await pm.onCartPage().validateEmptyZipCodeField();        
    });

    test('Checkout, validate form fields with invalid characters', async() => {
        // TODO
    });

});

test.describe('Checkout Tests - Negative Cases', () => {
    let pm: PageManager;
    
    test.beforeEach('navigate to base url and login', async({ page }) => {
        pm = new PageManager(page);
        await login(pm);
    });

    test.afterEach('logout', async() => {
        await logout(pm);
    });

     test('Checkout, Cancel checkout on first step', async({}) => {
        await pm.onCartPage().addSingleItemToCart();
        await pm.onCartPage().proceedToCheckout();
        // cancel
        await pm.onCartPage().cancelCheckout();
    });

    test('Checkout with empty cart', async({}) => {
        await pm.onCartPage().openCart();
        await pm.onCartPage().proceedToCheckout();
        // TODO - add some assertions here !!!
    });

    test('Checkout, browser back mid-checkout', async() => {
        // TODO
    });

    test('Chekcout, simulate session expiration mid-checkout', async() => {
        // TODO
    });

});

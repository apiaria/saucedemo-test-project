import { test } from '@playwright/test';
import { PageManager } from '@pages/pageManager';
import { login, logout } from '@helpers/helperFunctions';

test.describe('Cart Tests - Basic Functionality', () => {
    let pm: PageManager;
    
    test.beforeEach('navigate to base url and login', async({ page }) => {
        pm = new PageManager(page);
        await login(pm);
    });

    test.afterEach('logout', async() => {
        await logout(pm);
    });
   
    test('Add and Remove Single Item to Cart', async({}) => {
        await pm.onCartPage().addRemoveSingleItemToCart();
    });

    test('Add Multiple Items to Cart (2)', async({}) => {
        await pm.onCartPage().addRemoveMultipleItemsToCart(2);
    });

    test('Add to Cart and Remove From Cart All Items', async({}) => {
        await pm.onProductPage().addRemoveAllItemsToCart();
    });

    test('Cart Persists across navigation', async({}) => {
        await pm.onCartPage().validateCartPersistsAcrossNavigation();
    });

});

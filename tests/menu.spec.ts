import { test } from '@playwright/test';
import { PageManager } from '@pages/pageManager';
import { login, logout } from '@helpers/helperFunctions';
import { Common, Urls } from '@constants/testData';

test.describe('Burger Menu Tests - Basic Functionality', () => {
    
    let pm: PageManager;
    
    test.beforeEach('navigate to base url and login', async({ page }) => {
        pm = new PageManager(page);
        await login(pm);
    });

    test.afterEach('logout', async() => {
        await logout(pm);
    });

    test('Open and close burger menu', async({}) => {
        await pm.onBasePage().openBurgerMenu();
        await pm.onBasePage().closeBurgerMenu();
    });

    test('Verify Menu Items', async({}) => {
        await pm.onBasePage().assertMenuItems();
        await pm.onBasePage().closeBurgerMenu();
    });

    // Test is failing due to bug
    // marked as test.fail until bug is fixed
    test.fail('Verify All Items Link from Products page - correct navigation', async({}) => {
        await pm.onProductPage().validateAllProducts();
        await pm.onBasePage().validateAllItemsLink();
    });

    test('Verify All Items Link from Random product page - correct navigation', async({}) => {
        await pm.onProductPage().openRandomProduct();
        await pm.onBasePage().validateAllItemsLink();
    });

    test('Verify About - correct navigation' , async({}) => {
        await pm.onBasePage().validateAbout();
    });

    // Test is failing due to bug
    // marked as test.fail until bug is fixed
    test.fail('Validate Reset App State', async({}) => {
        await pm.onCartPage().validateResetState();
    });

});

test.describe('Burger Menu Tests - Logout and Access Validation', ()=> {
    let pm: PageManager;

    test('Test Logout From Burger Menu', async({page}) => {
        pm = new PageManager(page);

        // login
        await pm.onBasePage().navigateTo('/');
        await pm.onLoginPage().login(process.env.STANDARD_USER_USERNAME, process.env.PASSWORD);
        await pm.onBasePage().assertPageLoaded(Urls.INVENTORY_URL);
        // open menu and click logout
        await pm.onBasePage().openBurgerMenu();
        await pm.onBasePage().clickElementByName(Common.LOGOUT_TXT);
        // assert redirect to login page       
        await pm.onLoginPage().assertOnLoginPage();
    });

    test('Verify Burger Menu is not accessible if not logged in', async({page}) => {
        pm = new PageManager(page);

        await pm.onBasePage().navigateTo('/');
        await pm.onBasePage().assertMenuVisibility(false);

        await pm.onLoginPage().login(process.env.STANDARD_USER_USERNAME, process.env.PASSWORD);
        await pm.onBasePage().assertPageLoaded(Urls.INVENTORY_URL);

        await pm.onBasePage().assertMenuVisibility(true);

        await pm.onLoginPage().logout();

    });

});

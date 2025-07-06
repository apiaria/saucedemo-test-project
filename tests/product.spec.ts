import { test } from '@playwright/test'
import { PageManager } from '@pages/pageManager';
import { login, logout } from '@helpers/helperFunctions';

test.describe('Products Tests - Products List' , () =>{

    let pm: PageManager;
    
    test.beforeEach('navigate to base url and perform login', async({ page }) => {
        pm = new PageManager(page);
        await login(pm);
    });

    test.afterEach('logout', async() => {
        await logout(pm);
    });
    
    test('Validate All Products', async({}) => {
        await pm.onProductPage().validateInventoryHeader();
        await pm.onProductPage().validateAllProducts();
    });

    // TODO - add more test cases for products list

});

test.describe('Products Tests - Single Product Page', () => {

    let pm: PageManager;
    
    test.beforeEach('navigate to base url and login', async({ page }) => {
        pm = new PageManager(page);
        await login(pm);
    });

    test.afterEach('logout', async() => {
        await logout(pm);
    });

    test('Select Random Product from the list and open it', async({}) => {
        // Open a randomly selected product and validate it is the same product and data matches selected product       
        await pm.onProductPage().openRandomProduct();
        await pm.onProductPage().validateProductHeader();

        // TODO - verify with different users!!

    }); 

    test('Open a non existing product', async() => {
        // TODO 
    });

});

test.describe('Products Tests - Products Sorting', () => {

    let pm: PageManager;
    
    test.beforeEach('navigate to base url and login', async({ page }) => {
        pm = new PageManager(page);
        await login(pm);
    });

    test.afterEach('logout', async() => {
        await logout(pm);
    });

    // Sorting Products by Name or Price, Asc/Desc
    [
        { sortOption: 'Name (A to Z)', sortBy: 'name' , sortOrder: 'asc' },
        { sortOption: 'Name (Z to A)', sortBy: 'name' , sortOrder: 'desc' },
        { sortOption: 'Price (Low to High)', sortBy: 'price' , sortOrder: 'asc' },
        { sortOption: 'Price (High to Low)', sortBy: 'price' , sortOrder: 'desc' }
    ].forEach(({sortOption, sortBy, sortOrder}) => {
        test(` Validate sorting of products by ${sortOption}` , async({}) => {
        
            await pm.onProductPage().validateAllProducts();
            await pm.onProductPage().validateProductsSorting(sortBy, sortOrder);
        })
    });

});

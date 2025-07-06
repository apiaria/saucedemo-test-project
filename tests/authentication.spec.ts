import { test, expect } from '@playwright/test';
import { ErrorMessages, Urls } from '@constants/testData';
import { PageManager } from '@pages/pageManager';


test.describe('Authentication tests - Login with Valid Users', () => {
    let pm: PageManager;
        
    test.beforeEach('navigate to Base Url 1', async ({ page }) => {
        pm = new PageManager(page);
        await pm.onBasePage().navigateTo('/');
    });

    [
        { username: process.env.STANDARD_USER_USERNAME, password: process.env.PASSWORD},
        { username: process.env.PROBLEM_USER_USERNAME, password: process.env.PASSWORD},
        { username: process.env.ERROR_USER_USERNAME, password: process.env.PASSWORD},
        { username: process.env.VISUAL_USER_USERNAME, password: process.env.PASSWORD}
    ].forEach(({username, password}) => {
        test(` Successful Login with ${username} and correct password`, async({}) => {
            await pm.onLoginPage().login(username, password);

            // verify login 
            await pm.onBasePage().assertPageLoaded(Urls.INVENTORY_URL);       
            await pm.onBasePage().assertHeader();
            await pm.onBasePage().assertFooter();

            // logout
            await pm.onLoginPage().logout();
        })
    });

    // Login with performance user - with some delay but still successful
    test('Successful Login with Perfomance user - with delay, but logs in', async() => {
        const start = Date.now();
        await pm.onLoginPage().login(process.env.PERFORMANCE_USER_USERNAME, process.env.PASSWORD);
        
        // verify login 
        await pm.onBasePage().assertPageLoaded(Urls.INVENTORY_URL);
        await pm.onBasePage().assertHeader();
        await pm.onBasePage().assertFooter();

        // record the time for fully loading the page
        const end = Date.now();
        expect(end-start).toBeLessThan(10000);

        // logout
        await pm.onLoginPage().logout();
    });

    // Attempt to login with locked user - should show error
    test('Unsuccessful login with Locked User and standard password', async() =>{
        await pm.onLoginPage().login(process.env.LOCKED_USER_USERNAME, process.env.PASSWORD);

        // assert error
        await pm.onLoginPage().assertFailedLogin(ErrorMessages.LOCKED_OUT);
    });

});

test.describe('Authentication tests - Login: Negative Cases', () => {

    let pm: PageManager;
        
    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page);
        await pm.onBasePage().navigateTo('/');
    });
    
    const whiteSpacesName = ` ${process.env.STANDARD_USER_USERNAME}`;
    const whiteSpacePswd = ` ${process.env.PASSWORD}`;
    const emptyUsername = '';
    const emptyPassword = '';
    const specialCharsUsername = ' !@#&$^*()';
    const wrongName = "wrongName98639674398";
    const wrongPassword = 'wrongPassword418249218401';
    const caseSensitiveUsername = process.env.STANDARD_USER_USERNAME.toUpperCase();
    const caseSensitivePassword = process.env.PASSWORD.toUpperCase();  

    // Login - negative cases
    [
        { testCase: 'Wrong username', username: wrongName, password: process.env.PASSWORD, errorMsg: ErrorMessages.WRONG_CREDENTIALS},
        { testCase: 'Wrong password', username: process.env.STANDARD_USER_USERNAME, password: wrongPassword, errorMsg: ErrorMessages.WRONG_CREDENTIALS},
        { testCase: 'Wrong username and password', username: wrongName, password: wrongPassword, errorMsg: ErrorMessages.WRONG_CREDENTIALS},        
        { testCase: 'Empty username and password', username: emptyUsername, password: emptyPassword, errorMsg: ErrorMessages.MISSING_USERNAME},
        { testCase: 'Empty username', username: emptyUsername, password: process.env.PASSWORD, errorMsg: ErrorMessages.MISSING_USERNAME},
        { testCase: 'Empty password', username: process.env.STANDARD_USER_USERNAME, password: emptyPassword, errorMsg: ErrorMessages.MISSING_PASSWORD},
        { testCase: 'Case sensitive username', username: caseSensitiveUsername, password: process.env.PASSWORD, errorMsg: ErrorMessages.WRONG_CREDENTIALS},
        { testCase: 'Case sensitive password', username: process.env.STANDARD_USER_USERNAME , password: caseSensitivePassword, errorMsg: ErrorMessages.WRONG_CREDENTIALS },
        { testCase: 'Username with whitespaces', username: whiteSpacesName, password: process.env.PASSWORD, errorMsg: ErrorMessages.WRONG_CREDENTIALS},
        { testCase: 'Password with whitespaces', username: process.env.STANDARD_USER_USERNAME, password: whiteSpacePswd, errorMsg: ErrorMessages.WRONG_CREDENTIALS},
        { testCase: 'Username with special chars', username: specialCharsUsername, password: process.env.PASSWORD, errorMsg: ErrorMessages.WRONG_CREDENTIALS} 
    ].forEach(({testCase, username, password, errorMsg}) => {
        test(` Unsuccessful Login with ${testCase} `, async({}) => {
            await pm.onLoginPage().login(username, password);

            // assert error
            await pm.onLoginPage().assertFailedLogin(errorMsg);
        })
    });

});

test.describe('Authentication tests - Security checks', () => {
    let pm: PageManager;
        
    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page);
        await pm.onBasePage().navigateTo('/');
    });

    /**
     * Ensure inside pages cannot be accessed without authentication and user is redirected to login
     */
    [
        { targetUrl: Urls.INVENTORY_URL, errorMsg: ErrorMessages.NO_ACCESS_INVENTORY },
        { targetUrl: Urls.CART_URL, errorMsg: ErrorMessages.NO_ACCESS_CART },
        { targetUrl: Urls.CHECKOUT_STEP1_URL, errorMsg: ErrorMessages.NO_ACCESS_CHECKOUT_STEP1 },
        { targetUrl: Urls.CHECKOUT_STEP2_URL, errorMsg: ErrorMessages.NO_ACCESS_CHECKOUT_STEP2 },
        { targetUrl: Urls.CHECKOUT_COMPLETE_URL, errorMsg: ErrorMessages.NO_ACCESS_CHECKOUT_COMPLETE }
    ].forEach(({targetUrl, errorMsg}) => {
        test(` Validate user does not have access to ${process.env.BASE_URL}${targetUrl} if not logged in` , async({}) => {
            await pm.onLoginPage().validatePageAccess(targetUrl, errorMsg);
        })
    });

});

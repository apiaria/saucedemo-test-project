import { Page, Locator, expect } from '@playwright/test';
import { loginPageLocators as locators } from '@locators/loginLocators';
import { BasePage } from '@pages/basePage';
import { Common } from '@constants/testData';

export class LoginPage extends BasePage {

    private readonly userInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.userInput = page.locator(locators.usernameInput)
        this.passwordInput = page.locator(locators.passwordInput);
        this.loginButton = page.locator(locators.loginButton);
        this.errorMessage = page.locator(locators.errorMessage);
    }    

    /**
     * Login Function with username and password
     * @param username - username
     * @param password - password
     */
    async login(username: string, password: string) {
        await this.assertOnLoginPage();
        await this.userInput.click();
        await this.userInput.fill(username);
        await this.passwordInput.click();
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
    
    async assertOnLoginPage() {
        await expect(this.page).toHaveURL('/');
        await expect(this.page).toHaveTitle(Common.HEADER_TITLE);
        await expect(this.loginButton).toBeVisible();
    }

    /**
     * Function to validate error message for not successful login
     * @param reason - provided error message to validate
     */
    async assertFailedLogin(reason: string) {        
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText(reason);
    }

    /**
     * Validate special pages cannot be accessed if not logged in and user is redirected to login page with the corresponding error message
     * @param targetUrl - url to be accessed
     * @param reason - error message displayed
     */
    async validatePageAccess(targetUrl: string, reason: string) {
        await this.navigateTo(targetUrl);
        await this.assertOnLoginPage();
        await this.assertFailedLogin(reason);        
    }

    /**
     * Logout - check first if the burger menu is already open, before clicking logout button
     */
    async logout() {
        // Check first if the burger menu is already open
        const isTheMenuOpen = await this.isMenuOpen();

        if(!isTheMenuOpen) {
            // the menu is closed, so open it first
            await this.clickElementByName(Common.OPEN_MENU_TXT);
        }
        
        // click the Logout button
        await this.clickElementByName(Common.LOGOUT_TXT);

        // assert redirect to login page
        await this.assertOnLoginPage();
    }
}

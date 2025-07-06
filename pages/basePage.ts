import { Page, Locator, expect } from '@playwright/test';
import { basePageLocators as locators } from '@locators/baseLocators';
import { Common, Urls } from '@constants/testData';

export class BasePage {
    
    readonly page: Page;
    private readonly openBurgerMenuBtn: Locator;
    private readonly closeBurgerMenuBtn: Locator;
    private readonly headerLabel: Locator;
    private readonly cartButton: Locator;
    private readonly cartBadge: Locator;
    private readonly footerTwitterLink: Locator;
    private readonly footerFbLink: Locator;
    private readonly footerLdLink: Locator;
    private readonly footerCopyRight: Locator;
    private readonly logoutButton: Locator;
    private readonly allItemsLink: Locator;
    private readonly aboutLink: Locator;
    private readonly resetAppState: Locator;
    private readonly menuWrap: string;
    private readonly secondaryHeader: Locator;

    constructor(page:Page) {
        this.page = page;
        this.openBurgerMenuBtn = page.getByRole('button', { name: Common.OPEN_MENU_TXT });
        this.closeBurgerMenuBtn = page.getByRole('button', { name: Common.CLOSE_MENU_TXT });
        this.menuWrap = locators.menuWrap;
        this.headerLabel = page.locator(locators.headersLabel);
        this.footerTwitterLink = page.locator(locators.footerTwitterLink);
        this.footerFbLink = page.locator(locators.footerFbLink);
        this.footerLdLink = page.locator(locators.footerLdLink);
        this.footerCopyRight = page.locator(locators.footerCopyRight);
        this.logoutButton = page.locator(locators.logoutButton);
        this.allItemsLink = page.locator(locators.allItemsLink);
        this.aboutLink = page.locator(locators.aboutLink);
        this.resetAppState = page.locator(locators.resetAppState);
        this.cartButton = page.locator(locators.shoppingCartButton);
        this.cartBadge = page.locator(locators.shoppingCartBadge);
        this.secondaryHeader = page.locator(locators.secondaryHeader);
    }

    /**
     * Navigate to provided url
     * @param url - url where to navigate to
     */
    async navigateTo(url: string) { 
        await this.page.goto(url, { waitUntil: 'load' });
    }
    
    /**
     * Validation for page load
     * @param url - url of the page to validate
     */
    async assertPageLoaded(url: string) {
        await expect(this.page).toHaveURL(url);
    }

    /**
     * Function to check if the burger menu is already open
     * @returns true for opened/false for closed
     */
    async isMenuOpen(): Promise<boolean> {
        const menuWrap = this.page.locator(this.menuWrap);
        const ariaHidden = await menuWrap.getAttribute('aria-hidden');
        // return the boolean value, as the attribute is a string
        return ariaHidden === 'false';
    }

    /**
     * Wait for burger menu - to be closed or opened
     * @param state - expected state: true for opened; false for closed
     * @param timeout - timeout so that aria-hidden attribute can change after clicking open/close button
     */
    async waitForMenuState(state: boolean, timeout = 2000): Promise<void> {
        // if state is true -> menu should be opened; if false -> menu should be closed;
        const expected = state ? 'false' : 'true';
        const locator = this.page.locator(this.menuWrap);

        await expect(locator).toHaveAttribute('aria-hidden', expected, { timeout });
    }

    /**
     * Assert burger menu visibility
     * @param visible - true for visible/ false for hidden
     */
    async assertMenuVisibility(visible: boolean) {
        if (visible) {
            await expect(this.openBurgerMenuBtn).toBeVisible();
        } else {
            await expect(this.openBurgerMenuBtn).toBeHidden();
        }
    }

    async openBurgerMenu() {
        expect(await this.isMenuOpen()).toBe(false);
        // click button and open the menu   
        await this.clickElementByName(Common.OPEN_MENU_TXT);
        await this.waitForMenuState(true); // wait until menu is opened
    }

    async closeBurgerMenu() {  
        expect(await this.isMenuOpen()).toBe(true);
        // click button to close it
        await this.clickElementByName(Common.CLOSE_MENU_TXT);
        await this.waitForMenuState(false); // wait until cit is closed        
    }   

    /**
     * Assert items in Burger Menu - existent and visible
     */
    async assertMenuItems() {
        // open burger menu
        await this.openBurgerMenu();
        // verify menu items exist and are visible
        await expect(this.allItemsLink).toBeVisible();
        await expect(this.allItemsLink).toHaveText(Common.ALL_ITEMS_TXT);
        await expect(this.aboutLink).toBeVisible();
        await expect(this.aboutLink).toHaveText(Common.ABOUT_TXT);
        await expect(this.logoutButton).toBeVisible();
        await expect(this.logoutButton).toHaveText(Common.LOGOUT_TXT);
        await expect(this.resetAppState).toBeVisible();
        await expect(this.resetAppState).toHaveText(Common.RESET_APP_STATE_TXT);
    }

    /**
     * Validate About link from Burger Menu
     */
    async validateAbout() {
        await this.openBurgerMenu();
        await expect(this.aboutLink).toBeVisible();
        await this.clickElementByName(Common.ABOUT_TXT);
        await this.assertPageLoaded(Urls.ABOUT_URL);
        // navigate back to products page
        await this.page.goBack();
        await this.assertPageLoaded(Urls.INVENTORY_URL);
    }

    /**
     * Validate All Items link from Burger Menu - expected to redirect to Inventory page regardless of current location and to close the menu
     */
    async validateAllItemsLink() {        
        await this.openBurgerMenu();
        await expect(this.allItemsLink).toBeVisible();
        await this.clickElementByName(Common.ALL_ITEMS_TXT);
        await this.assertPageLoaded(Urls.INVENTORY_URL);
        expect(await this.isMenuOpen()).toBe(false);
    }

    /**
     * Reset App State - validation in Cart Page!
     */
    async resetState() {
        await this.openBurgerMenu();
        await expect(this.resetAppState).toBeVisible();
        await this.clickElementByName(Common.RESET_APP_STATE_TXT);    
    }

    async assertHeader() {
        await expect(this.headerLabel).toBeVisible();
        await expect(this.headerLabel).toHaveText(Common.HEADER_TITLE); 
        expect(await this.isMenuOpen()).toBe(false);
        await expect(this.cartButton).toBeVisible();     
    }

    /**
     * Assert Page title - second header
     * @param title - expected title for the corresponsing page
     */
    async assertSecondaryHeader(title: string) {
        await this.secondaryHeader.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.secondaryHeader).toHaveText(title);
    }


    async assertFooter() {
        await expect(this.footerFbLink).toBeEnabled();
        await expect(this.footerLdLink).toBeEnabled();
        await expect(this.footerTwitterLink).toBeEnabled();
        await expect(this.footerCopyRight).toBeVisible();
        await expect(this.footerCopyRight).toContainText(Common.FOOTER_COPY_RIGHT_TEXT);
    }

    /**
     * Cick element by name - button or link
     * @param name - name to map the corresponding locator
    */
    async clickElementByName(name: string): Promise<void> {

        const elements = {
            [Common.OPEN_MENU_TXT]: this.openBurgerMenuBtn,
            [Common.CLOSE_MENU_TXT]: this.closeBurgerMenuBtn,
            [Common.LOGOUT_TXT]: this.logoutButton,
            [Common.CART_TXT]: this.cartButton,
            [Common.TWITTER]: this.footerTwitterLink,
            [Common.FACEBOOK]: this.footerFbLink,
            [Common.LINKEDIN]: this.footerLdLink,
            [Common.ALL_ITEMS_TXT]: this.allItemsLink,
            [Common.ABOUT_TXT]: this.aboutLink,
            [Common.RESET_APP_STATE_TXT]: this.resetAppState
        };
       
        const locator = elements[name];

        if (!locator) {
            throw new Error(`No locator found for name: "${name}"`);
        }

        await locator.click({timeout: 2000});
    }

    /**
     * Validate Cart Badge
     * @param expected - the expected value that should be shown in the badge
     */
    async validateCartBadge(expected: string) {
        await expect(this.cartBadge).toBeVisible();
        await expect(this.cartBadge).toHaveText(expected);
    }

    /**
     * Check if the shopping cart badge is visible or hidden
     * @param isHidden - true for visible and false for hidden
     */
    async validateCartBadgeVisibility(isHidden: boolean) {
        if (isHidden) {
            await expect(this.cartBadge).toBeVisible();
        } else {
            await expect(this.cartBadge).toBeHidden();
        }
    }

}

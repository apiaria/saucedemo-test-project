import { Page, Locator, expect } from '@playwright/test';
import { cartPageLocators as locators } from '@locators/cartLocators';
import { Cart, Checkout, Common, ErrorMessages, Inventory, Urls } from '@constants/testData';
import { ProductPage } from '@pages/productPage';
import { BasePage } from '@pages/basePage';

export class CartPage extends BasePage {

    private readonly cartItem: Locator;
    private readonly cartItemName: string;
    private readonly cartItemDesc: string;
    private readonly cartItemPrice: string;
    private readonly removeButton: Locator;
    private readonly checkoutButton: Locator;
    private readonly continueShoppingButton: Locator;
    private readonly productPage: ProductPage;
    private readonly cancelButton: Locator;
    private readonly continueButton: Locator;
    private readonly firstNameInputField: Locator;
    private readonly lastNameInputField: Locator;
    private readonly zipCodeInputField: Locator;
    private readonly finishButton: Locator;
    private readonly backToHomeBtn: Locator;
    private readonly completeHeader: Locator;
    private readonly errorButton: Locator;
    private readonly errorMsg: Locator;
    
    constructor(page: Page) {
        super(page);
        this.cartItem = page.locator(locators.cartItem);
        this.cartItemName = locators.cartItemName;
        this.cartItemDesc = locators.cartItemDesc;
        this.cartItemPrice = locators.cartItemPrice;
        this.removeButton = page.locator(locators.removeButton);
        this.checkoutButton = page.locator(locators.checkoutButton);
        this.continueShoppingButton = page.locator(locators.continueShoppingButton);
        this.productPage = new ProductPage(page);
        this.cancelButton = page.locator(locators.cancelButton);
        this.continueButton = page.locator(locators.continueButton);
        this.firstNameInputField = page.locator(locators.firstNameInput);
        this.lastNameInputField = page.locator(locators.lastNameInput);
        this.zipCodeInputField = page.locator(locators.zipCodeInput);
        this.finishButton = page.locator(locators.finishButton);
        this.backToHomeBtn = page.locator(locators.backToHomeBtn);
        this.completeHeader = page.locator(locators.completeHeader);
        this.errorButton = page.locator(locators.errorButton);
        this.errorMsg = page.locator(locators.errorMsg);
    }

    async openCart() {
        await this.clickElementByName(Common.CART_TXT);
        await this.assertPageLoaded(Urls.CART_URL);
        await this.assertSecondaryHeader(Cart.CART_TITLE);
        await expect(this.checkoutButton).toBeVisible();
        await expect(this.checkoutButton).toBeEnabled();
        await expect(this.continueShoppingButton).toBeVisible();
    }

    async addSingleItemToCart() {
        const product = await this.productPage.getRandomProduct();  

        await product.addToCartButton.click();

        await this.validateProductAddedToCart(product);
    }

    async validateProductAddedToCart(product) {
        const productTitle = await product.name.innerText();
        const productDesc = await product.description.innerText();
        const productPrice = await product.price.innerText();

        // await this.validateCartBadge('1');

        await this.openCart();

        const cartItem = this.page.locator('.cart_item', {
            hasText: productTitle
        });

        await expect(cartItem.locator(this.cartItemName)).toHaveText(productTitle);
        await expect(cartItem.locator(this.cartItemDesc)).toHaveText(productDesc);
        await expect(cartItem.locator(this.cartItemPrice)).toHaveText(productPrice);
        await expect(cartItem.locator('button')).toHaveText(Inventory.REMOVE_TXT);

    }

    async removeSingleItemFromCart() {
        // unclick the button to return to initial state
        await this.removeButton.click();
        await this.validateCartBadgeVisibility(false);

        await expect(this.cartItem).toHaveCount(0);
    }

    async addRemoveSingleItemToCart() { 
        await this.addSingleItemToCart();
        await this.validateCartBadge('1');
        await this.removeSingleItemFromCart();
        await this.validateCartBadgeVisibility(false);              
    }

    /**
     * Add Multiple Items to Cart
     * @param amount - number of items to add
     */
    async addMultipleItemsToCart(amount: number) {
        for (let i = 0; i < amount; i++){
            await this.addSingleItemToCart();
            await this.validateCartBadge((i+1).toString());
        }
    }

    /**
     * Remove multiple items from cart
     * @param amount - number of items to remove
     */
    async removeMultipleItemsFromCart(amount: number) {
        const removeButtons = this.removeButton;
        await expect(removeButtons).toHaveCount(amount);

        // Unclick (remove from cart)
        for (let i = 0; i < amount; i++) {
            await removeButtons.nth(0).click();
        }
    }

    /**
     * Combined method to add and remove multiple items to cart
     * @param amount - the number of items
     */
    async addRemoveMultipleItemsToCart(amount: number) {
        await this.addMultipleItemsToCart(amount);
        await this.removeMultipleItemsFromCart(amount);
        await this.validateCartBadgeVisibility(false);
    }

    async validateCartPersistsAcrossNavigation() {
        const product = await this.productPage.getRandomProduct();

        const productTitle = await product.name.innerText();
        const productDesc = await product.description.innerText();
        const productPrice = await product.price.innerText();

        await product.addToCartButton.click();

        await this.validateCartBadge('1');

        await this.openCart();

        // validate product in cart
        await expect(this.page.locator(this.cartItemName)).toHaveText(productTitle);
        await expect(this.page.locator(this.cartItemDesc)).toHaveText(productDesc);
        await expect(this.page.locator(this.cartItemPrice)).toHaveText(productPrice);
        await expect(this.removeButton).toBeEnabled();

        await this.continueShopping();
        await this.validateCartBadge('1'); 

        await this.openCart();
        await expect(this.page.locator(this.cartItemName)).toHaveText(productTitle);
        await expect(this.page.locator(this.cartItemDesc)).toHaveText(productDesc);
        await expect(this.page.locator(this.cartItemPrice)).toHaveText(productPrice);
        await expect(this.removeButton).toBeEnabled();
    }

    async validateResetState() {
        const product = await this.productPage.getRandomProduct();

        await product.addToCartButton.click();

        await this.validateProductAddedToCart(product);

        await this.validateCartBadge('1');

        await this.resetState();

        await this.validateCartBadgeVisibility(false);

        // expect menu to be closed
        expect.soft(await this.isMenuOpen()).toBe(false);
        // expect cart to be cleared
        await expect.soft(this.cartItem).toHaveCount(0);
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
        await this.productPage.validateInventoryHeader();
    }

    // CHECKOUT LOGIC
    async proceedToCheckout() {
        await expect(this.checkoutButton).toBeEnabled();
        await this.checkoutButton.click();
        await this.assertSecondaryHeader(Checkout.CHECKOUT_TITLE);
        await expect(this.cancelButton).toBeEnabled();
        await expect(this.continueButton).toBeEnabled();
        await expect(this.firstNameInputField).toBeEnabled();
        await expect(this.lastNameInputField).toBeEnabled();
        await expect(this.zipCodeInputField).toBeEnabled();
    }

    async fillInPersonDetails() {
        await this.firstNameInputField.click();
        await this.firstNameInputField.fill(Checkout.FIRST_NAME);
        await this.lastNameInputField.click();
        await this.lastNameInputField.fill(Checkout.LAST_NAME);
        await this.zipCodeInputField.click();
        await this.zipCodeInputField.fill(Checkout.ZIP_CODE);        
    }

    async proceedToFinish() {
        await this.continueButton.click();
        await this.assertSecondaryHeader(Checkout.CHECKOUT_OVERVIEW_TITLE);
        await expect(this.finishButton).toBeEnabled();
        await expect(this.cancelButton).toBeEnabled();
        // TODO - verify product details
    }

    async completeOrder() {
        await this.finishButton.click();
        await this.assertSecondaryHeader(Checkout.CHECKOUT_COMPLETE_TITLE);
        await expect(this.completeHeader).toHaveText(Checkout.COMPLETE_HEADER_TXT);
        await expect(this.backToHomeBtn).toBeEnabled();
    }

    async validateEmptyInputFields() {
        await this.continueButton.click();
        await expect(this.errorButton).toBeVisible();
        await expect(this.errorMsg).toHaveText(ErrorMessages.WRONG_FIRST_NAME);
    }

    async validateEmptyLastNameField() {
        await this.firstNameInputField.click();
        await this.firstNameInputField.fill(Checkout.FIRST_NAME);
        await this.continueButton.click();
        await expect(this.errorButton).toBeVisible();
        await expect(this.errorMsg).toHaveText(ErrorMessages.WRONG_LAST_NAME);
    }

    async validateEmptyZipCodeField() {
        await this.firstNameInputField.click();
        await this.firstNameInputField.fill(Checkout.FIRST_NAME);
        await this.lastNameInputField.click();
        await this.lastNameInputField.fill(Checkout.LAST_NAME);
        await this.continueButton.click();
        await expect(this.errorButton).toBeVisible();
        await expect(this.errorMsg).toHaveText(ErrorMessages.WRONG_ZIP_CODE);
    }

    async validateWrongFields() {
        // TODO
    }

    async cancelCheckout() {
        await this.cancelButton.click();
        // TODO
        // assert user is back to cart
        // assert product is still there
    }

}

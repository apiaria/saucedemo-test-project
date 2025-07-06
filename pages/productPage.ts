import { Page, Locator, expect } from '@playwright/test'
import { productPageLocators as locators } from '@locators/productLocators' 
import { BasePage } from '@pages/basePage';
import { Inventory, Urls } from '@constants/testData';

export class ProductPage extends BasePage {
    private readonly sortContainer: Locator;
    private readonly addToCartButton: string;
    private readonly removeFromCartButton: string;
    private readonly backToProductsButton: Locator;
    private readonly inventoryContainer: Locator;
    private readonly inventoryItems: string;
    private readonly inventoryName: string;
    private readonly inventoryDesc: string;
    private readonly inventoryPrice: string;
    private readonly productName: string;
    private readonly productDesc: string;
    private readonly productPrice: string;

    constructor(page: Page) {
       super(page);
       this.sortContainer = page.locator(locators.sortContainer);
       this.addToCartButton = locators.addToCartButton;
       this.removeFromCartButton = locators.removeFromCartButton;
       this.backToProductsButton = page.locator(locators.backToProductsButton);
       this.inventoryContainer = page.locator(locators.inventoryContainer);
       this.inventoryItems = locators.inventoryItems;
       this.inventoryName = locators.inventoryNameLocator;
       this.inventoryDesc = locators.inventoryDescriptionLocator;
       this.inventoryPrice = locators.inventoryPriceLocator;
       this.productName = locators.productNameLocator;
       this.productDesc = locators.productDescriptionLocator;
       this.productPrice = locators.productPriceLocator;
    }

    /**
    * Validate Inventory (Products) Page Header - title and sort container
    */
    async validateInventoryHeader(): Promise<void> {
        await this.assertSecondaryHeader(Inventory.INVENTORY_TITLE);
        
        await expect(this.sortContainer).toBeVisible();        
        const options = await this.sortContainer.locator('option').allTextContents();
        expect(options).toEqual(Inventory.sortOptions);
    }

    /**
    * Validate Single Product Page Header - no title, no sort container, only Back to Products button
    */
    async validateProductHeader(): Promise<void> {        
        await expect(this.backToProductsButton).toBeVisible();
        await expect(this.sortContainer).not.toBeVisible();
    }

    async ensureInventoryPageReady(): Promise<void> {
        const currentUrl = this.page.url();

        // If not already on the inventory page, try navigating there
        if (!currentUrl.includes(Urls.INVENTORY_URL)) {
            await this.page.goto(Urls.INVENTORY_URL, { waitUntil: 'domcontentloaded' });

            // Ensure the redirect was successful
            await expect(this.page).toHaveURL(Urls.INVENTORY_URL, {
            timeout: 5000
            });
        }

        // Wait for the inventory container to become visible
        await this.inventoryContainer.waitFor({ state: 'visible', timeout: 10000 });

        // Optional sanity check: Make sure items actually rendered
        const productCount = await this.page.locator(this.inventoryItems).count();
        expect(productCount).toBeGreaterThan(0);
    }

    /**
     * Get All Products
     * @returns all products on Products page
    */
    async getAllProducts(): Promise<Locator[]> {        
        await this.ensureInventoryPageReady();
        const count = await this.page.locator(this.inventoryItems).count();

        const products: Locator[] = [];
        for (let i = 0; i < count; i++) {
            products.push(this.page.locator(this.inventoryItems).nth(i));
        }
        
        expect(products.length).toBeGreaterThan(0);
        return products;        
    }

    /**
     * Validate All Products on page - have name, desc, price and button Add To Cart
     */
    async validateAllProducts(): Promise<void> {
        const products = await this.getAllProducts();
        const productNames: string[] = [];

        for (const product of products) {
            const nameLocator = product.locator(this.inventoryName);
            await expect(nameLocator).not.toBeEmpty();
            
            // collect names for duplication check
            const name = await nameLocator.textContent();
            if (name) productNames.push(name.trim());
            
            await expect(product.locator(this.inventoryDesc)).not.toBeEmpty();
            await expect(product.locator(this.inventoryPrice)).toHaveText(/\$\d+\.\d{2}/);
            await expect(product.locator(this.addToCartButton)).toBeVisible();

            // check for picture
            const img = product.locator('img');
            await expect(img).toBeVisible();

            const src = await img.getAttribute('src');
            if(!src) throw new Error('Image src not found!');
        }

        // Check for duplicate product names
        const nameSet = new Set(productNames);
        if (nameSet.size !== productNames.length) {
            throw new Error('Duplicate product names found on the page!');
        }
    }

    /**
     * Select Random Product
     * @returns randomly selected 1 product from all on the page
     */
    async getRandomProduct() {
        const products = await this.getAllProducts();
        const randomIndex = Math.floor(Math.random() * products.length);
        const selectedProduct = products[randomIndex];

        return {
            product: selectedProduct,
            name: selectedProduct.locator(this.inventoryName),
            description: selectedProduct.locator(this.inventoryDesc),
            price: selectedProduct.locator(this.inventoryPrice) ,
            img: selectedProduct.locator('img'),
            href: selectedProduct.locator(`${this.inventoryName} >> xpath=..`).getAttribute('id'),
            addToCartButton: selectedProduct.locator(this.addToCartButton),
            data: {
                nameTxt: selectedProduct.locator(this.inventoryName).innerText(),
                descTxt:  selectedProduct.locator(this.inventoryDesc).innerText(),
                priceTxt: selectedProduct.locator(this.inventoryPrice).innerText()
            }
        };        
    }

    /**
     * Open a randomly selected product and go to its Product page
     * Validate it is the correct product
     */
    async openRandomProduct(): Promise<void> {
        const product = await this.getRandomProduct();

        const productTitle = await product.data.nameTxt;
        const productDesc = await product.data.descTxt;
        const productPrice = await product.data.priceTxt;
        // extract product Id
        const href = await product.href
        const matchId = href?.match(/_(\d+)_/);
        const productId = matchId?.[1];
        
        // extract img src
        const productImg = product.img;
        const productSrc = await productImg.getAttribute('src');

        // click the product and go to product page
        await product.name.click();

        // verify correct URL
        await this.assertPageLoaded(`${Urls.PRODUCT_URL}${productId}`);

        // verify it is the same data
        await expect.soft(this.page.locator(this.productName)).toHaveText(productTitle);
        await expect.soft(this.page.locator(this.productDesc)).toHaveText(productDesc);
        await expect.soft(this.page.locator(this.productPrice)).toHaveText(productPrice);
        
        // compare image src
        const img = this.page.locator('.inventory_details_img');
        await expect.soft(img).toBeVisible();

        const src = await img.getAttribute('src');
        if(!src) throw new Error('Image src not found!');

        expect(src).toBe(productSrc);
    }

    async validateItemNotFound() {
        const nonExistingId = 9999;
        await this.navigateTo(`${Urls.PRODUCT_URL}${nonExistingId}`);
        await this.assertPageLoaded(`${Urls.PRODUCT_URL}${nonExistingId}`);
        expect.soft(this.page.locator(this.productName)).toHaveText(Inventory.ITEM_NOT_FOUND_TXT);
        expect.soft(this.page.locator(this.productDesc)).not.toBeVisible();
        expect.soft(this.page.locator(this.productPrice)).not.toBeVisible();
        expect.soft(this.page.locator(this.addToCartButton)).not.toBeEnabled();
    }
    
    /**
     * Sorting Function
     * @param sortBy - indicates what param to sort by - name or price
     * @param order - indicates the order of sorting - ascendig or descending
     */
    async validateProductsSorting(sortBy: string, order: string): Promise<void> {
        // check for the valid input params 
        const validOptions = Object.keys(Inventory.sortOptionMap);
        const validOrder = Object.keys(Inventory.sortOptionMap[validOptions[0]]);
        const sortOption = sortBy.toLowerCase();
        const sortOrder = order.toLowerCase();

        if (!validOptions.includes(sortOption) || !validOrder.includes(sortOrder)){
            throw new Error(`Invalid Input Params! Expected "${sortBy}" to be name or price and "${order}" to be asc or desc!`); 
        }

        // choose the desired option from the dropdown menu
        await this.sortContainer.selectOption(Inventory.sortOptionMap[sortOption][sortOrder]);

        if (sortOption === 'name') {
            const names = await this.page.locator(this.inventoryName).allTextContents();
            const expected = [...names].sort((a, b) =>
                sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
            );
            expect(names).toEqual(expected);

        } else if(sortOption === 'price') {
            const prices = await this.page.locator(this.inventoryPrice).allTextContents();
            const numbers = prices.map(p => parseFloat(p.replace('$', '')));
            const expected = [...numbers].sort((a, b) =>
                sortOrder === 'asc' ? a - b : b - a
            );
            expect(numbers).toEqual(expected);
        } 
    }

    async addRemoveAllItemsToCart(): Promise<void> {
        // Select all "Add to cart" buttons
        const addButtons = this.page.locator(this.addToCartButton);
        const count = await addButtons.count();

        // Click each "Add to cart" button and verify cart badge shows the correct number
        for (let i = 0; i < count; i++) {
            await addButtons.nth(0).click();
            await this.validateCartBadge((i+1).toString());
        }

        await this.validateCartBadge(count.toString());

        // Verify buttons changed to "Remove"
        const removeButtons = this.page.locator(this.removeFromCartButton);
        await expect(removeButtons).toHaveCount(count);

        // Unclick (remove from cart)
        for (let i = 0; i < count; i++) {
            await removeButtons.nth(0).click();
        }

        // Final check: all buttons back to "Add to cart" and cart badge hidden
        await expect(this.page.locator(this.addToCartButton)).toHaveCount(count);
        await this.validateCartBadgeVisibility(false);
    }
   
}

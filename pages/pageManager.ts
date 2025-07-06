import { Page } from '@playwright/test'
import { BasePage } from '@pages/basePage'
import { ProductPage } from '@pages/productPage'
import { CartPage } from '@pages/cartPage'
import { LoginPage } from '@pages/loginPage';

export class PageManager {
    private readonly page: Page;
    // adding field for every page
    private readonly basePage: BasePage;
    private readonly loginPage: LoginPage
    private readonly productPage: ProductPage;
    private readonly cartPage: CartPage;

    constructor(page: Page) {
        // calling all the pages in the constructor
        this.page = page;
        this.basePage = new BasePage(this.page);
        this.loginPage = new LoginPage(this.page);
        this.productPage = new ProductPage(this.page);
        this.cartPage = new CartPage(this.page);    
    }

    // creating methods that will return all the instances of the page objects
    onBasePage() {
        return this.basePage;
    }

    onLoginPage() {
        return this.loginPage;
    }

    onProductPage() {
        return this.productPage;
    }

    onCartPage() {
        return this.cartPage;
    }
}

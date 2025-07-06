import { Page, Locator, expect } from '@playwright/test';
import { cartPageLocators as locators } from '@locators/cartLocators';
import { Cart, Checkout, Common, ErrorMessages, Urls } from '@constants/testData';
import { ProductPage } from '@pages/productPage';
import { BasePage } from '@pages/basePage';

export class CartPage extends BasePage {

}

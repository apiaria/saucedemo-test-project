export const Urls = {
    INVENTORY_URL: '/inventory.html',
    PRODUCT_URL: '/inventory-item.html?id=',
    CART_URL: '/cart.html',
    CHECKOUT_STEP1_URL: '/checkout-step-one.html',
    CHECKOUT_STEP2_URL: '/checkout-step-two.html',
    CHECKOUT_COMPLETE_URL: '/checkout-complete.html',
    ABOUT_URL: 'https://saucelabs.com'
};

export const Common = {
    HEADER_TITLE: 'Swag Labs',
    FOOTER_COPY_RIGHT_TEXT: 'Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy',
    OPEN_MENU_TXT: 'Open Menu',
    CLOSE_MENU_TXT: 'Close Menu',
    LOGOUT_TXT: 'Logout',
    CART_TXT: 'cart',
    ALL_ITEMS_TXT: 'All Items',
    ABOUT_TXT: 'About',
    RESET_APP_STATE_TXT: 'Reset App State',
    TWITTER: 'twitter',
    FACEBOOK: 'facebook',
    LINKEDIN: 'linkedin'
};

export const Inventory = {
    INVENTORY_TITLE: 'Products',
    sortOptions: [
        'Name (A to Z)',
        'Name (Z to A)',
        'Price (low to high)',
        'Price (high to low)'
    ],
    sortOptionMap: {
        name: { asc: 'az', desc: 'za' },
        price: { asc: 'lohi', desc: 'hilo' }
    },
    ADD_TO_CART_TXT: 'Add to cart',
    REMOVE_TXT: 'Remove'
};

export const Cart = { 
    CART_TITLE: 'Your Cart'
};

export const Checkout = {
    CHECKOUT_TITLE: 'Checkout: Your Information',
    CHECKOUT_OVERVIEW_TITLE: 'Checkout: Overview',
    CHECKOUT_COMPLETE_TITLE: 'Checkout: Complete!',
    COMPLETE_HEADER_TXT: 'Thank you for your order!',
    FIRST_NAME: 'John',
    LAST_NAME: 'Doe',
    ZIP_CODE: '23456'
};

export const ErrorMessages = {
    MISSING_USERNAME: 'Username is required',
    MISSING_PASSWORD: 'Password is required',
    LOCKED_OUT: 'Sorry, this user has been locked out.',
    WRONG_CREDENTIALS: 'Username and password do not match any user in this service',
    WRONG_FIRST_NAME: 'Error: First Name is required',
    WRONG_LAST_NAME: 'Error: Last Name is required',
    WRONG_ZIP_CODE: 'Error: Postal Code is required',
    NO_ACCESS_INVENTORY: `You can only access '${Urls.INVENTORY_URL}' when you are logged in.`,
    NO_ACCESS_CART: `You can only access '${Urls.CART_URL}' when you are logged in.`,
    NO_ACCESS_CHECKOUT_STEP1: `You can only access '${Urls.CHECKOUT_STEP1_URL}' when you are logged in.`,
    NO_ACCESS_CHECKOUT_STEP2: `You can only access '${Urls.CHECKOUT_STEP2_URL}' when you are logged in.`,
    NO_ACCESS_CHECKOUT_COMPLETE: `You can only access '${Urls.CHECKOUT_COMPLETE_URL}' when you are logged in.`
};

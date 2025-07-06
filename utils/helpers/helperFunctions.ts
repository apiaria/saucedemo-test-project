import { Urls } from '../../utils/constants/testData';
import { PageManager } from '../../pages/pageManager';

/**
 * Login Function
 * @param pm - PageManager, so that it can access the needed methods
 */
export async function login(pm: PageManager) {
  await pm.onBasePage().navigateTo('/');
  await pm.onLoginPage().login(process.env.STANDARD_USER_USERNAME!, process.env.PASSWORD!);
  await pm.onBasePage().assertPageLoaded(Urls.INVENTORY_URL);
  await pm.onBasePage().assertHeader();
  await pm.onBasePage().assertFooter();
}

/**
 * Logout Function
 * @param pm - PageManager, so that it can access the needed method
 */
export async function logout(pm: PageManager) {
  await pm.onLoginPage().logout();
}

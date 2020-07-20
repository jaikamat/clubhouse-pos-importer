import puppeteer from 'puppeteer';
import ui from './data/pageElements';
require('dotenv').config({ path: './src/__tests__/data/.env' });

let page, browser;
const HOMEPAGE = process.env.URL;
const [WIDTH, HEIGHT] = [1920, 1080]
const DELAY = 5;

// Set the global timeout limit
jest.setTimeout(40000)

async function navigateToSales() {
    await page.$eval(ui.hamburger, b => b.click());
    await page.$eval(ui.newSale, b => b.click());
}

async function navigateToManageInventory() {
    await page.$eval(ui.hamburger, b => b.click());
    await page.$eval(ui.manageInventory, b => b.click());
}

async function searchForCard(name) {
    await page.type(ui.searchBar, name);
    await page.waitFor(7000);
    await page.$eval(ui.searchResult, r => r.click())
    await page.waitFor(5000);
}

describe('Testing login/logout', () => {
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null, // Viewport should match window size when headless
            slowMo: 50,
            args: [`--window-size=${WIDTH},${HEIGHT}`]
        });
        page = await browser.newPage();
    });

    afterAll(async () => await browser.close());

    test('Log in with invalid credentials', async () => {
        await page.goto(HOMEPAGE);
        await page.$eval(ui.loginBtn, b => b.click());
        await page.type(ui.usernameInput, 'notarealuser', { delay: DELAY });
        await page.type(ui.passwordInput, 'notarealuser', { delay: DELAY });
        await page.$eval(ui.loginFormBtn, b => b.click());
        await page.waitFor(2000);
        const usernameInputVal = await page.$eval(ui.usernameInput, i => i.value);
        const passwordInputVal = await page.$eval(ui.passwordInput, i => i.value);
        expect(usernameInputVal).toBe(''); // UI resets inputs if wrong creds
        expect(passwordInputVal).toBe(''); // UI resets inputs if wrong creds
        expect(page.url()).toBe('http://localhost:3000/#/login');
    });

    test('Log in with valid credentials', async () => {
        await page.goto(HOMEPAGE);
        await page.$eval(ui.loginBtn, b => b.click());
        await page.type(ui.usernameInput, process.env.DUMMY_USERNAME, { delay: DELAY });
        await page.type(ui.passwordInput, process.env.DUMMY_PASSWORD, { delay: DELAY });
        await page.$eval(ui.loginFormBtn, b => b.click());
        await page.waitFor(4000);
        await expect(page.url()).toBe('http://localhost:3000/#/manage-inventory');
    });
});

describe('Manage Inventory Workflow', () => {
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null, // Viewport should match window size when headless
            slowMo: 50,
            args: [`--window-size=${WIDTH},${HEIGHT}`]
        });
        page = await browser.newPage();
        await page.goto(HOMEPAGE);
        await page.$eval(ui.loginBtn, b => b.click());
        await page.type(ui.usernameInput, process.env.DUMMY_USERNAME, { delay: DELAY });
        await page.type(ui.passwordInput, process.env.DUMMY_PASSWORD, { delay: DELAY });
        await page.$eval(ui.loginFormBtn, b => b.click());
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Navigate to Manage Inventory', async () => {
        await navigateToManageInventory();
        expect(page.url()).toBe('http://localhost:3000/#/manage-inventory');
    });

    test('Add cards to inventory', async () => {
        await searchForCard('Daybreak Ranger');
        await page.type(ui.manageInvFirstResultQuantity, '5', { delay: DELAY });
        await page.$eval(ui.manageInvFinishDropdown, d => d.click());
        await page.$eval(ui.manageInvFinishDropdownFirst, d => d.click());
        await page.$eval(ui.manageInvConditionDropdown, d => d.click());
        await page.$eval(ui.manageInvConditionDropdownFirst, d => d.click());
        await page.$eval(ui.manageInvSubmitBtn, b => b.click());
        await page.waitFor(2000);
        const nonfoilLabel = await page.$eval(ui.manageInvNonfoilLabel, d => d.textContent);
        expect(nonfoilLabel).toBe('5');
        await page.type(ui.manageInvFirstResultQuantity, '2', { delay: DELAY });
        await page.$eval(ui.manageInvFinishDropdown, d => d.click());
        await page.$eval(ui.manageInvFinishDropdownSecond, d => d.click());
        await page.$eval(ui.manageInvConditionDropdown, d => d.click());
        await page.$eval(ui.manageInvConditionDropdownFirst, d => d.click());
        await page.$eval(ui.manageInvSubmitBtn, b => b.click());
        await page.waitFor(2000);
        const foilLabel = await page.$eval(ui.manageInvFoilLabel, d => d.textContent);
        expect(foilLabel).toBe('2');
    });

    test('Remove cards from inventory', async () => {
        await page.type(ui.manageInvFirstResultQuantity, '-5', { delay: DELAY });
        await page.$eval(ui.manageInvFinishDropdown, d => d.click());
        await page.$eval(ui.manageInvFinishDropdownFirst, d => d.click());
        await page.$eval(ui.manageInvConditionDropdown, d => d.click());
        await page.$eval(ui.manageInvConditionDropdownFirst, d => d.click());
        await page.$eval(ui.manageInvSubmitBtn, b => b.click());
        await page.waitFor(2000);
        const nonfoilLabel = await page.$eval(ui.manageInvNonfoilLabel, d => d.textContent);
        expect(nonfoilLabel).toBe('0');
        await page.type(ui.manageInvFirstResultQuantity, '-2', { delay: DELAY });
        await page.$eval(ui.manageInvFinishDropdown, d => d.click());
        await page.$eval(ui.manageInvFinishDropdownSecond, d => d.click());
        await page.$eval(ui.manageInvConditionDropdown, d => d.click());
        await page.$eval(ui.manageInvConditionDropdownFirst, d => d.click());
        await page.$eval(ui.manageInvSubmitBtn, b => b.click());
        await page.waitFor(2000);
        const foilLabel = await page.$eval(ui.manageInvFoilLabel, d => d.textContent);
        expect(foilLabel).toBe('0');
    });
});

describe('Suspend Sale workflow', () => {
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null, // Viewport should match window size when headless
            slowMo: 50,
            args: [`--window-size=${WIDTH},${HEIGHT}`]
        });
        page = await browser.newPage();
        await page.goto(HOMEPAGE);
        await page.$eval(ui.loginBtn, b => b.click());
        await page.type(ui.usernameInput, process.env.DUMMY_USERNAME, { delay: DELAY });
        await page.type(ui.passwordInput, process.env.DUMMY_PASSWORD, { delay: DELAY });
        await page.$eval(ui.loginFormBtn, b => b.click());
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
    });

    afterAll(async () => {
        await browser.close();
    })

    test('Navigate to sales', async () => {
        await navigateToSales();
        expect(page.url()).toBe('http://localhost:3000/#/new-sale');
    });

    test('Add cards to sale list', async () => {
        await searchForCard('birds of p');
        await page.$eval(ui.firstResultFinishCondition, d => d.click());
        await page.$eval(ui.firstFinishConditionDropdown, d => d.click());
        await page.type(ui.firstQtySellInput, '2', { delay: DELAY });
        await page.type(ui.firstPriceSellInput, '7.77', { delay: DELAY });
        await page.$eval(ui.firstAddToSaleBtn, b => b.click());
        const cardTitle = await page.$eval(ui.firstSaleLineItemTitle, d => d.textContent);
        const cardPrice = await page.$eval(ui.firstSaleLineItemPrice, d => d.textContent);
        const saleTotal = await page.$eval(ui.saleTotal, d => d.textContent);
        expect(cardTitle).toBe('Birds of Paradise');
        expect(cardPrice).toBe('$7.77');
        expect(saleTotal).toBe('$15.54');
    });

    test('Suspend the sale', async () => {
        await page.$eval(ui.saleMenuBtn, b => b.click());
        await page.type(ui.suspendSaleName, 'Arcum Dagsson', { delay: DELAY });
        const text = await page.$eval(ui.customerNameTextCount, i => i.textContent);
        expect(text).toBe('13/50');
        await page.$eval(ui.suspendSaleSubmitBtn, b => b.click());
        await page.waitFor(1000);
        await searchForCard('birds of paradise');
        const quantity = await page.$eval(ui.firstSearchResultNonfoilQty, d => d.textContent);
        await page.waitFor(500);
        expect(quantity).toBe("1");
    });

    test('Restore the sale', async () => {
        await page.$eval(ui.saleMenuBtn, b => b.click());
        await page.$eval(ui.restoreSaleMenu, d => d.click());
        await page.$eval(ui.restoreSaleMenuFirstItem, d => d.click());
        await page.$eval(ui.restoreSaleMenuSubmitBtn, b => b.click());
        await page.waitFor(2000);
        const headerText = await page.$eval(ui.saleListHeader, h => h.textContent);
        const cardTitle = await page.$eval(ui.firstSaleLineItemTitle, d => d.textContent);
        const cardPrice = await page.$eval(ui.firstSaleLineItemPrice, d => d.textContent);
        const saleTotal = await page.$eval(ui.saleTotal, d => d.textContent);
        await page.waitFor(500);
        expect(headerText).toBe(`Arcum Dagsson's Items2 cards`);
        expect(cardTitle).toBe('Birds of Paradise');
        expect(cardPrice).toBe('$7.77');
        expect(saleTotal).toBe('$15.54');
    });

    test('Add new cards to sale list', async () => {
        await searchForCard('Multani, Maro So');
        await page.$eval(ui.firstResultFinishCondition, d => d.click());
        await page.$eval(ui.firstFinishConditionDropdown, d => d.click());
        await page.type(ui.firstQtySellInput, '1', { delay: DELAY });
        await page.type(ui.firstPriceSellInput, '3.33', { delay: DELAY });
        await page.$eval(ui.firstAddToSaleBtn, b => b.click());
        const saleTotal = await page.$eval(ui.saleTotal, d => d.textContent);
        expect(saleTotal).toBe('$18.87');
    });

    test('Suspend the sale again', async () => {
        await page.$eval(ui.saleMenuBtn, b => b.click());
        await page.type(ui.suspendSaleName, 'Arcum Dagsson v02', { delay: DELAY });
        await page.$eval(ui.suspendSaleSubmitBtn, b => b.click());
        await page.waitFor(1000);
        await searchForCard('Multani, Maro So');
        const quantity = await page.$eval(ui.firstSearchResultNonfoilQty, d => d.textContent);
        expect(quantity).toBe("2");
    });

    test('Restore the sale again', async () => {
        await page.$eval(ui.saleMenuBtn, b => b.click());
        await page.$eval(ui.restoreSaleMenu, d => d.click());
        await page.$eval(ui.restoreSaleMenuFirstItem, d => d.click());
        await page.$eval(ui.restoreSaleMenuSubmitBtn, b => b.click());
        await page.waitFor(2000);
        const headerText = await page.$eval(ui.saleListHeader, h => h.textContent);
        expect(headerText).toBe(`Arcum Dagsson v02's Items3 cards`);
    });

    test('Delete the sale', async () => {
        await page.$eval(ui.saleMenuBtn, b => b.click());
        await page.$eval(ui.deleteSaleBtn, b => b.click());
        await page.waitFor(2000);
        const headerText = await page.$eval(ui.saleListHeader, h => h.textContent);
        expect(headerText).toBe(`Sale Items`);
    });

    test('Confirm cards were restored to inventory', async () => {
        await searchForCard('birds of paradise');
        const quantity1 = await page.$eval(ui.firstSearchResultNonfoilQty, d => d.textContent);
        expect(quantity1).toBe("3");
        await searchForCard('Multani, Maro So');
        const quantity2 = await page.$eval(ui.firstSearchResultNonfoilQty, d => d.textContent);
        expect(quantity2).toBe("3");
    });
})
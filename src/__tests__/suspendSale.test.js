import puppeteer from 'puppeteer';
import ui from './data/pageElements';
require('dotenv').config({ path: './src/__tests__/data/.env' });

let page, browser;
const homepage = process.env.URL;
const [WIDTH, HEIGHT] = [1920, 1080]
const TIMEOUT = 20000;
const DELAY = 5;

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
    await page.waitFor(3000);
    await page.$eval(ui.searchResult, r => r.click())
    await page.waitFor(3000);
}

describe('Suspend sale workflow', () => {
    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: false, slowMo: 50, args: [`--window-size=${WIDTH},${HEIGHT}`] });
        page = await browser.newPage();
        await page.goto(homepage);
        await page.$eval(ui.loginBtn, b => b.click());
        await page.type(ui.usernameInput, process.env.DUMMY_USERNAME, { delay: DELAY });
        await page.type(ui.passwordInput, process.env.DUMMY_PASSWORD, { delay: DELAY });
        await page.$eval(ui.loginFormBtn, b => b.click());
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
    }, TIMEOUT);

    afterAll(async () => {
        await browser.close();
    })

    test('Navigate to Manage Inventory', async () => {
        await navigateToManageInventory();
        expect(page.url()).toBe('http://localhost:3000/#/manage-inventory');
    }, TIMEOUT)

    // TODO: Perform initial adds of sample data here and assert

    test('Navigate to sales', async () => {
        await navigateToSales();
        expect(page.url()).toBe('http://localhost:3000/#/new-sale');
    }, TIMEOUT)

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
    }, TIMEOUT)

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
    }, TIMEOUT)

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
        expect(headerText).toBe(`Arcum Dagsson's Items`);
        expect(cardTitle).toBe('Birds of Paradise');
        expect(cardPrice).toBe('$7.77');
        expect(saleTotal).toBe('$15.54');
    }, TIMEOUT)

    test('Add new cards to sale list', async () => {
        await searchForCard('Multani, Maro So');
        await page.$eval(ui.firstResultFinishCondition, d => d.click());
        await page.$eval(ui.firstFinishConditionDropdown, d => d.click());
        await page.type(ui.firstQtySellInput, '1', { delay: DELAY });
        await page.type(ui.firstPriceSellInput, '3.33', { delay: DELAY });
        await page.$eval(ui.firstAddToSaleBtn, b => b.click());
        const saleTotal = await page.$eval(ui.saleTotal, d => d.textContent);
        expect(saleTotal).toBe('$18.87');
    }, TIMEOUT)

    test('Suspend the sale again', async () => {
        await page.$eval(ui.saleMenuBtn, b => b.click());
        await page.type(ui.suspendSaleName, 'Arcum Dagsson v02', { delay: DELAY });
        await page.$eval(ui.suspendSaleSubmitBtn, b => b.click());
        await page.waitFor(1000);
        await searchForCard('Multani, Maro So');
        const quantity = await page.$eval(ui.firstSearchResultNonfoilQty, d => d.textContent);
        expect(quantity).toBe("2");
    }, TIMEOUT)

    test('Restore the sale again', async () => {
        await page.$eval(ui.saleMenuBtn, b => b.click());
        await page.$eval(ui.restoreSaleMenu, d => d.click());
        await page.$eval(ui.restoreSaleMenuFirstItem, d => d.click());
        await page.$eval(ui.restoreSaleMenuSubmitBtn, b => b.click());
        await page.waitFor(2000);
        const headerText = await page.$eval(ui.saleListHeader, h => h.textContent);
        expect(headerText).toBe(`Arcum Dagsson v02's Items`);
    }, TIMEOUT)

    test('Delete the sale', async () => {
        await page.$eval(ui.saleMenuBtn, b => b.click());
        await page.$eval(ui.deleteSaleBtn, b => b.click());
        await page.waitFor(2000);
        const headerText = await page.$eval(ui.saleListHeader, h => h.textContent);
        expect(headerText).toBe(`Sale Items`);
    }, TIMEOUT)

    test('Confirm cards were restored to inventory', async () => {
        await searchForCard('birds of paradise');
        const quantity1 = await page.$eval(ui.firstSearchResultNonfoilQty, d => d.textContent);
        expect(quantity1).toBe("3");
        await searchForCard('Multani, Maro So');
        const quantity2 = await page.$eval(ui.firstSearchResultNonfoilQty, d => d.textContent);
        expect(quantity2).toBe("3");
    }, TIMEOUT)
})
import puppeteer from 'puppeteer';
import ui from './data/pageElements';
require('dotenv').config({ path: './src/__tests__/data/.env' });

let page, browser;
const HOMEPAGE = process.env.URL;
const [WIDTH, HEIGHT] = [1920, 1080];
const DELAY = 5;

// Set the global timeout limit
jest.setTimeout(40000);

async function navigateToReceiving() {
    await page.$eval(ui.hamburger, (b) => b.click());
    await page.$eval(ui.receiving, (b) => b.click());
}

async function navigateToManageInventory() {
    await page.$eval(ui.hamburger, (b) => b.click());
    await page.$eval(ui.manageInventory, (b) => b.click());
}

describe('Logging in', () => {
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null, // Viewport should match window size when headless
            slowMo: 50,
            args: [`--window-size=${WIDTH},${HEIGHT}`],
        });
        page = await browser.newPage();
    });

    test('Log in with valid credentials', async () => {
        await page.goto(HOMEPAGE);
        await page.$eval(ui.loginBtn, (b) => b.click());
        await page.type(ui.usernameInput, process.env.DUMMY_USERNAME, {
            delay: DELAY,
        });
        await page.type(ui.passwordInput, process.env.DUMMY_PASSWORD, {
            delay: DELAY,
        });
        await page.$eval(ui.loginFormBtn, (b) => b.click());
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await expect(page.url()).toBe(
            'http://localhost:3000/#/manage-inventory'
        );
    });
});

describe('Receving workflow', () => {
    test('Navigate to Receiving', async () => {
        await navigateToReceiving();
        await page.waitFor(4000);
        await expect(page.url()).toBe('http://localhost:3000/#/receiving');
    });

    test('Search for card', async () => {
        const CARD_NAME = 'Ghave, Guru of Spores';
        await page.type(ui.searchBar, CARD_NAME);
        await page.waitFor(7000);
        await page.$eval(ui.searchResult, (r) => r.click());
        await page.waitFor(5000);

        // Performs Array.querySelectorAll()
        const headers = await page.$$eval(ui.cardHeaders, (h) => {
            return h.map((el) => el.textContent);
        });

        for (let header of headers) {
            expect(header).toMatch(CARD_NAME); // Tests to see if CARD_NAME is within the header
        }
    });

    test('Set card quantity', async () => {
        await page.waitFor(250);
        await page.type(ui.receivingQuantity, '3');
        await page.waitFor(250);
    });

    test('Add credit card', async () => {
        await page.type(ui.receivingCredit, '5.00');
        await page.$eval(ui.receivingAddBtn, (b) => b.click());
        await page.waitFor(250);
        const receivingListItems = await page.$$eval(
            ui.receivingListItems,
            (li) => {
                return li.map((el) => el.textContent);
            }
        );
        expect(receivingListItems.length).toBe(3);
        const creditTotal = await page.$eval(
            ui.receivingCreditTotal,
            (d) => d.textContent
        );
        expect(creditTotal).toMatch('15.00');
        await page.waitFor(250);
    });

    test('Set card quantity', async () => {
        await page.waitFor(250);
        await page.type(ui.receivingQuantity, '2');
        await page.waitFor(250);
    });

    test('Add cash card', async () => {
        await page.type(ui.receivingCash, '7.00');
        await page.type(ui.receivingMarket, '10.00');
        await page.$eval(ui.receivingAddBtn, (b) => b.click());
        await page.waitFor(250);
        const receivingListItems = await page.$$eval(
            ui.receivingListItems,
            (li) => {
                return li.map((el) => el.textContent);
            }
        );
        expect(receivingListItems.length).toBe(5);
        const cashTotal = await page.$eval(
            ui.receivingCashTotal,
            (d) => d.textContent
        );
        expect(cashTotal).toMatch('14.00');
        await page.waitFor(250);
    });

    test('Set card quantity', async () => {
        await page.waitFor(250);
        await page.type(ui.receivingQuantity, '3');
        await page.waitFor(250);
    });

    test('Add both cash and credit card', async () => {
        await page.type(ui.receivingCredit, '2.00');
        await page.type(ui.receivingCash, '5.00');
        await page.type(ui.receivingMarket, '9.00');
        await page.$eval(ui.receivingAddBtn, (b) => b.click());
        await page.waitFor(250);
        const receivingListItems = await page.$$eval(
            ui.receivingListItems,
            (li) => {
                return li.map((el) => el.textContent);
            }
        );
        expect(receivingListItems.length).toBe(8);
        const creditTotal = await page.$eval(
            ui.receivingCreditTotal,
            (d) => d.textContent
        );
        const cashTotal = await page.$eval(
            ui.receivingCashTotal,
            (d) => d.textContent
        );
        expect(creditTotal).toMatch('21.00');
        expect(cashTotal).toMatch('14.00'); // Defaults to credit, so no cash yet
        await page.waitFor(250);
    });

    test('Select all credit', async () => {
        // press the credit button and check totals, should be $14 cash/ $21 credit
        await page.$eval(ui.receivingSelectCredit, (b) => b.click());
        await page.waitFor(250);
        const cashTotal = await page.$eval(
            ui.receivingCashTotal,
            (d) => d.textContent
        );
        const creditTotal = await page.$eval(
            ui.receivingCreditTotal,
            (d) => d.textContent
        );
        expect(cashTotal).toMatch('14.00');
        expect(creditTotal).toMatch('21.00');
    });

    test('Select all cash', async () => {
        await page.$eval(ui.receivingSelectCash, (b) => b.click());
        await page.waitFor(250);
        const cashTotal = await page.$eval(
            ui.receivingCashTotal,
            (d) => d.textContent
        );
        const creditTotal = await page.$eval(
            ui.receivingCreditTotal,
            (d) => d.textContent
        );
        expect(cashTotal).toMatch('29.00');
        expect(creditTotal).toMatch('15.00');
    });

    test('Commit to inventory', async () => {
        await page.$eval(ui.receivingCommitBtn, (b) => b.click());
        await page.waitFor(1000);
        await page.$eval(ui.receivingSubmitBtn, (b) => b.click());
        await page.waitFor(5000); // Wait for the API submission to complete

        // Ensure the page resets now
        const headers = await page.$$eval(ui.cardHeaders, (h) => {
            return h.map((el) => el.textContent);
        });

        expect(headers.length).toBe(0);
    });
});

describe('Manage Inventory totals confirmation', () => {
    // search for card and confirm totals, then remove it from inventory
    afterAll(async () => await browser.close());

    test('Navigate to Manage Inventory', async () => {
        await navigateToManageInventory();
        await page.waitFor(4000);
        await expect(page.url()).toBe(
            'http://localhost:3000/#/manage-inventory'
        );
    });

    test('Search for cards', async () => {
        const CARD_NAME = 'Ghave, Guru of Spores';
        await page.type(ui.searchBar, CARD_NAME);
        await page.waitFor(7000);
        await page.$eval(ui.searchResult, (r) => r.click());
        await page.waitFor(5000);

        // Performs Array.querySelectorAll()
        const headers = await page.$$eval(ui.cardHeaders, (h) => {
            return h.map((el) => el.textContent);
        });

        for (let header of headers) {
            expect(header).toMatch(CARD_NAME); // Tests to see if CARD_NAME is within the header
        }
    });

    test('Ensure correct number of cards were added', async () => {
        const nonfoilLabelQty = await page.$eval(
            ui.manageInvNonfoilLabel,
            (l) => l.textContent
        );
        expect(nonfoilLabelQty).toBe('8');
    });

    test('Remove the cards from inventory to reset', async () => {
        await page.type(ui.manageInvFirstResultQuantity, '');
        await page.type(ui.manageInvFirstResultQuantity, '-8');
        await page.$eval(ui.manageInvConditionDropdown, (d) => d.click());
        await page.$eval(ui.manageInvConditionDropdownFirst, (d) => d.click());
        await page.$eval(ui.manageInvSubmitBtn, (b) => b.click());
        await page.waitFor(4000);
        const nonfoilLabel = await page.$eval(
            ui.manageInvNonfoilLabel,
            (d) => d.textContent
        );
        expect(nonfoilLabel).toBe('0');
    });
});

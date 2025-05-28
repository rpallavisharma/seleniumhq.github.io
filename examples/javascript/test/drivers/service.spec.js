const fs = require('fs');
const os = require('os');
const path = require('path');
const Chrome = require('selenium-webdriver/chrome');
const {Browser, Builder} = require("selenium-webdriver");
const {getBinaryPaths} = require("selenium-webdriver/common/driverFinder");

describe('Service Test', function () {
  it('Default service', async function () {
    let service = new Chrome.ServiceBuilder()

    let driver = new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeService(service)
        .build();

    await driver.get('https://www.selenium.dev/selenium/web/blank.html');
    await driver.quit();
  });

  it('Set Driver Location', async function () {

    let options = new Chrome.Options();
    options.setBrowserVersion("stable")

    let paths = getBinaryPaths(options)
    let driverPath = paths.driverPath;
    let browserPath = paths.browserPath;

    options.setChromeBinaryPath(browserPath)
    const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-profile-'));
    options.addArguments(`--user-data-dir=${userDataDir}`);
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    let service = new Chrome.ServiceBuilder(driverPath)

    let driver = new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(options)
        .setChromeService(service)
        .build();

    await driver.get('https://www.selenium.dev/selenium/web/blank.html');
    await driver.quit();
    // 👉 Cleanup user data dir
    fs.rmSync(userDataDir, { recursive: true, force: true });
  });

  it('Set port', async function () {
    let service = new Chrome.ServiceBuilder().setPort(1234)

    let driver = new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeService(service)
        .build();

    await driver.get('https://www.selenium.dev/selenium/web/blank.html');
    await driver.quit();
  });
});

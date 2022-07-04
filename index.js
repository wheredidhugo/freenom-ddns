const puppeteer = require("puppeteer-extra");
const fetch = require("node-fetch");
const { domain, domainid, hoursChecking } = require("./config.json");
require("dotenv").config();

const hours = hoursChecking ? hoursChecking : 1;

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

function freenomDdns() {
  puppeteer
    .launch({
      headless: true,
      executablePath: "/usr/bin/chromium-browser",
      args: ["--no-sandbox"],
    })
    .then(async (browser) => {
      const page = await browser.newPage();

      console.log("Launch Puppeteer");

      await page.goto(
        `https://my.freenom.com/clientarea.php?managedns=${domain}&domainid=${domainid}`
      );

      console.log("Navigated to Freenom.");

      await page.waitForTimeout(3000);

      async function login() {
        await page.type("input[name=username]", process.env.EMAIL, {
          delay: 200,
        });
        await page.type("input[name=password]", process.env.PASSWORD, {
          delay: 200,
        });
        await page.waitForTimeout(1000);
        await page.click("input[type=submit]");
        console.log("Logged into Freenom");
      }

      async function changeIp() {
        // fetching ipify to get ip
        const response = await fetch("https://api.ipify.org/?format=json");
        const data = await response.json();
        const ip = await data.ip;

        console.log(`Your current IP: ${ip}`);

        const fieldHandle = await page.$('input[name="records[0][value]"]');
        const fieldIp = await page.evaluate((x) => x.value, fieldHandle);

        console.log(`Freenom IP: ${fieldIp}`);

        if (!(fieldIp === ip)) {
          console.log("Freenom IP is different from your current IP.");

          // delete current ip
          await page.focus('input[name="records[0][value]"]');
          await page.keyboard.down("Control");
          await page.keyboard.press("A");
          await page.keyboard.up("Control");
          await page.keyboard.press("Backspace");

          // type new ip and save
          await page.type('input[name="records[0][value]"]', ip, {
            delay: 200,
          });
          await page.waitForTimeout(1000);
          // await page.screenshot({ path: "example.png", fullPage: true }); in case of debug
          await page.click("button.smallBtn:nth-child(4)");
          console.log("Saved your changes.");
        } else
          console.log(
            "Your freenom IP isn't different from your current IP. Skipping"
          );
      }

      await login();
      await page.waitForTimeout(5000);
      await changeIp();
      await page.waitForTimeout(3000);
      await browser.close();
    });
}

freenomDdns();
setInterval(freenomDdns, 1000 * 60 * 60 * hours);

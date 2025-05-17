const puppeteer = require("puppeteer");
const tckn = process.env.TCKN;
const pass = process.env.PASS;

if (!tckn || !pass) return console.error("Lütfen .env dosyasına giriş bilgilerinizi girin.");

(async () => {
    const browser = await puppeteer.launch(process.env.DEBUG == "true" ? { headless: false, slowMo: 100 } : {});
    const page = await browser.newPage();

    await page.goto('https://giris.turkiye.gov.tr/Giris/gir', { waitUntil: 'networkidle2' });
    console.log("Giriş sayfası yüklendi.");

    await page.locator('#tridField').fill(tckn);
    await page.locator('#egpField').fill(pass);
    await page.locator('button[name="submitButton"]').click();
    console.log("Giriş isteği gönderildi.");

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const loginCheck = await page.$('div.content > div.alert.error[role=alert]');
    if (loginCheck) {
        console.error("Giriş yapılırken bir hata oluştu. Giriş bilgilerinizin doğruluğunu kontrol edin ve daha sonra tekrar deneyin.");
        return await browser.close();
    }

    const _2faCheck = await page.$('text/İki Aşamalı Giriş Onay');
    if (_2faCheck) {
        console.log("2 aşamalı doğrulamayı onaylamanız bekleniyor... (60 saniye süreniz var)");
        try {
            await page.waitForNavigation({
                waitUntil: 'networkidle2',
                timeout: 60000
            });
            console.log("2FA başarıyla onaylandı.");
        } catch (error) {
            console.error("2FA onayı için süre doldu. İşlem sonlandırılıyor.");
            return await browser.close();
        }
    }

    console.log("Başarıyla giriş yapıldı.");

    await page.goto('https://www.turkiye.gov.tr/ptt-ptt-uzerinden-yapilan-kurum-odemeleri-sorgulama', { waitUntil: 'networkidle2' });
    console.log("Burs kontrol ediliyor...");

    await page.locator('#contentStart > div.tableWrapper').waitHandle();
    const paymentsArray = await page.$$('#contentStart > .tableWrapper > table > tbody > *')
    console.log(paymentsArray);
    for (let i = 0; i < paymentsArray.length; i++) {
        const payment = paymentsArray[i];
        const payer = await payment.evaluate(el => el.children[0].textContent);
        const paymentState = await payment.evaluate(el => el.children[6].textContent);
        if (payer.includes("BURS OD MERKEZ ÖDEME")) {
            paymentState.includes("aktarılmıştır.")
                ? console.log("Bursunuz yatmıştır.")
                : console.log("Bursunuz işleme alınmış ancak hesabınıza yatırılmamıştır\nAçıklama: " + paymentState);
            return await browser.close();
        }
    }

    console.log("Bursunuz yatmamıştır.");
    await browser.close();
})();
# iokbs-burs-sorgulama

Bu yazılım, e-Devlet hesabınıza sizin yerinize giriş yapıp İOKBS burs ödemelerinizi kontrol eder.

## Kurulum

Repoyu klonlayın:

```
git clone https://github.com/fylean/iokbs-burs-sorgulama.git
cd iokbs-burs-sorgulama
npm install
```

`.env` dosyasına kendinize ait e-Devlet bilgilerinizi girin:

```
TCKN=1234567890
PASS=edevletsifrem
```

Yazılımı çalıştırın:

```
npm start
```

## Hata Ayıklama

`.env` dosyasına `DEBUG=true` ekleyin ve yazılımı çalıştırın.

Açılan tarayıcı penceresinde yaşanan sorun veya hataları görebilirsiniz.

## Katkıda Bulunma

Proje her türlü katkı ve yardıma açıktır.

Pull request veya issue oluşturarak projeye katkıda bulunabilirsiniz.

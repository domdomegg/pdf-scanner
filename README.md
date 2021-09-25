# fake-scanner

Hate having to print out, ink sign and scan documents for pointless bureaucratic procedures? Disappointed by the other services that claim to do this, but don't do it very well? Well, look no further, fake-scanner gives you high quality fake scans of PDFs.

## How it works

1. Takes your PDF, and converts each page to a JPG
2. Adds some effects to make it look scanned
3. Combines these JPGs back into a PDF

Web-supporting libraries:
- https://www.npmjs.com/package/mupdf-js
- https://www.npmjs.com/package/jimp
- https://www.npmjs.com/package/pdfmake

CLI-only libraries:
- https://www.npmjs.com/package/sharp
- https://www.npmjs.com/package/pdf2pic (graphicsmagick)
- https://www.npmjs.com/package/pdf2img-lambda-friendly (graphicsmagick)
- https://www.npmjs.com/package/pdftoimage (poppler)
- https://www.npmjs.com/package/images-pdf (might work in browser?)
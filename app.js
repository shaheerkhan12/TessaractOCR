const express = require('express')
const app = express()
const Tesseract = require('tesseract.js');
const multer = require('multer');
const storage = multer.memoryStorage(); // This stores the file in memory as a Buffer

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Set a file size limit (5MB in this example)
  },
  fileFilter: (req, file, cb) => {
    // Implement file filtering if needed
    cb(null, true);
  },
});
const port = 3000

app.post('/extract-text', cors(), upload.single('image'), (req, res) => {
    const imageBuffer = req.file.buffer;
     console.log(imageBuffer);
    // Perform OCR using tesseract.js
    Tesseract.recognize(
      imageBuffer,
      'urd', // Language code (English in this example)
      {
        // logger: info => console.log(info) // Optional logger
      }
    ).then(({ data: { text } }) => {
      res.json({ extractedText: text });
    }).catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to extract text from the image' });
    });
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
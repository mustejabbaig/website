import express, { Request, Response } from 'express';
import cors from 'cors';
import sharp from 'sharp';
import multer from 'multer'; // For handling multipart/form-data
import { error } from 'console';

const app = express();
const port = 3001; // Ensure this is different from your React app's port

// Set up multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// CORS Middleware Setup
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your React app's URL
  methods: 'POST', // Allow only POST requests
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json({limit: '20mb'}));


app.post('/formatToFtype', async (req: Request, res: Response) => {
  const { imageData } = req.body;
  if (!imageData) {
    return res.status(400).send('No image data provided.');
  }

  let splitpoint = 5;
  if (imageData.split(',')[1].charAt(imageData.split(',').length - 4) == '0'){
    splitpoint = 4;
  }

  // Convert base64 to Buffer for Sharp
  const imageBuffer = Buffer.from(imageData.split(',')[1].substring(0, imageData.split(',')[1].length - splitpoint), 'base64');
  var fileType    = imageData.split(',')[1].split('.')[imageData.split(',')[1].split('.').length - 1];

  let convertedImage = imageBuffer;
  try {
    if (fileType == "png"){
    convertedImage = await sharp(imageBuffer)
      .toFormat("png")
      .png({compressionLevel : 0})
      .toBuffer();
    }
    else if (fileType == "pngc"){
      convertedImage = await sharp(imageBuffer)
        .toFormat("png")
        .png({compressionLevel : 9})
        .toBuffer();
      fileType = "png";
    }

    else if (fileType == "jpg"){
      convertedImage = await sharp(imageBuffer)
      .toFormat("jpg")
      .jpeg({quality : 100})
      .toBuffer();
    }
    else if (fileType == "webp"){
      convertedImage = await sharp(imageBuffer)
      .toFormat("webp")
      .webp({quality : 100})
      .toBuffer();
    }
    else if (fileType == "gif"){
      convertedImage = await sharp(imageBuffer)
      .toFormat("gif")
      .toBuffer();
    }
    else if (fileType == "avif"){
      convertedImage = await sharp(imageBuffer)
      .toFormat("avif")
      .avif({quality : 100})
      .toBuffer();
    }
    else{
      throw new Error("Wrong filetype! Is the transmition broken?");
    }

    // Convert back to base64
    const resizedImageData = convertedImage.toString('base64');
    const dataUri = `data:image/${fileType};base64,${resizedImageData}`;

    res.send(dataUri);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image');
  }
});

// POST route to respond to the request from React app
app.post('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

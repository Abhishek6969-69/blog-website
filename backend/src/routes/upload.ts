import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { createHash } from 'crypto';

const CLOUDINARY_CLOUD_NAME = 'dlxao6zk7';
const CLOUDINARY_API_KEY = '564785278525573';
const CLOUDINARY_API_SECRET = 'tX0b_BAeVdY00AW0olRXQzxu_gs';

function generateSignature(params: Record<string, string>): string {
  // Sort parameters alphabetically
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc: Record<string, string>, key) => {
      acc[key] = params[key];
      return acc;
    }, {});

  // Create string to sign
  const stringToSign = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&') + CLOUDINARY_API_SECRET;

  // Generate SHA1 hash
  return createHash('sha1').update(stringToSign).digest('hex');
}

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export const uploadRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_TOKEN: string;
  },
  Variables: {
    userId: number;
  }
}>();

// Health check endpoint
uploadRouter.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

// Middleware to verify token
uploadRouter.use('/*', async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const authheader = c.req.header('Authorization');
  if (!authheader) {
    console.error('No Authorization header present');
    c.status(401);
    return c.json({ message: "Authorization header missing" });
  }

  try {
    const token = authheader.startsWith('Bearer ') ? authheader.substring(7) : authheader;
    const decodedval = await verify(token, c.env.JWT_TOKEN);
    if (decodedval) {
      // @ts-ignore
      c.set('userId', decodedval.id);
      await next();
    } else {
      c.status(403);
      return c.json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    c.status(403);
    return c.json({ message: "Token verification failed" });
  }
});

// Upload endpoint
uploadRouter.post('/', async (c) => {
  try {
    console.log('Received upload request');
    
    // Check if the request is multipart/form-data
    const contentType = c.req.header('Content-Type');
    console.log('Content-Type:', contentType);
    
    if (!contentType?.includes('multipart/form-data')) {
      console.error('Invalid content type:', contentType);
      c.status(400);
      return c.json({ message: "Content-Type must be multipart/form-data" });
    }

    try {
      const formData = await c.req.formData();
      console.log('Form data received');
      
      const file = formData.get('image') as File;
      
      if (!file) {
        console.error('No file received in request');
        c.status(400);
        return c.json({ message: "No file uploaded" });
      }

      console.log('Received file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error('File too large:', file.size);
        c.status(400);
        return c.json({ message: "File size must be less than 5MB" });
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        console.error('Invalid file type:', file.type);
        c.status(400);
        return c.json({ message: "Invalid file type. Allowed types: JPEG, PNG, GIF, WEBP" });
      }

      // Generate signature for Cloudinary
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const params = {
        timestamp,
        upload_preset: 'ml_default'
      };
      const signature = generateSignature(params);
      
      console.log('Preparing Cloudinary request with params:', {
        timestamp,
        upload_preset: 'ml_default',
        signature: signature.substring(0, 10) + '...'
      });
      
      // Create form data for Cloudinary
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', file);
      cloudinaryFormData.append('api_key', CLOUDINARY_API_KEY);
      cloudinaryFormData.append('timestamp', timestamp);
      cloudinaryFormData.append('signature', signature);
      cloudinaryFormData.append('upload_preset', 'ml_default');

      console.log('Sending request to Cloudinary...');
      
      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: cloudinaryFormData
        }
      );

      console.log('Cloudinary response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary upload failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Cloudinary upload failed: ${response.statusText} - ${errorText}`);
      }

      const result = await response.json() as CloudinaryResponse;
      console.log('Cloudinary upload successful:', {
        url: result.secure_url,
        public_id: result.public_id
      });

      return c.json({ 
        url: result.secure_url,
        public_id: result.public_id
      });
    } catch (error) {
      console.error('Error processing request:', error);
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  } catch (error) {
    console.error('Upload error details:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    });
    
    c.status(500);
    return c.json({ 
      message: "Error uploading file",
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error
    });
  }
}); 
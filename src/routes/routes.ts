// DeepLX TypeScript Implementation
// Server and routing

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { Config } from '../types';
import { translateByDeepLX } from '../translate/translate';

export function createRouter(cfg: Config): Application {
  const app: Application = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Auth middleware
  const authMiddleware = (req: Request, res: Response, next: any) => {
    if (cfg.token) {
      const providedTokenInQuery = req.query.token as string;
      const providedTokenInHeader = req.headers.authorization;
      
      let tokenFromHeader = '';
      if (providedTokenInHeader) {
        const parts = providedTokenInHeader.split(' ');
        if (parts.length === 2) {
          if (parts[0] === 'Bearer' || parts[0] === 'DeepL-Auth-Key') {
            tokenFromHeader = parts[1];
          }
        } else {
          tokenFromHeader = providedTokenInHeader;
        }
      }
      
      if (tokenFromHeader !== cfg.token && providedTokenInQuery !== cfg.token) {
        return res.status(401).json({
          code: 401,
          message: 'Invalid access token'
        });
      }
    }
    next();
  };
  
  // Defining the root endpoint which returns the project details
  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      code: 200,
      message: 'DeepL Free API, Developed by sjlleo and missuo. Go to /translate with POST. http://github.com/OwO-Network/DeepLX'
    });
  });
  
  // Free API endpoint, No Pro Account required
  app.post('/translate', authMiddleware, async (req: Request, res: Response) => {
    try {
      const { text: translateText, source_lang, target_lang, tag_handling } = req.body;
      
      const sourceLang = source_lang || '';
      const targetLang = target_lang || '';
      const tagHandling = tag_handling || '';
      const proxyURL = cfg.proxy || '';
      
      if (tagHandling && tagHandling !== 'html' && tagHandling !== 'xml') {
        return res.status(400).json({
          code: 400,
          message: 'Invalid tag_handling value. Allowed values are \'html\' and \'xml\'.'
        });
      }
      
      const result = await translateByDeepLX(sourceLang, targetLang, translateText, tagHandling, proxyURL, '');
      
      if (result.code === 200) {
        res.status(200).json({
          code: result.code,
          id: result.id,
          data: result.data,
          alternatives: result.alternatives,
          source_lang: result.source_lang,
          target_lang: result.target_lang,
          method: result.method
        });
      } else {
        res.status(result.code).json({
          code: result.code,
          message: result.message
        });
      }
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || 'Internal server error'
      });
    }
  });
  
  // Pro API endpoint, Pro Account required
  app.post('/v1/translate', authMiddleware, async (req: Request, res: Response) => {
    try {
      const { text: translateText, source_lang, target_lang, tag_handling } = req.body;
      
      const sourceLang = source_lang || '';
      const targetLang = target_lang || '';
      const tagHandling = tag_handling || '';
      const proxyURL = cfg.proxy || '';
      
      let dlSession = cfg.dlSession || '';
      
      // Get dl_session from cookie header
      const cookie = req.headers.cookie;
      if (cookie) {
        const cookieMatch = cookie.match(/dl_session=([^;]+)/);
        if (cookieMatch) {
          dlSession = cookieMatch[1];
        }
      }
      
      if (tagHandling && tagHandling !== 'html' && tagHandling !== 'xml') {
        return res.status(400).json({
          code: 400,
          message: 'Invalid tag_handling value. Allowed values are \'html\' and \'xml\'.'
        });
      }
      
      if (!dlSession) {
        return res.status(401).json({
          code: 401,
          message: 'No dl_session Found'
        });
      } else if (dlSession.includes('.')) {
        return res.status(401).json({
          code: 401,
          message: 'Your account is not a Pro account. Please upgrade your account or switch to a different account.'
        });
      }
      
      const result = await translateByDeepLX(sourceLang, targetLang, translateText, tagHandling, proxyURL, dlSession);
      
      if (result.code === 200) {
        res.status(200).json({
          code: result.code,
          id: result.id,
          data: result.data,
          alternatives: result.alternatives,
          source_lang: result.source_lang,
          target_lang: result.target_lang,
          method: result.method
        });
      } else {
        res.status(result.code).json({
          code: result.code,
          message: result.message
        });
      }
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || 'Internal server error'
      });
    }
  });
  
  // Free API endpoint, Consistent with the official API format
  app.post('/v2/translate', authMiddleware, async (req: Request, res: Response) => {
    try {
      const proxyURL = cfg.proxy || '';
      
      let translateText = '';
      let targetLang = '';
      
      // Handle form data or JSON body
      if (req.body.text && req.body.target_lang) {
        // JSON format
        if (Array.isArray(req.body.text)) {
          translateText = req.body.text.join('\n');
        } else {
          translateText = req.body.text;
        }
        targetLang = req.body.target_lang;
      } else if (req.body.text && req.query.target_lang) {
        // Mixed format
        translateText = req.body.text;
        targetLang = req.query.target_lang as string;
      } else {
        return res.status(400).json({
          code: 400,
          message: 'Invalid request payload'
        });
      }
      
      const result = await translateByDeepLX('', targetLang, translateText, '', proxyURL, '');
      
      if (result.code === 200) {
        res.status(200).json({
          translations: [{
            detected_source_language: result.source_lang,
            text: result.data
          }]
        });
      } else {
        res.status(result.code).json({
          code: result.code,
          message: result.message
        });
      }
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || 'Internal server error'
      });
    }
  });
  
  // Catch-all route to handle undefined paths
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
      code: 404,
      message: 'Path not found'
    });
  });
  
  return app;
}
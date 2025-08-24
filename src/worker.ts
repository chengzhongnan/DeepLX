// DeepLX Cloudflare Worker Implementation
import { translateByDeepLX } from './translate/translate';

export interface Env {
  TOKEN: string;
  DL_SESSION: string;
  PROXY: string;
}

// Auth middleware
function checkAuth(request: Request, env: Env): boolean {
  if (!env.TOKEN) {
    return true; // No token required
  }
  
  // Check query parameter
  const url = new URL(request.url);
  const tokenFromQuery = url.searchParams.get('token');
  if (tokenFromQuery === env.TOKEN) {
    return true;
  }
  
  // Check authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2) {
      if (parts[0] === 'Bearer' || parts[0] === 'DeepL-Auth-Key') {
        return parts[1] === env.TOKEN;
      }
    } else {
      return authHeader === env.TOKEN;
    }
  }
  
  return false;
}

// Parse JSON body
async function parseBody(request: Request): Promise<any> {
  try {
    const contentType = request.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return await request.json();
    }
    return {};
  } catch (e) {
    return {};
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Root endpoint
    if (method === 'GET' && path === '/') {
      return new Response(
        JSON.stringify({
          code: 200,
          message: 'DeepL Free API, Developed by sjlleo and missuo. Go to /translate with POST. http://github.com/OwO-Network/DeepLX'
        }),
        {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }

    // Free API endpoint, No Pro Account required
    if (method === 'POST' && path === '/translate') {
      if (!checkAuth(request, env)) {
        return new Response(
          JSON.stringify({
            code: 401,
            message: 'Invalid access token'
          }),
          {
            status: 401,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }

      try {
        const body = await parseBody(request);
        const { text: translateText, source_lang, target_lang, tag_handling } = body;
        
        const sourceLang = source_lang || '';
        const targetLang = target_lang || '';
        const tagHandling = tag_handling || '';
        const proxyURL = env.PROXY || '';
        
        if (tagHandling && tagHandling !== 'html' && tagHandling !== 'xml') {
          return new Response(
            JSON.stringify({
              code: 400,
              message: 'Invalid tag_handling value. Allowed values are \'html\' and \'xml\'.'
            }),
            {
              status: 400,
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            }
          );
        }
        
        const result = await translateByDeepLX(sourceLang, targetLang, translateText, tagHandling, proxyURL, '');
        
        if (result.code === 200) {
          return new Response(
            JSON.stringify({
              code: result.code,
              id: result.id,
              data: result.data,
              alternatives: result.alternatives,
              source_lang: result.source_lang,
              target_lang: result.target_lang,
              method: result.method
            }),
            {
              status: 200,
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            }
          );
        } else {
          return new Response(
            JSON.stringify({
              code: result.code,
              message: result.message
            }),
            {
              status: result.code,
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            }
          );
        }
      } catch (error: any) {
        return new Response(
          JSON.stringify({
            code: 500,
            message: error.message || 'Internal server error'
          }),
          {
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }
    }

    // Pro API endpoint, Pro Account required
    if (method === 'POST' && path === '/v1/translate') {
      if (!checkAuth(request, env)) {
        return new Response(
          JSON.stringify({
            code: 401,
            message: 'Invalid access token'
          }),
          {
            status: 401,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }

      try {
        const body = await parseBody(request);
        const { text: translateText, source_lang, target_lang, tag_handling } = body;
        
        const sourceLang = source_lang || '';
        const targetLang = target_lang || '';
        const tagHandling = tag_handling || '';
        const proxyURL = env.PROXY || '';
        
        let dlSession = env.DL_SESSION || '';
        
        // Get dl_session from cookie header
        const cookie = request.headers.get('Cookie');
        if (cookie) {
          const cookieMatch = cookie.match(/dl_session=([^;]+)/);
          if (cookieMatch) {
            dlSession = cookieMatch[1];
          }
        }
        
        if (tagHandling && tagHandling !== 'html' && tagHandling !== 'xml') {
          return new Response(
            JSON.stringify({
              code: 400,
              message: 'Invalid tag_handling value. Allowed values are \'html\' and \'xml\'.'
            }),
            {
              status: 400,
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            }
          );
        }
        
        if (!dlSession) {
          return new Response(
            JSON.stringify({
              code: 401,
              message: 'No dl_session Found'
            }),
            {
              status: 401,
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            }
          );
        } else if (dlSession.includes('.')) {
          return new Response(
            JSON.stringify({
              code: 401,
              message: 'Your account is not a Pro account. Please upgrade your account or switch to a different account.'
            }),
            {
              status: 401,
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            }
          );
        }
        
        const result = await translateByDeepLX(sourceLang, targetLang, translateText, tagHandling, proxyURL, dlSession);
        
        if (result.code === 200) {
          return new Response(
            JSON.stringify({
              code: result.code,
              id: result.id,
              data: result.data,
              alternatives: result.alternatives,
              source_lang: result.source_lang,
              target_lang: result.target_lang,
              method: result.method
            }),
            {
              status: 200,
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            }
          );
        } else {
          return new Response(
            JSON.stringify({
              code: result.code,
              message: result.message
            }),
            {
              status: result.code,
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            }
          );
        }
      } catch (error: any) {
        return new Response(
          JSON.stringify({
            code: 500,
            message: error.message || 'Internal server error'
          }),
          {
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }
    }

    // Free API endpoint, Consistent with the official API format
    if (method === 'POST' && path === '/v2/translate') {
      if (!checkAuth(request, env)) {
        return new Response(
          JSON.stringify({
            code: 401,
            message: 'Invalid access token'
          }),
          {
            status: 401,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }

      try {
        const body = await parseBody(request);
        const proxyURL = env.PROXY || '';
        
        let translateText = '';
        let targetLang = '';
        
        // Handle form data or JSON body
        if (body.text && body.target_lang) {
          // JSON format
          if (Array.isArray(body.text)) {
            translateText = body.text.join('\n');
          } else {
            translateText = body.text;
          }
          targetLang = body.target_lang;
        } else if (body.text && url.searchParams.get('target_lang')) {
          // Mixed format
          translateText = body.text;
          targetLang = url.searchParams.get('target_lang') || '';
        } else {
          return new Response(
            JSON.stringify({
              code: 400,
              message: 'Invalid request payload'
            }),
            {
              status: 400,
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            }
          );
        }
        
        const result = await translateByDeepLX('', targetLang, translateText, '', proxyURL, '');
        
        if (result.code === 200) {
          return new Response(
            JSON.stringify({
              translations: [{
                detected_source_language: result.source_lang,
                text: result.data
              }]
            }),
            {
              status: 200,
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            }
          );
        } else {
          return new Response(
            JSON.stringify({
              code: result.code,
              message: result.message
            }),
            {
              status: result.code,
              headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            }
          );
        }
      } catch (error: any) {
        return new Response(
          JSON.stringify({
            code: 500,
            message: error.message || 'Internal server error'
          }),
          {
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }
    }

    // 404 for undefined paths
    return new Response(
      JSON.stringify({
        code: 404,
        message: 'Path not found'
      }),
      {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
};
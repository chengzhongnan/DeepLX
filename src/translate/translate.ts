// DeepLX TypeScript Implementation
// Core translation functionality

import axios, { AxiosRequestConfig } from 'axios';
import { getICount, getRandomNumber, getTimeStamp, formatPostString, handlerBodyMethod } from '../utils';
import { PostData, Lang, Params, TextItem, DeepLXTranslationResult } from '../types';
// Note: For language detection, we would need a TypeScript equivalent of whatlanggo
// For now, we'll create a simplified version

// Simplified language detection (in a real implementation, you would use a proper library)
function detectLanguage(text: string): string {
  // This is a very basic implementation - in reality, you would use a proper language detection library
  return 'EN';
}

// makeRequestWithBody makes an HTTP request with pre-formatted body using minimal headers
async function makeRequestWithBody(postStr: string, proxyURL: string, dlSession: string): Promise<any> {
  const urlFull = 'https://www2.deepl.com/jsonrpc';
  
  // Set up headers
  const headers: any = {
    'Content-Type': 'application/json',
  };
  
  if (dlSession) {
    headers['Cookie'] = `dl_session=${dlSession}`;
  }
  
  // Set up axios config
  const config: AxiosRequestConfig = {
    method: 'POST',
    url: urlFull,
    headers: headers,
    data: postStr,
    // Note: For proxy support, you would configure it here
  };
  
  try {
    const response = await axios(config);
    
    // Check for blocked status
    if (response.status === 429) {
      throw new Error('Too many requests, your IP has been blocked by DeepL temporarily, please don\'t request it frequently in a short time');
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
}

// TranslateByDeepLX performs translation using DeepL API
export async function translateByDeepLX(
  sourceLang: string,
  targetLang: string,
  text: string,
  tagHandling: string,
  proxyURL: string,
  dlSession: string
): Promise<DeepLXTranslationResult> {
  if (!text) {
    return {
      code: 404,
      id: 0,
      message: 'No text to translate',
      data: '',
      alternatives: [],
      source_lang: '',
      target_lang: targetLang,
      method: dlSession ? 'Pro' : 'Free'
    };
  }
  
  // Get detected language if source language is auto
  if (sourceLang === 'auto' || !sourceLang) {
    sourceLang = detectLanguage(text);
  }
  
  // Prepare translation request using new LMT_handle_texts method
  const id = getRandomNumber();
  const iCount = getICount(text);
  const timestamp = getTimeStamp(iCount);
  
  const postData: PostData = {
    jsonrpc: '2.0',
    method: 'LMT_handle_texts',
    id: id,
    params: {
      splitting: 'newlines',
      lang: {
        source_lang_user_selected: sourceLang,
        target_lang: targetLang
      },
      texts: [{
        text: text,
        requestAlternatives: 3
      }],
      timestamp: timestamp
    }
  };
  
  // Format and apply body manipulation method like TypeScript
  let postStr = formatPostString(postData);
  postStr = handlerBodyMethod(id, postStr);
  
  try {
    // Make translation request
    const result = await makeRequestWithBody(postStr, proxyURL, dlSession);
    
    // Process translation results using new format
    const textsArray = result.result.texts;
    if (!textsArray || textsArray.length === 0) {
      return {
        code: 503,
        id: id,
        message: 'Translation failed',
        data: '',
        alternatives: [],
        source_lang: sourceLang,
        target_lang: targetLang,
        method: dlSession ? 'Pro' : 'Free'
      };
    }
    
    // Get main translation
    const mainText = textsArray[0].text;
    if (!mainText) {
      return {
        code: 503,
        id: id,
        message: 'Translation failed',
        data: '',
        alternatives: [],
        source_lang: sourceLang,
        target_lang: targetLang,
        method: dlSession ? 'Pro' : 'Free'
      };
    }
    
    // Get alternatives
    const alternatives: string[] = [];
    const alternativesArray = textsArray[0].alternatives || [];
    for (const alt of alternativesArray) {
      if (alt.text) {
        alternatives.push(alt.text);
      }
    }
    
    // Get detected source language from response
    const detectedLang = result.result.lang;
    if (detectedLang) {
      sourceLang = detectedLang;
    }
    
    return {
      code: 200,
      id: id,
      data: mainText,
      alternatives: alternatives,
      source_lang: sourceLang,
      target_lang: targetLang,
      method: dlSession ? 'Pro' : 'Free'
    };
  } catch (error: any) {
    return {
      code: 503,
      id: id,
      message: error.message || 'Translation failed',
      data: '',
      alternatives: [],
      source_lang: sourceLang,
      target_lang: targetLang,
      method: dlSession ? 'Pro' : 'Free'
    };
  }
}
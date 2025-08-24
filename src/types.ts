// DeepLX TypeScript Implementation
// Types for translation requests and responses

// Lang represents the language settings for translation
export interface Lang {
  source_lang_user_selected: string; // Can be "auto"
  target_lang: string;
  source_lang_computed?: string;
}

// CommonJobParams represents common parameters for translation jobs
export interface CommonJobParams {
  formality: string; // Can be "undefined"
  transcribe_as: string;
  mode: string;
  wasSpoken: boolean;
  advancedMode: boolean;
  textType: string;
  regionalVariant?: string;
}

// Sentence represents a sentence in the translation request
export interface Sentence {
  prefix: string;
  text: string;
  id: number;
}

// Job represents a translation job
export interface Job {
  kind: string;
  preferred_num_beams: number;
  raw_en_context_before: string[];
  raw_en_context_after: string[];
  sentences: Sentence[];
}

// TextItem represents a text item for translation
export interface TextItem {
  text: string;
  requestAlternatives: number;
}

// Params represents parameters for translation requests
export interface Params {
  splitting: string;
  lang: Lang;
  texts: TextItem[];
  timestamp: number;
}

// LegacyParams represents the old parameters structure for jobs (kept for compatibility)
export interface LegacyParams {
  commonJobParams: CommonJobParams;
  lang: Lang;
  jobs: Job[];
  timestamp: number;
}

// PostData represents the complete translation request
export interface PostData {
  jsonrpc: string;
  method: string;
  id: number;
  params: Params;
}

// TextResponse represents a single text response
export interface TextResponse {
  text: string;
  alternatives: {
    text: string;
  }[];
}

// TranslationResponse represents the response from LMT_handle_texts
export interface TranslationResponse {
  jsonrpc: string;
  id: number;
  result: {
    lang: string;
    texts: TextResponse[];
  };
}

// LegacyTranslationResponse represents the old response format (kept for compatibility)
export interface LegacyTranslationResponse {
  jsonrpc: string;
  id: number;
  result: {
    translations: {
      beams: {
        sentences: SentenceResponse[];
        num_symbols: number;
        rephrase_variant: {
          name: string;
        };
      }[];
      quality: string;
    }[];
    target_lang: string;
    source_lang: string;
    source_lang_is_confident: boolean;
    detectedLanguages: { [key: string]: any };
  };
}

// SentenceResponse is a helper struct for the response sentences
export interface SentenceResponse {
  text: string;
  ids: number[];
}

// DeepLXTranslationResult represents the final translation result
export interface DeepLXTranslationResult {
  code: number;
  id: number;
  message?: string;
  data: string; // The primary translated text
  alternatives: string[]; // Other possible translations
  source_lang: string;
  target_lang: string;
  method: string;
}

// Config represents the application configuration
export interface Config {
  ip: string;
  port: number;
  token: string;
  dlSession: string;
  proxy: string;
}
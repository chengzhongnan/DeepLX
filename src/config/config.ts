// DeepLX TypeScript Implementation
// Configuration management

import { Config } from '../types';

export function initConfig(): Config {
  const cfg: Config = {
    ip: process.env.IP || '0.0.0.0',
    port: parseInt(process.env.PORT || '1188', 10),
    token: process.env.TOKEN || '',
    dlSession: process.env.DL_SESSION || '',
    proxy: process.env.PROXY || ''
  };
  
  return cfg;
}
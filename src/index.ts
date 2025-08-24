// DeepLX TypeScript Implementation
// Main entry point

import { initConfig } from './config/config';
import { createRouter } from './routes/routes';

function main() {
  const cfg = initConfig();
  
  console.log(`DeepL X has been successfully launched! Listening on ${cfg.ip}:${cfg.port}`);
  console.log('Developed by sjlleo <i@leo.moe> and missuo <me@missuo.me>.');
  
  if (cfg.token) {
    console.log('Access token is set.');
  }
  
  // Set Proxy
  if (cfg.proxy) {
    console.log(`Proxy is set to ${cfg.proxy}`);
  }
  
  const app = createRouter(cfg);
  
  app.listen(cfg.port, cfg.ip, () => {
    console.log(`Server is running on http://${cfg.ip}:${cfg.port}`);
  });
}

main();
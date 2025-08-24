// Test server setup
import express from 'express';
import { createRouter } from '../src/routes/routes';
import { initConfig } from '../src/config/config';

// Create a test configuration
export function createTestConfig() {
  return {
    ip: '127.0.0.1',
    port: 9090,
    token: 'test-token',
    dlSession: '',
    proxy: ''
  };
}

// Create test server
export function createTestServer() {
  const cfg = createTestConfig();
  const app = createRouter(cfg);
  return app;
}
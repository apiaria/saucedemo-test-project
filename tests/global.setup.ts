import { test as setup } from '@playwright/test';
import * as dotenv from 'dotenv';
import { validateEnv } from '../src/config/validateEnv';

setup('validate environment', async () => {
  dotenv.config();
  console.log('[setup project] Running validateEnv...');
  validateEnv();
});

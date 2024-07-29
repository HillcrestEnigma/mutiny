import baseConfig from './base.js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import queryPlugin from '@tanstack/eslint-plugin-query';
import hooksPlugin from 'eslint-plugin-react-hooks';
import { fixupPluginRules } from '@eslint/compat';

export default [
  ...baseConfig,
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ...reactPlugin.configs.flat.recommended,
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  reactPlugin.configs.flat['jsx-runtime'],
  ...queryPlugin.configs['flat/recommended'],
  {
    plugins: {
      'react-hooks': fixupPluginRules(hooksPlugin),
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
    },
  },
];

import coreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const config = [...coreWebVitals, ...nextTypescript];

// eslint-plugin-react v7 uses getFilename() which was removed in ESLint 10.
// Override the react version detection setting to avoid the runtime error.
for (const entry of config) {
  if (entry.settings?.react?.version === 'detect') {
    entry.settings.react.version = '19';
  }
}

export default config;

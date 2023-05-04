/* eslint-disable @typescript-eslint/naming-convention */
import { ManifestV3Export } from '@crxjs/vite-plugin';

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name            : 'YouTube Speed Controller',
  description     : 'YouTube Speed Controller',
  version         : '1.0.1',
  background      : {
    service_worker: 'src/background/index.ts',
  },
  content_scripts: [
    {
      matches: ['https://www.youtube.com/*'],
      js     : ['src/content/index.tsx'],
    },
  ],
  host_permissions: ['<all_urls>'],

  options_ui: {
    page       : 'src/options/options.html',
    open_in_tab: true,
  },

  web_accessible_resources: [
    {
      resources: [

        // this file is web accessible; it supports HMR b/c it's declared in `rollupOptions.input`
        'src/welcome/welcome.html',
      ],
      matches: ['<all_urls>'],
    },
  ],
  action: {
    default_popup: 'src/popup/popup.html',
    default_icon : {
      '16' : 'images/icon.png',
      '32' : 'images/icon.png',
      '48' : 'images/icon.png',
      '128': 'images/icon.png',
    },
  },
  icons: {
    '16' : 'images/icon.png',
    '32' : 'images/icon.png',
    '48' : 'images/icon.png',
    '128': 'images/icon.png',
  },
  permissions: ['storage', 'tabs'],
};

export default manifest;

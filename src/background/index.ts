import browser from 'webextension-polyfill';

import store from '../app/store';
import { isDev } from '../shared/utils';

store.subscribe(() => {
  console.log('state', store.getState());
});

// show welcome page on new install
browser.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {

    // show the welcome page
    // const url = browser.runtime.getURL(isDev ? 'src/welcome/welcome.html' : 'welcome.html'); // TODO: better approach
    // await browser.tabs.create({ url });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(
      tabId,
      {
        url: changeInfo.url,
      },
      function (msg) {
        console.log('result message:', msg);
      }
    );
  }
});

// #################### Start of https://github.com/xpl/crx-hotreload/blob/master/hot-reload.js ######################
// const filesInDirectory = (dir: any): any =>
//   new Promise((resolve) =>
//     dir.createReader().readEntries((entries: any) =>
//       Promise.all(
//         entries
//           .filter((e: any) => e.name[0] !== '.')
//           .map((e: any) =>
//             e.isDirectory ? filesInDirectory(e) : new Promise((resolve) => e.file(resolve))
//           )
//       )
//         .then((files) => [].concat(...files))
//         .then(resolve)
//     )
//   );

// const timestampForFilesInDirectory = (dir: any): any =>
//   filesInDirectory(dir).then((files: any) =>
//     files.map((f: any) => f.name + f.lastModifiedDate).join()
//   );

// const watchChanges = (dir: any, lastTimestamp: any): any => {
//   timestampForFilesInDirectory(dir).then((timestamp: any) => {
//     if (!lastTimestamp || lastTimestamp === timestamp) {
//       setTimeout(() => watchChanges(dir, timestamp), 1000); // retry after 1s
//     } else {
//       chrome.runtime.reload();
//     }
//   });
// };

// chrome.management.getSelf((self) => {
//   if (self.installType === 'development') {
//     chrome.runtime.getPackageDirectoryEntry((dir) => watchChanges(dir, 1));
//     chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {

//       // NB: see https://github.com/xpl/crx-hotreload/issues/5
//       if (tabs[0].id) {
//         chrome.tabs.reload(tabs[0].id);
//       }
//     });
//   }
// });

// #################### End of https://github.com/xpl/crx-hotreload/blob/master/hot-reload.js ######################3

export {};

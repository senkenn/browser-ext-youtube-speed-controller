import { getBucket } from '@extend-chrome/storage';
import { CATEGORY_TITLES, CategoryTitle, VIDEO_CATEGORIES } from './features/youtubeApi/youtubeApi';
import { ObjectKeys } from '../shared/utils/TypeMaps';
import { Message } from '../popup/Popup';

const Content = (): JSX.Element => {
  return <></>;
};

export default Content;

// Get Bucket data
const bucket = getBucket<BucketValueType>('playbackRate', 'sync');
bucketInitialization();

export type PlayBackRatesByCategory = {
  [key in CategoryTitle]: number;
};

/**
 * バケットを初期化する
 * - カテゴリリストの作成
 * - 再生速度を初期値１倍で設定
 */
export async function bucketInitialization(): Promise<void> {
  const bucketValue = await bucket.get();
  if (ObjectKeys(bucketValue).length) {
    return;
  }

  const playbackRatesByCategoryId: PlayBackRatesByCategory = {} as PlayBackRatesByCategory;
  ObjectKeys(VIDEO_CATEGORIES).map((key) => {
    playbackRatesByCategoryId[key] = 1;
  });

  bucket.set({
    currentCategoryTitle   : 'Film & Animation',
    videoCategories        : VIDEO_CATEGORIES,
    playbackRatesByCategory: playbackRatesByCategoryId,
  });
}

export type BucketValueType = {
  currentCategoryTitle: CategoryTitle;
  videoCategories: typeof VIDEO_CATEGORIES;
  playbackRatesByCategory: PlayBackRatesByCategory;
};

/**
 * 再生速度を変更する
 */
async function playVideoAtPlayBackRateOnStorage(): Promise<void> {

  // ストレージの取得
  const bucketValue = await bucket.get();

  const currentUrl = location.href;

  // 動画再生ページじゃなかったら何もせず終了
  const isVideoPlayPage = currentUrl.includes('https://www.youtube.com/watch');
  if (!isVideoPlayPage) {
    return;
  }

  /**
   * 現在のHTMLのソースコードから"category": "Gaming"のGamingようにカテゴリ部分を抽出したもの
   *
   * 以下正規表現の説明
   * - "category": ： "category" に一致する
   * - \s* ： 0個以上の空白文字に一致する
   * - " ： " に一致する
   * - ([^"]+) ： 1個以上の " 以外の文字列に一致する。この部分はキャプチャーグループになっており、後で取り出すために match[1] に格納される。
   * - " ： " に一致する
   */
  const htmlSourceCode = await (await fetch(currentUrl)).text();
  const match = htmlSourceCode.match(/"category":\s*"([^"]+)"/);
  if (!match) {
    throw new Error(`"category" is not found in HTML source, ${currentUrl}`);
  }

  const categoryTitleFromHTML = match[1].replace('\\u0026', '&') as CategoryTitle; // HTMLソースの方は"&"が"\u0026"になっているので"&"に直す
  if (CATEGORY_TITLES.find((title) => title === categoryTitleFromHTML)) {
    bucket.set({
      currentCategoryTitle: categoryTitleFromHTML,
    });
  } else {
    throw new Error(
      'Cannot find category title. Check the page source one and setting value of the category.'
    );
  }

  const playbackRate = bucketValue.playbackRatesByCategory[categoryTitleFromHTML];
  console.log(`${categoryTitleFromHTML}: x ${playbackRate}`);

  // YouTubeの再生速度をバケットの方に設定し直す
  const videoElem = document.querySelector('video');
  if (videoElem) {
    videoElem.playbackRate = playbackRate;
  }
}

chrome.runtime.onMessage.addListener(function (msg: Message, sender, sendResponse) {
  if (msg.speed) {
    const videoElem = document.querySelector('video');
    if (videoElem) {
      videoElem.playbackRate = msg.speed;
      console.log('Set playback rate to ' + videoElem.playbackRate);
    }

    sendResponse('Changed playback rate to ' + msg.speed);
  } if (msg.url) {
    console.log(msg.url);
    playVideoAtPlayBackRateOnStorage();
    sendResponse('Changed playback rate');
  } else {
    sendResponse('No playback rate specified');
  }
});

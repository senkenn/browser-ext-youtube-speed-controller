import { getBucket } from '@extend-chrome/storage';
import { CATEGORY_TITLES, CategoryTitle, VIDEO_CATEGORIES } from './features/youtubeApi/youtubeApi';
import { ObjectKeys } from '../shared/utils/TypeMaps';
import { Message } from '../popup/Popup';

const Content = (): JSX.Element => {

  // Playback Rate
  playVideoAtPlayBackRateOnStorage();
  detectNewVideo(playVideoAtPlayBackRateOnStorage);

  return <></>;
};

export default Content;

// Bucket Initialization
const bucket = getBucket<BucketValueType>('playbackRate', 'sync');
bucket.set(initBucketValue());

/**
 * 新しい動画の再生をDOMの変更で検知する
 *
 * @param storePlayBackRate 新しい動画を再生したときに再生速度をストレージに保存する
 */
function detectNewVideo(storePlayBackRate: MutationCallback): void {

  // ターゲット要素をDOMで取得
  const target = document.getElementById('movie_player');

  // インスタンス化
  const obs = new MutationObserver(storePlayBackRate);

  // ターゲット要素の監視を開始
  if (target !== null) {
    obs.observe(target, {
      childList: true, // 直接の子の変更を監視
      // characterData        : true, // 文字の変化を監視
      // characterDataOldValue: true, // 属性の変化前を記録
      // attributes           : true, // 属性の変化を監視
      // subtree              : true, // 全ての子要素を監視
    });
  }
}

// const PlayBackRateSchema = z.enum(['0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2']);
// const SessionStorageSchemaOfPlayBackRate = z.object({

//   /**
//    * 再生速度
//    */
//   data: PlayBackRateSchema,

//   /**
//    * UNIX時間（ミリ秒）
//    */
//   creation: z.number(),
// });

export type PlayBackRatesByCategory = {
  [key in CategoryTitle]: number;
};

/**
 * バケットを初期化する
 * - カテゴリリストの作成
 * - 再生速度を初期値１倍で設定
 */
export function initBucketValue(): BucketValueType {
  const playbackRatesByCategoryId: PlayBackRatesByCategory = {} as PlayBackRatesByCategory;
  ObjectKeys(VIDEO_CATEGORIES).map((key) => {
    playbackRatesByCategoryId[key] = 1;
  });
  return {
    currentCategoryTitle   : 'Film & Animation',
    videoCategories        : VIDEO_CATEGORIES,
    playbackRatesByCategory: playbackRatesByCategoryId,
  };
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

  // セッションストレージの取得
  // const playBackRateJsonString = sessionStorage.getItem('yt-player-playback-rate');
  // const sessionStorageOfPlayBackRateOnYT: PlayBackRateOfSessionStorageSchemaType =
  //   playBackRateJsonString === null
  //     ? { data: '1', creation: Date.now() }
  //     : SessionStorageSchemaOfPlayBackRate.parse(JSON.parse(playBackRateJsonString));

  // ストレージの取得
  const bucketValue = await bucket.get();

  // 現在のURLから
  const htmlSourceCode = await (await fetch(location.href)).text();

  /**
   * HTMLのソースコードから"category": "Gaming"のGamingようにカテゴリ部分を抽出したもの
   *
   * 以下正規表現の説明
   * - "category": ： "category" に一致する
   * - \s* ： 0個以上の空白文字に一致する
   * - " ： " に一致する
   * - ([^"]+) ： 1個以上の " 以外の文字列に一致する。この部分はキャプチャーグループになっており、後で取り出すために match[1] に格納される。
   * - " ： " に一致する
   */
  const match = htmlSourceCode.match(/"category":\s*"([^"]+)"/);
  if (!match) {
    throw new Error('"category" is not found in HTML source.');
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

  console.log(categoryTitleFromHTML);
  const playbackRate = bucketValue.playbackRatesByCategory[categoryTitleFromHTML];
  console.log('playBackRateOnBucket:', playbackRate);

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
  } else {
    sendResponse('No playback rate specified');
  }
});

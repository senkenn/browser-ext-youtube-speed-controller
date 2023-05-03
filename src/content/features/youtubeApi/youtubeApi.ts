/* eslint-disable @typescript-eslint/naming-convention */

import { ObjectKeys } from '../../../shared/utils/TypeMaps';

/**
 * 動画カテゴリリスト(2023/04/20時点)
 *
 * @see https://developers.google.com/youtube/v3/docs/videoCategories/list?hl=ja
 */
export const VIDEO_CATEGORIES = {
  'Film & Animation'     : { jaTitle: '映画とアニメ' },
  'Autos & Vehicles'     : { jaTitle: '自動車と乗り物' },
  Music                  : { jaTitle: '音楽' },
  'Pets & Animals'       : { jaTitle: 'ペットと動物' },
  Sports                 : { jaTitle: 'スポーツ' },
  'Short Movies'         : { jaTitle: 'ショート ムービー' },
  'Travel & Events'      : { jaTitle: '旅行とイベント' },
  Gaming                 : { jaTitle: 'ゲーム' },
  Videoblogging          : { jaTitle: '動画ブログ' },
  'People & Blogs'       : { jaTitle: 'ブログ' },
  Comedy                 : { jaTitle: 'コメディー' },
  Entertainment          : { jaTitle: 'エンターテイメント' },
  'News & Politics'      : { jaTitle: 'ニュースと政治' },
  'Howto & Style'        : { jaTitle: 'ハウツーとスタイル' },
  Education              : { jaTitle: '教育' },
  'Science & Technology' : { jaTitle: '科学と技術' },
  'Nonprofits & Activism': { jaTitle: '非営利団体と社会運動' },
  Movies                 : { jaTitle: '映画' },
  'Anime/Animation'      : { jaTitle: 'アニメ' },
  'Action/Adventure'     : { jaTitle: 'アクション/アドベンチャー' },
  Classics               : { jaTitle: 'クラシック' },
  Documentary            : { jaTitle: 'ドキュメンタリー' },
  Drama                  : { jaTitle: 'ドラマ' },
  Family                 : { jaTitle: '家族向け' },
  Foreign                : { jaTitle: '海外' },
  Horror                 : { jaTitle: 'ホラー' },
  'Sci-Fi/Fantasy'       : { jaTitle: 'SF/ファンタジー' },
  Thriller               : { jaTitle: 'サスペンス' },
  Shorts                 : { jaTitle: '短編' },
  Shows                  : { jaTitle: '番組' },
  Trailers               : { jaTitle: '予告編' },
} as const;

export const CATEGORY_TITLES = ObjectKeys(VIDEO_CATEGORIES);
export type CategoryTitle = keyof typeof VIDEO_CATEGORIES;

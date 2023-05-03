// eslint-disable-next-line @typescript-eslint/naming-convention
export const VIDEO_CATEGORIES = [
  {
    id     : '1',
    title  : 'Film & Animation',
    jaTitle: '映画とアニメ',
  },
  {
    id     : '2',
    title  : 'Autos & Vehicles',
    jaTitle: '自動車と乗り物',
  },
  {
    id     : '10',
    title  : 'Music',
    jaTitle: '音楽',
  },
  {
    id     : '15',
    title  : 'Pets & Animals',
    jaTitle: 'ペットと動物',
  },
  {
    id     : '17',
    title  : 'Sports',
    jaTitle: 'スポーツ',
  },
  {
    id     : '18',
    title  : 'Short Movies',
    jaTitle: 'ショート ムービー',
  },
  {
    id     : '19',
    title  : 'Travel & Events',
    jaTitle: '旅行とイベント',
  },
  {
    id     : '20',
    title  : 'Gaming',
    jaTitle: 'ゲーム',
  },
  {
    id     : '21',
    title  : 'Videoblogging',
    jaTitle: '動画ブログ',
  },
  {
    id     : '22',
    title  : 'People & Blogs',
    jaTitle: 'ブログ',
  },
  {
    id     : '23',
    title  : 'Comedy',
    jaTitle: 'コメディー',
  },
  {
    id     : '24',
    title  : 'Entertainment',
    jaTitle: 'エンターテイメント',
  },
  {
    id     : '25',
    title  : 'News & Politics',
    jaTitle: 'ニュースと政治',
  },
  {
    id     : '26',
    title  : 'Howto & Style',
    jaTitle: 'ハウツーとスタイル',
  },
  {
    id     : '27',
    title  : 'Education',
    jaTitle: '教育',
  },
  {
    id     : '28',
    title  : 'Science & Technology',
    jaTitle: '科学と技術',
  },
  {
    id     : '29',
    title  : 'Nonprofits & Activism',
    jaTitle: '非営利団体と社会運動',
  },
  {
    id     : '30',
    title  : 'Movies',
    jaTitle: '映画',
  },
  {
    id     : '31',
    title  : 'Anime/Animation',
    jaTitle: 'アニメ',
  },
  {
    id     : '32',
    title  : 'Action/Adventure',
    jaTitle: 'アクション/アドベンチャー',
  },
  {
    id     : '33',
    title  : 'Classics',
    jaTitle: 'クラシック',
  },
  {
    id     : '34',
    title  : 'Comedy',
    jaTitle: 'コメディー',
  },
  {
    id     : '35',
    title  : 'Documentary',
    jaTitle: 'ドキュメンタリー',
  },
  {
    id     : '36',
    title  : 'Drama',
    jaTitle: 'ドラマ',
  },
  {
    id     : '37',
    title  : 'Family',
    jaTitle: '家族向け',
  },
  {
    id     : '38',
    title  : 'Foreign',
    jaTitle: '海外',
  },
  {
    id     : '39',
    title  : 'Horror',
    jaTitle: 'ホラー',
  },
  {
    id     : '40',
    title  : 'Sci-Fi/Fantasy',
    jaTitle: 'SF/ファンタジー',
  },
  {
    id     : '41',
    title  : 'Thriller',
    jaTitle: 'サスペンス',
  },
  {
    id     : '42',
    title  : 'Shorts',
    jaTitle: '短編',
  },
  {
    id     : '43',
    title  : 'Shows',
    jaTitle: '番組',
  },
  {
    id     : '44',
    title  : 'Trailers',
    jaTitle: '予告編',
  },
] as const;

const obj = {};
for (const category of VIDEO_CATEGORIES) {
  const { id, ...rest } = category;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  obj[id] = rest;
}

console.log(obj);

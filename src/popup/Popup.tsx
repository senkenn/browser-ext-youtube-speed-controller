import React, { ReactElement, useEffect, useState } from 'react';
import { BucketValueType, PlayBackRatesByCategory } from '../content/Content';
import { getBucket } from '@extend-chrome/storage';
import { ObjectKeys } from '../shared/utils/TypeMaps';
import { CategoryTitle } from '../content/features/youtubeApi/youtubeApi';

const bucket = getBucket<BucketValueType>('playbackRate', 'sync');

type Controller = {
  minus: 'ー';
  plus: '＋';
};
export type Message = {
  speed: number;
};
const controller: Controller = {
  minus: 'ー',
  plus : '＋',
};

const Popup = (): ReactElement => {
  document.body.style.width = '22rem';
  document.body.style.height = '55rem';
  document.body.style.marginLeft = '1rem';

  const [playbackRates, setPlaybackRates] = useState<PlayBackRatesByCategory>();
  const [currentCategoryTitle, setCurrentCategoryTitle] = useState<CategoryTitle>();

  // Initialization
  useEffect(() => {
    bucket.get().then((value) => {
      const { currentCategoryTitle, playbackRatesByCategory } = value;
      setCurrentCategoryTitle(currentCategoryTitle);
      setPlaybackRates(playbackRatesByCategory);
    });
  }, []);

  /**
   * 再生速度コントローラーボタン操作
   * @param clickedCategory クリックしたカテゴリ（カリー化）
   * @returns
   */
  const handleClick =
    (clickedCategory: CategoryTitle): React.MouseEventHandler<HTMLButtonElement> =>
      (event) => {
        if (currentCategoryTitle && playbackRates && playbackRates[currentCategoryTitle]) {
          let newPlaybackRate = playbackRates[clickedCategory];
          const delta = 0.25;
          if ((event.currentTarget as HTMLElement).innerText === controller.plus) {
            newPlaybackRate += delta;
          } else {
            newPlaybackRate -= delta;
          }
          console.log('Set playback rate to ', newPlaybackRate);

          const playbackRatesByCategory: PlayBackRatesByCategory = {
            ...playbackRates,
            [clickedCategory]: newPlaybackRate,
          };
          setPlaybackRates(playbackRatesByCategory);
          bucket.set({
            playbackRatesByCategory: playbackRatesByCategory,
          });

          // コンテンツスクリプトに速度を送信する
          if (currentCategoryTitle === clickedCategory) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
              if (tabs[0].id) {
                chrome.tabs.sendMessage(
                  tabs[0].id,
                {
                  speed: newPlaybackRate,
                } as Message,
                function (msg) {
                  console.log('result message:', msg);
                }
                );
              }
            });
          }
        }
      };

  return (
    <div className="flex justify-center flex-col">
      {/** Playback rate by category */}
      <div className="container">
        {playbackRates && currentCategoryTitle && (
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Speed</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                {/** Current Video */}
                <td className="border px-2 py-1 border-red-500">{currentCategoryTitle}</td>
                <td className="border px-2 py-1 border-red-500">
                  <button className="mr-3" onClick={handleClick(currentCategoryTitle)}>
                    {controller.minus}
                  </button>

                  {/** Playback Rate */}
                  <div className="inline-block w-8 text-center">
                    {playbackRates[currentCategoryTitle]}
                  </div>

                  <button className="ml-3" onClick={handleClick(currentCategoryTitle)}>
                    {controller.plus}
                  </button>
                </td>
                <td className="px-2 py-1 flex items-center">
                  <span className="mx-auto">Current Video</span>
                </td>
              </tr>

              {/** Other Category */}
              {ObjectKeys(playbackRates)
                .filter((category) => !(category === currentCategoryTitle))
                .map((category, index) => {
                  return (
                    <tr key={index}>
                      <td className="border px-2 py-1">{category}</td>
                      <td className="border px-2 py-1 ">
                        <button className="mr-3" onClick={handleClick(category)}>
                          {controller.minus}
                        </button>

                        {/** Playback Rate */}
                        <div className="inline-block w-8 text-center">
                          {playbackRates[category]}
                        </div>

                        <button className="ml-3" onClick={handleClick(category)}>
                          {controller.plus}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Popup;

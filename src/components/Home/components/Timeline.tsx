import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import {
  selectIsPresentationLoading,
  selectPresentationsState,
} from "../../../core/presentations/presentations.selector";
import { getAllPresentationsThunk } from "../../../core/presentations/presentations.thunk";
import clsx from "clsx";
import { digitsToPersian } from "../../../utils/digitsToPersian";
import { IoTime } from "react-icons/io5";
import Skeleton from "../../Skeleton/Skeleton";

const Timeline = () => {
  const dispatch = useAppDispatch();
  const presentationLoading = useSelector(selectIsPresentationLoading);
  const { list: presentations, loadedFirstTime } = useSelector(
    selectPresentationsState
  );

  const [visibleCount, setVisibleCount] = useState(5); // Number of presentations to show initially

  useEffect(() => {
    if (!loadedFirstTime) {
      dispatch(getAllPresentationsThunk());
    }
  }, [loadedFirstTime]);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 5); // Load 5 more presentations
  };

  return (
    <>
      <div className="flex flex-col md:grid grid-cols-9 mx-auto p-4">
        {presentations.slice(0, visibleCount).map((presentation, index) =>
          index % 2 === 0 ? (
            <div className="flex flex-row-reverse md:contents" key={index}>
              <div
                className="w-full col-start-1 col-end-5 p-6 rounded-xl my-4 ml-auto border border-white/10 bg-gradient-to-r from-[#2C2C2C] to-[#3A3A3A] shadow-lg hover:shadow-xl transition-shadow duration-300"
                dir="ltr"
              >
                <h3 className="font-semibold text-2xl mb-2 text-white">
                  {presentation.en_title}
                </h3>
                {presentation.presenters && (
                  <div
                    className={clsx(
                      "w-full relative flex flex-row-reverse flex-wrap-reverse items-center my-3 px-2 h-[40px]",
                      {
                        ["gap-3"]: presentation.presenters.length <= 5,
                      }
                    )}
                  >
                    {presentation.presenters.length >= 5 ? (
                      <>
                        {presentation.presenters.map((presenter, index) => {
                          return (
                            index < 5 && (
                              <img
                                key={index}
                                src={presenter.avatar}
                                className="absolute min-w-[40px] h-[40px] rounded-full border-2 border-[#2C2C2C] z-1 object-cover"
                                style={{ right: `${(index + 1) * 20}px` }}
                              />
                            )
                          );
                        })}
                        <p
                          className="absolute text-sm text-gray-300"
                          style={{
                            right: `${
                              Math.min(8, presentation.presenters.length + 2) *
                              20
                            }px`,
                          }}
                        >
                          {digitsToPersian("بیش از 5 برگزار کننده")}
                        </p>
                      </>
                    ) : (
                      presentation.presenters.map((presenter, index) => {
                        return (
                          <img
                            key={index}
                            src={presenter.avatar}
                            className="w-[40px] h-[40px] rounded-full z-1 object-cover"
                          />
                        );
                      })
                    )}
                  </div>
                )}
                <div className="w-full flex flex-row-reverse items-center gap-2 text-gray-400 mt-2">
                  <IoTime size={18} className="text-indigo-500" />
                  <p>{new Date(presentation.start).toLocaleString()}</p>
                </div>
                <p
                  className="text-gray-400 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: presentation.fa_description,
                  }}
                  dir="rtl"
                />
              </div>

              <div className="col-start-5 col-end-6 md:mx-auto relative mr-10">
                <div className="h-full w-6 flex items-center justify-center">
                  <div className="h-full w-1 bg-indigo-500 pointer-events-none"></div>
                </div>

                <div
                  className={clsx(
                    "w-8 h-8 absolute top-1/2 -mt-4 border-4 border-indigo-500 rounded-full shadow-lg",
                    {
                      ["bg-secondary"]:
                        new Date(presentation.start).getTime() <=
                        new Date().getTime(),
                      ["bg-green-500"]:
                        new Date(presentation.start).getTime() >
                        new Date().getTime(),
                    }
                  )}
                />
              </div>
            </div>
          ) : (
            <div className="flex md:contents" key={index}>
              <div className="col-start-5 col-end-6 mr-10 md:mx-auto relative">
                <div className="h-full w-6 flex items-center justify-center">
                  <div className="h-full w-1 bg-indigo-500 pointer-events-none"></div>
                </div>

                <div
                  className={clsx(
                    "w-8 h-8 absolute top-1/2 -mt-4 border-4 border-indigo-500 rounded-full shadow-lg",
                    {
                      ["bg-secondary"]:
                        new Date(presentation.start).getTime() <=
                        new Date().getTime(),
                      ["bg-green-500"]:
                        new Date(presentation.start).getTime() >
                        new Date().getTime(),
                    }
                  )}
                />
              </div>

              <div className="w-full col-start-6 col-end-10 my-4 mr-auto p-6 border border-white/10 rounded-xl bg-gradient-to-r from-[#2C2C2C] to-[#3A3A3A] shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="font-semibold text-2xl mb-2 text-white">
                  {presentation.en_title}
                </h3>
                {presentation.presenters && (
                  <div
                    className={clsx(
                      "w-full relative flex flex-row-reverse flex-wrap-reverse items-center my-3 px-2 h-[40px]",
                      {
                        ["gap-3"]: presentation.presenters.length <= 5,
                      }
                    )}
                  >
                    {presentation.presenters.length >= 5 ? (
                      <>
                        {presentation.presenters.map((presenter, index) => {
                          return (
                            index < 5 && (
                              <img
                                key={index}
                                src={presenter.avatar}
                                className="absolute min-w-[40px] h-[40px] rounded-full border-2 border-[#2C2C2C] z-1 object-cover"
                                style={{ right: `${(index + 1) * 20}px` }}
                              />
                            )
                          );
                        })}
                        <p
                          className="absolute text-sm text-gray-300"
                          style={{
                            right: `${
                              Math.min(8, presentation.presenters.length + 2) *
                              20
                            }px`,
                          }}
                        >
                          {digitsToPersian("بیش از 5 برگزار کننده")}
                        </p>
                      </>
                    ) : (
                      <>
                        {presentation.presenters.map((presenter, index) => {
                          return (
                            <img
                              key={index}
                              src={presenter.avatar}
                              className="w-[40px] h-[40px] rounded-full z-1 object-cover"
                            />
                          );
                        })}
                        {presentation.presenters.length < 3 && (
                          <p className="text-sm text-gray-300">
                            {presentation.presenters
                              .map((p) => `${p.first_name} ${p.last_name}`)
                              .join("و")}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-400 my-2">
                  <IoTime size={18} className="text-indigo-500" />
                  <p>{new Date(presentation.start).toLocaleString()}</p>
                </div>
                <p
                  className="text-gray-400 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: presentation.fa_description,
                  }}
                  dir="rtl"
                />
              </div>
            </div>
          )
        )}
      </div>

      {presentations.length > visibleCount && (
        <div className="flex justify-center my-4">
          <button
            onClick={handleShowMore}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
          >
            نمایش بیشتر
          </button>
        </div>
      )}

      {presentations.length > 0 && visibleCount >= presentations.length && (
        <div className="w-full flex justify-center items-center my-4 p-6 border border-white/10 rounded-xl bg-gradient-to-r from-[#2C2C2C] to-[#3A3A3A] shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="font-semibold text-2xl mb-2 text-white">پایان</h3>
        </div>
      )}

      {presentationLoading && (
        <Skeleton
          className="rounded flex justify-center items-center text-xl font-bold"
          width={"100%"}
          height={200}
        >
          در حال دریافت اطلاعات
        </Skeleton>
      )}
    </>
  );
};

export default Timeline;

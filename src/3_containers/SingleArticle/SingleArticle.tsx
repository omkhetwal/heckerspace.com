import React, { FC, useEffect, useRef, useState } from "react";

import { AnimatePresence } from "framer-motion";

import HoverReplace from "1_components/HoverEffects/HoverReplace/HoverReplace";
import FadeInOut from "1_components/Transitions/FadeInOut/FadeInOut";
import ArticleHeader, {
  ArticleHeaderProps,
} from "2_sections/ArticleHeader/ArticleHeader";
import ModuleRenderer, {
  Modules,
} from "2_sections/ModuleRenderer/ModuleRenderer";
import useConfetti from "hooks/useConfetii";
import { useElementOffset } from "hooks/useElementOffset";
import { estimateReadingTimeInMinutes } from "utils/estimateReadingTime";
import { getArticleBadge, storeArticleBadge } from "utils/handleArticleBadge";

import * as S from "./SingleArticle.styled";

export interface ArticleProps extends ArticleHeaderProps {
  id: string;
  modules: Modules;
}

const Article: FC<ArticleProps> = ({
  id,
  title,
  modules,
  publishedAt,
  cover,
}) => {
  const articleWrapperRef = useRef<HTMLElement>(null);
  const { offsetX } = useElementOffset(articleWrapperRef);
  const { ref: buttonRef, fireConfetti } = useConfetti();

  const [isCompleted, setIsCompleted] = useState(false);

  const completedBadge = "completed 🙌";
  const viewedBadge = "viewed 👀";

  useEffect(() => {
    if (getArticleBadge(id) === completedBadge) {
      setIsCompleted(true);
    } else {
      storeArticleBadge(id, viewedBadge);
    }
  }, [id]);

  const extractChapterNames = (modules: Modules) => {
    const chapterNames: Array<string> = [];
    modules.forEach((module) => {
      if (module.__typename === "Chapter") {
        chapterNames.push(module.chapterName);
      }
    });
    return chapterNames;
  };

  const estimateReadingTime = (modules: Modules) => {
    let readingTime = 0;
    modules.forEach((element: any) => {
      readingTime = readingTime + estimateReadingTimeInMinutes(element.content);
    });

    return readingTime;
  };

  const allChapters = extractChapterNames(modules);
  const estimatedReadingTime = estimateReadingTime(modules);
  const shouldRenderChapters = allChapters.length > 1 && offsetX;

  const handleCompleteButtonClick = () => {
    storeArticleBadge(id, completedBadge);
    setIsCompleted(true);
    fireConfetti();
  };

  return (
    <>
      <S.SingleArticleWrapper ref={articleWrapperRef}>
        <ArticleHeader
          name="Łukasz Fiuk"
          cover={cover}
          title={title}
          publishedAt={publishedAt}
          estimatedReadingTime={estimatedReadingTime}
        />

        {shouldRenderChapters && (
          <S.MobileChapterSelector chapters={allChapters} />
        )}
        <S.ArticleContent>
          <ModuleRenderer modules={modules} />
          {shouldRenderChapters && (
            <S.DesktopChapterSelector
              chapters={allChapters}
              offsetX={offsetX}
            />
          )}
        </S.ArticleContent>

        <S.CompleteButton ref={buttonRef} onClick={handleCompleteButtonClick}>
          <HoverReplace direction="up">
            <AnimatePresence mode="wait">
              <FadeInOut
                duration={0.2}
                key={
                  getArticleBadge(id) === completedBadge
                    ? "yay 🏆"
                    : "mark as completed🤓"
                }
              >
                {isCompleted ? "🏆 completed! 🏆" : "mark as completed"}
              </FadeInOut>
            </AnimatePresence>
          </HoverReplace>
        </S.CompleteButton>
      </S.SingleArticleWrapper>
    </>
  );
};
export default Article;

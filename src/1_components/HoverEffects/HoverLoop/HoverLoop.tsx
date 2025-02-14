import { useState, ReactNode, FC, useEffect } from "react";

import { AnimatePresence } from "framer-motion";

import { Directions } from "types/commonTypes";

import { HoverLoopVariants, TRANSITION } from "./HoverLoop.animations";
import * as S from "./HoverLoop.styled";

interface HoverLoopProps {
  children: ReactNode;
  direction: Directions;
  disableInnerHover?: boolean;
  isHovering?: boolean;
}

const HoverLoop: FC<HoverLoopProps> = ({
  children,
  isHovering,
  disableInnerHover = false,
  direction,
  ...rest
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [innerHover, setInnerHover] = useState(false);
  const [key, setKey] = useState("loop item");

  useEffect(() => {
    if (!isHovering && !innerHover && isExiting) {
      setKey(`loop item-${Math.random()}`);
    }
  }, [isHovering, innerHover, isExiting]);

  const handleMouseEnter = () => setInnerHover(true);
  const handleMouseLeave = () => setInnerHover(false);

  return (
    <S.HoverLoopWrapper
      onMouseEnter={!disableInnerHover ? handleMouseEnter : undefined}
      onMouseLeave={!disableInnerHover ? handleMouseLeave : undefined}
      {...rest}
    >
      <AnimatePresence mode="wait">
        {(isHovering || (!disableInnerHover && innerHover)) && (
          <S.LoopItem
            key={key}
            onAnimationStart={() => setIsExiting(true)}
            onAnimationComplete={() => setIsExiting(false)}
            {...HoverLoopVariants[direction]}
            transition={TRANSITION}
          >
            {children}
          </S.LoopItem>
        )}
      </AnimatePresence>

      <S.DimensionGhost aria-hidden>{children}</S.DimensionGhost>
    </S.HoverLoopWrapper>
  );
};

export default HoverLoop;

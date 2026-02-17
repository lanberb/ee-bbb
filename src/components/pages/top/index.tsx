import { type FC, useCallback, useEffect } from "react";
import EarthLogoStickerImage from "../../../assets/images/stickers/earth_logo.png";
import ExpandChromStickerImage from "../../../assets/images/stickers/expand_chrom.png";
import RotateTextStickerImage from "../../../assets/images/stickers/rotate_text.png";
import StarLikeStickerImage from "../../../assets/images/stickers/star_like.png";
import StreetPaintStickerImage from "../../../assets/images/stickers/street_paint.png";
import { getMobileFullWidthWithMargin, getSurfaceColor, isMobile } from "../../../canvas/utils";
import { useGlobalCanvas } from "../../../hooks/useGlobalCanvas";
import { useInertia } from "../../../hooks/useGlobalCanvas/internals/useInertia";
import { useGlobalStore } from "../../../hooks/useGlobalStore";
import { useListImage } from "../../../hooks/useListImages";
import { useTheme } from "../../../hooks/useTheme";
import { PageLayout } from "../../modules/PageLayout";

const STICKER_SETTING_LIST = [
  {
    imageUrl: ExpandChromStickerImage,
    width: getMobileFullWidthWithMargin(640, 16),
  },
  {
    imageUrl: EarthLogoStickerImage,
    width: 400,
  },
  {
    imageUrl: StarLikeStickerImage,
    width: 320,
  },
  {
    imageUrl: RotateTextStickerImage,
    width: 320,
  },
  {
    imageUrl: StreetPaintStickerImage,
    width: 480,
  },
];

export const Page: FC = () => {
  const themeState = useTheme();
  const globalStore = useGlobalStore();
  const { movement, engine, isDragging, update } = useGlobalCanvas();
  const [
    expandChromStickerImage,
    earthLogoStickerImage,
    startLikeStickerImage,
    rotateTextStickerImage,
    streetPaintStickerImage,
  ] = useListImage(STICKER_SETTING_LIST);

  const { setInertiaVelocity, startInertia, stopInertia } = useInertia();

  /**
   * マウスイベントアニメーション
   */
  const handleOnPointerMove = useCallback(
    (event: PointerEvent) => {
      if (themeState == null || engine == null || isDragging === false) {
        return;
      }
      setInertiaVelocity(event.movementX, event.movementY);
      engine.render.pointermove(
        getSurfaceColor("backgroundGrid", themeState),
        getSurfaceColor("primaryInversed", themeState),
        movement.x,
        movement.y,
      );
    },
    [engine, themeState, movement, isDragging, setInertiaVelocity],
  );
  const handleOnPointerUp = useCallback(() => {
    if (themeState == null) {
      return;
    }
    startInertia((x, y) => {
      update(movement.x + x, movement.y + y);
      engine?.render.pointermove(
        getSurfaceColor("backgroundGrid", themeState),
        getSurfaceColor("primaryInversed", themeState),
        movement.x,
        movement.y,
      );
    });
  }, [startInertia, engine, themeState, movement.y, movement.x, update]);
  const handleOnPointerDown = useCallback(() => {
    setInertiaVelocity(0, 0);
    stopInertia();
  }, [stopInertia, setInertiaVelocity]);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.addEventListener("pointermove", handleOnPointerMove);
    window.addEventListener("pointerout", handleOnPointerUp);
    window.addEventListener("pointerup", handleOnPointerUp);
    window.addEventListener("pointerdown", handleOnPointerDown);

    return () => {
      window.removeEventListener("pointermove", handleOnPointerMove);
      window.removeEventListener("pointerout", handleOnPointerUp);
      window.removeEventListener("pointerup", handleOnPointerUp);
      window.removeEventListener("pointerdown", handleOnPointerDown);
    };
  }, [handleOnPointerMove, handleOnPointerUp, handleOnPointerDown]);

  /**
   * オープニングアニメーション
   */
  const handleOnOpeningAnimationComplete = useCallback(() => {
    globalStore.setIsGrabbable(true);
    globalStore.setIsEndedOpeningAnimation();
  }, [globalStore.setIsGrabbable, globalStore.setIsEndedOpeningAnimation]);
  useEffect(() => {
    if (themeState == null || engine == null) {
      return;
    }
    engine.render.clear();
    engine.setter.addOpeningAnimationImage({
      image: expandChromStickerImage.image,
      x: 0,
      y: isMobile() ? 0 : -20,
    });
    engine.setter.addOpeningAnimationImage({
      image: earthLogoStickerImage.image,
      x: 240,
      y: -560,
    });
    engine.setter.addOpeningAnimationImage({
      image: startLikeStickerImage.image,
      x: 600,
      y: 200,
    });
    engine.setter.addOpeningAnimationImage({
      image: rotateTextStickerImage.image,
      x: -240,
      y: 560,
    });
    engine.setter.addOpeningAnimationImage({
      image: streetPaintStickerImage.image,
      x: -600,
      y: -200,
    });
    engine.render.opening(
      getSurfaceColor("backgroundGrid", themeState),
      getSurfaceColor("primaryInversed", themeState),
      handleOnOpeningAnimationComplete,
    );
  }, [
    // themeState,
    expandChromStickerImage,
    earthLogoStickerImage,
    streetPaintStickerImage,
    startLikeStickerImage,
    rotateTextStickerImage,
    engine,
    handleOnOpeningAnimationComplete,
  ]);

  return <PageLayout title="EE-BBB.©" />;
};

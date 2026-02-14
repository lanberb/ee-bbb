import { createTimeline } from "animejs";
import { isMobile } from "@/util/canvas";
import { type State, state } from "./state";

const BACKGROUND_GRID_STROKE_WIDTH = 1;
const BACKGROUND_GRID_GAP = 40;

const createRender = <T extends unknown[]>(fn: (state: State, ...arg: T) => void) => {
  return (...arg: T) => {
    fn(state, ...arg);
  };
};

export const createRenders = (context: CanvasRenderingContext2D) => {
  return {
    clear: createRender(() => {
      context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
    }),

    opening: createRender((state, gridColor: string, textColor: string, onComplete: () => void) => {
      const elementWidth = context.canvas.clientWidth;
      const elementHeight = context.canvas.clientHeight;

      context.strokeStyle = gridColor;
      context.lineWidth = BACKGROUND_GRID_STROKE_WIDTH;

      const baseRowLineCount = Math.floor(elementWidth / BACKGROUND_GRID_GAP);
      const rowLineCount = baseRowLineCount % 2 === 0 ? baseRowLineCount + 2 : baseRowLineCount + 3;
      const rowFirstLineStartX = (elementWidth - rowLineCount * BACKGROUND_GRID_GAP) / 2;
      const rowLineStartXArray = Array.from({ length: rowLineCount }, (_, i) => {
        return rowFirstLineStartX + i * BACKGROUND_GRID_GAP;
      });

      const baseColumnLineCount = Math.floor(elementHeight / BACKGROUND_GRID_GAP);
      const columnLineCount = baseColumnLineCount % 2 === 0 ? baseColumnLineCount + 2 : baseColumnLineCount + 3;
      const columnFirstLineStartY = (elementHeight - columnLineCount * BACKGROUND_GRID_GAP) / 2;
      const columnLineStartYArray = Array.from({ length: columnLineCount }, (_, i) => {
        return columnFirstLineStartY + i * BACKGROUND_GRID_GAP;
      });

      return new Promise<void>((resolve) => {
        const handleUpdate = () => {
          context.clearRect(0, 0, elementWidth, elementHeight);

          /**
           * 背景グリッドの描画（バッチ処理で最適化）
           */
          context.beginPath();
          for (let i = 0; i < rowLineCount; i++) {
            const startPositionY = i % 2 === 0 ? 0 : elementHeight;
            const endPositionY = i % 2 === 0 ? state.lines.y : elementHeight - state.lines.y;
            context.moveTo(rowLineStartXArray[i], startPositionY);
            context.lineTo(rowLineStartXArray[i], endPositionY);
          }
          for (let i = 0; i < columnLineCount; i++) {
            const startPositionX = i % 2 === 0 ? 0 : elementWidth;
            const endPositionX = i % 2 === 0 ? state.lines.x : elementWidth - state.lines.x;
            context.moveTo(startPositionX, columnLineStartYArray[i]);
            context.lineTo(endPositionX, columnLineStartYArray[i]);
          }
          context.stroke();

          /**
           * ステッカーの描画（最適化: 配列アクセスを最小化）
           */
          context.save();
          for (let i = 0; i < state.images.length; i++) {
            const { image, x, y, scale, opacity } = state.images[i];
            const imgWidth = image.width * scale;
            const imgHeight = image.height * scale;
            const centerX = (elementWidth - imgWidth) / 2;
            const centerY = (elementHeight - imgHeight) / 2;
            context.globalAlpha = opacity;
            context.drawImage(image, centerX + x, centerY + y, image.width * scale, image.height * scale);
            context.globalAlpha = 1;
          }
          context.restore();

          /**
           * メインロゴ下のテキスト描画
           */
          const text01 = '"Extend Expression, Bit by Bit."';
          const text02 = "Nao Sasaki / Lanberb";
          const text03 = "A Creative Developer based in Tokyo.";
          const text04 = "© 2026 Nao Sasaki / Lanberb";
          const underMainLogoLineY = elementHeight / 2 + 60;
          context.save();
          context.globalAlpha = state.textUnderMainLogo.opacity;
          context.fillStyle = textColor;
          context.font = `${isMobile() ? 16 : 20}px 'Rock Salt'`;
          context.fillText(text01, elementWidth / 2 - context.measureText(text01).width / 2, underMainLogoLineY + 40);
          context.font = `${isMobile() ? 12 : 14}px 'Rock Salt'`;
          context.fillText(text02, elementWidth / 2 - context.measureText(text02).width / 2, underMainLogoLineY + 80);
          context.fillText(text03, elementWidth / 2 - context.measureText(text03).width / 2, underMainLogoLineY + 100);
          context.font = "9px 'Rock Salt'";
          context.fillText(text04, elementWidth / 2 - context.measureText(text04).width / 2, underMainLogoLineY + 132);
          context.restore();
        };

        const handleOnComplete = () => {
          onComplete();
          resolve();
        };

        const timeline = createTimeline({
          onUpdate: handleUpdate,
          onComplete: handleOnComplete,
        });

        timeline
          .set(state.images, {
            x: 0,
            y: 0,
          })
          .add(state.lines, {
            x: elementWidth,
            y: elementHeight,
            duration: 800,
            ease: "inOut(1.6)",
          })
          .add(
            state.images,
            {
              scale: 1,
              opacity: 1,
              duration: 320,
              delay: (_, index: number) => (800 / state.images.length) * index,
              ease: "inOut(1.6)",
            },
            200,
          )
          .add(state.images, {
            scale: 0.96,
            duration: 160,
            ease: "inBack(0.6)",
          })
          .add(state.images, {
            x: (_: unknown, index: number) => state.images[index].x,
            y: (_: unknown, index: number) => state.images[index].y,
            scale: 1,
            duration: 640,
            ease: "outBack(0.68)",
          })
          .add(state.textUnderMainLogo, {
            opacity: 1,
            duration: 160,
            ease: "inOut(1.6)",
          });
      });
    }),

    pointermove: createRender((state, gridColor: string, textColor: string, distX: number, distY: number) => {
      const elementWidth = context.canvas.clientWidth;
      const elementHeight = context.canvas.clientHeight;

      context.clearRect(0, 0, elementWidth, elementHeight);
      context.strokeStyle = gridColor;
      context.lineWidth = BACKGROUND_GRID_STROKE_WIDTH;

      const baseRowLineCount = Math.floor(elementWidth / BACKGROUND_GRID_GAP);
      const rowLineCount = baseRowLineCount % 2 === 0 ? baseRowLineCount + 2 : baseRowLineCount + 3;
      const rowFirstLineStartX =
        (elementWidth - rowLineCount * BACKGROUND_GRID_GAP) / 2 + (distX % BACKGROUND_GRID_GAP);
      const rowLineStartXArray = Array.from({ length: rowLineCount }, (_, i) => {
        return rowFirstLineStartX + i * BACKGROUND_GRID_GAP;
      });

      const baseColumnLineCount = Math.floor(elementHeight / BACKGROUND_GRID_GAP);
      const columnLineCount = baseColumnLineCount % 2 === 0 ? baseColumnLineCount + 2 : baseColumnLineCount + 3;
      const columnFirstLineStartY =
        (elementHeight - columnLineCount * BACKGROUND_GRID_GAP) / 2 + (distY % BACKGROUND_GRID_GAP);
      const columnLineStartYArray = Array.from({ length: columnLineCount }, (_, i) => {
        return columnFirstLineStartY + i * BACKGROUND_GRID_GAP;
      });

      /**
       * 背景グリッドの描画（バッチ処理で最適化）
       */
      context.beginPath();
      for (let i = 0; i < rowLineCount; i++) {
        const startPositionY = i % 2 === 0 ? 0 : elementHeight;
        const endPositionY = i % 2 === 0 ? state.lines.y : elementHeight - state.lines.y;
        context.moveTo(rowLineStartXArray[i], startPositionY);
        context.lineTo(rowLineStartXArray[i], endPositionY);
      }
      for (let i = 0; i < columnLineCount; i++) {
        const startPositionX = i % 2 === 0 ? 0 : elementWidth;
        const endPositionX = i % 2 === 0 ? state.lines.x : elementWidth - state.lines.x;
        context.moveTo(startPositionX, columnLineStartYArray[i]);
        context.lineTo(endPositionX, columnLineStartYArray[i]);
      }
      context.stroke();

      /**
       * ステッカーの描画（最適化: 配列アクセスを最小化）
       */
      context.save();
      for (let i = 0; i < state.images.length; i++) {
        const { image, x, y, scale, opacity } = state.images[i];
        const imgWidth = image.width * scale;
        const imgHeight = image.height * scale;
        const centerX = (elementWidth - imgWidth) / 2;
        const centerY = (elementHeight - imgHeight) / 2;
        context.globalAlpha = opacity;
        context.drawImage(image, centerX + x + distX, centerY + y + distY, image.width * scale, image.height * scale);
        context.globalAlpha = 1;
      }
      context.restore();

      /**
       * メインロゴ下のテキスト描画
       */
      const text01 = '"Extend Expression, Bit by Bit."';
      const text02 = "Nao Sasaki / Lanberb";
      const text03 = "A Creative Developer based in Tokyo.";
      const text04 = "© 2026 Nao Sasaki / Lanberb";
      const underMainLogoLineY = elementHeight / 2 + 60;
      context.save();
      context.globalAlpha = state.textUnderMainLogo.opacity;
      context.fillStyle = textColor;
      context.font = `${isMobile() ? 16 : 20}px 'Rock Salt'`;
      context.fillText(
        text01,
        elementWidth / 2 - context.measureText(text01).width / 2 + distX,
        underMainLogoLineY + 40 + distY,
      );
      context.font = `${isMobile() ? 12 : 14}px 'Rock Salt'`;
      context.fillText(
        text02,
        elementWidth / 2 - context.measureText(text02).width / 2 + distX,
        underMainLogoLineY + 80 + distY,
      );
      context.fillText(
        text03,
        elementWidth / 2 - context.measureText(text03).width / 2 + distX,
        underMainLogoLineY + 100 + distY,
      );
      context.font = "9px 'Rock Salt'";
      context.fillText(
        text04,
        elementWidth / 2 - context.measureText(text04).width / 2 + distX,
        underMainLogoLineY + 132 + distY,
      );
      context.restore();
    }),

    onNavigatorClick: createRender(
      (
        state,
        gridColor: string,
        textColor: string,
        baseX: number,
        baseY: number,
        targetX: number,
        targetY: number,
        onComplete: () => void,
      ) => {
        const animationProperties = {
          x: baseX,
          y: baseY,
          scale: 1,
        };
        const elementWidth = context.canvas.clientWidth;
        const elementHeight = context.canvas.clientHeight;

        context.strokeStyle = gridColor;
        context.lineWidth = BACKGROUND_GRID_STROKE_WIDTH;

        return new Promise<void>((resolve) => {
          const handleUpdate = () => {
            context.clearRect(0, 0, elementWidth, elementHeight);

            const distX = animationProperties.x;
            const distY = animationProperties.y;

            const rowLineCount = Math.floor(elementWidth / BACKGROUND_GRID_GAP) + 2;
            const rowFirstLineStartX =
              (elementWidth - rowLineCount * BACKGROUND_GRID_GAP) / 2 + (distX % BACKGROUND_GRID_GAP);
            const rowLineStartXArray = Array.from({ length: rowLineCount }, (_, i) => {
              return rowFirstLineStartX + i * BACKGROUND_GRID_GAP;
            });

            const columnLineCount = Math.floor(elementHeight / BACKGROUND_GRID_GAP) + 2;
            const columnFirstLineStartY =
              (elementHeight - columnLineCount * BACKGROUND_GRID_GAP) / 2 + (distY % BACKGROUND_GRID_GAP);
            const columnLineStartYArray = Array.from({ length: columnLineCount }, (_, i) => {
              return columnFirstLineStartY + i * BACKGROUND_GRID_GAP;
            });

            /**
             * 背景グリッドの描画（バッチ処理で最適化）
             */
            context.beginPath();
            for (let i = 0; i < rowLineCount; i++) {
              const startPositionY = i % 2 === 0 ? 0 : elementHeight;
              const endPositionY = i % 2 === 0 ? state.lines.y : elementHeight - state.lines.y;
              context.moveTo(rowLineStartXArray[i], startPositionY);
              context.lineTo(rowLineStartXArray[i], endPositionY);
            }
            for (let i = 0; i < columnLineCount; i++) {
              const startPositionX = i % 2 === 0 ? 0 : elementWidth;
              const endPositionX = i % 2 === 0 ? state.lines.x : elementWidth - state.lines.x;
              context.moveTo(startPositionX, columnLineStartYArray[i]);
              context.lineTo(endPositionX, columnLineStartYArray[i]);
            }
            context.stroke();

            /**
             * ステッカーの描画（最適化: 配列アクセスを最小化）
             */
            context.save();
            for (let i = 0; i < state.images.length; i++) {
              const { image, x, y, scale, opacity } = state.images[i];
              const imgWidth = image.width * scale;
              const imgHeight = image.height * scale;
              const centerX = (elementWidth - imgWidth) / 2;
              const centerY = (elementHeight - imgHeight) / 2;
              context.globalAlpha = opacity;
              context.drawImage(
                image,
                centerX + x + distX,
                centerY + y + distY,
                image.width * scale,
                image.height * scale,
              );
              context.globalAlpha = 1;
            }
            context.restore();

            /**
             * メインロゴ下のテキスト描画
             */
            const text01 = '"Extend Expression, Bit by Bit."';
            const text02 = "Nao Sasaki / Lanberb";
            const text03 = "A Creative Developer based in Tokyo.";
            const text04 = "© 2026 Nao Sasaki / Lanberb";
            const underMainLogoLineY = elementHeight / 2 + 60;
            context.save();
            context.globalAlpha = state.textUnderMainLogo.opacity;
            context.fillStyle = textColor;
            context.font = `${isMobile() ? 16 : 20}px 'Rock Salt'`;
            context.fillText(
              text01,
              elementWidth / 2 - context.measureText(text01).width / 2 + distX,
              underMainLogoLineY + 40 + distY,
            );
            context.font = `${isMobile() ? 12 : 14}px 'Rock Salt'`;
            context.fillText(
              text02,
              elementWidth / 2 - context.measureText(text02).width / 2 + distX,
              underMainLogoLineY + 80 + distY,
            );
            context.fillText(
              text03,
              elementWidth / 2 - context.measureText(text03).width / 2 + distX,
              underMainLogoLineY + 100 + distY,
            );
            context.font = "9px 'Rock Salt'";
            context.fillText(
              text04,
              elementWidth / 2 - context.measureText(text04).width / 2 + distX,
              underMainLogoLineY + 132 + distY,
            );
            context.restore();
          };

          const handleOnComplete = () => {
            resolve();
            onComplete();
          };

          const timeline = createTimeline({
            onUpdate: handleUpdate,
            onComplete: handleOnComplete,
          });

          timeline.add(animationProperties, {
            x: targetX,
            y: targetY,
            duration: 800,
            ease: "inOut(1.6)",
          });
        });
      },
    ),

    drawBackgroundGrid: createRender((_state, gridColor: string) => {
      const elementWidth = context.canvas.clientWidth;
      const elementHeight = context.canvas.clientHeight;

      context.clearRect(0, 0, elementWidth, elementHeight);
      context.strokeStyle = gridColor;
      context.lineWidth = BACKGROUND_GRID_STROKE_WIDTH;

      const baseRowLineCount = Math.floor(elementWidth / BACKGROUND_GRID_GAP);
      const rowLineCount = baseRowLineCount % 2 === 0 ? baseRowLineCount + 2 : baseRowLineCount + 3;
      const rowFirstLineStartX = (elementWidth - rowLineCount * BACKGROUND_GRID_GAP) / 2 + BACKGROUND_GRID_GAP;
      const rowLineStartXArray = Array.from({ length: rowLineCount }, (_, i) => {
        return rowFirstLineStartX + i * BACKGROUND_GRID_GAP;
      });

      const baseColumnLineCount = Math.floor(elementHeight / BACKGROUND_GRID_GAP);
      const columnLineCount = baseColumnLineCount % 2 === 0 ? baseColumnLineCount + 2 : baseColumnLineCount + 3;
      const columnFirstLineStartY = (elementHeight - columnLineCount * BACKGROUND_GRID_GAP) / 2 + BACKGROUND_GRID_GAP;
      const columnLineStartYArray = Array.from({ length: columnLineCount }, (_, i) => {
        return columnFirstLineStartY + i * BACKGROUND_GRID_GAP;
      });

      /**
       * 背景グリッドの描画（バッチ処理で最適化）
       */
      context.beginPath();
      for (let i = 0; i < rowLineCount; i++) {
        context.moveTo(rowLineStartXArray[i], 0);
        context.lineTo(rowLineStartXArray[i], elementHeight);
      }
      for (let i = 0; i < columnLineCount; i++) {
        context.moveTo(0, columnLineStartYArray[i]);
        context.lineTo(elementWidth, columnLineStartYArray[i]);
      }
      context.stroke();
    }),
  };
};

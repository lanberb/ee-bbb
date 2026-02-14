import { useQueries } from "@tanstack/react-query";

const loadImageAsync = (
  prop: { imageUrl: string; width: number } & Record<string, unknown>,
): Promise<{ image: HTMLImageElement; imageUrl: string }> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const dw = image.width;
      const dh = image.height;
      image.width = prop.width;
      image.height = (prop.width * dh) / dw;
      resolve({ image, imageUrl: prop.imageUrl });
    };
    image.onerror = reject;
    image.src = prop.imageUrl;
  });
};

type Request = {
  imageUrl: string;
  width: number;
}[];

export const useListImage = (req: Request) => {
  return useQueries({
    queries: req.map(({ imageUrl, width }) => ({
      queryKey: ["listImage", imageUrl],
      queryFn: () => loadImageAsync({ imageUrl, width }),
    })),
  });
};

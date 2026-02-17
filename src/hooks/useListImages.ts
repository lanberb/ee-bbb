import { useEffect, useState } from "react";

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
  const [data, setData] = useState<Awaited<ReturnType<typeof loadImageAsync>>[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await Promise.all(req.map(({ imageUrl, width }) => loadImageAsync({ imageUrl, width })));
        setData(res);
      } catch (error) {
        throw new Error("Failed to load images", { cause: error });
      }
    })();
  }, [req.map]);

  return data;
};

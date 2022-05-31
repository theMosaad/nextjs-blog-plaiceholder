import { getPlaiceholder } from "plaiceholder";

const resolvePath = (path, obj) => {
  for (const key of path) {
    obj = obj[key];
  }
  return obj;
};

const getImageNodes = (data, { condition, urlPath }) => {
  const imageNodes = [];

  const visitNodes = (obj, path = []) => {
    if (typeof obj === "object" && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        if (condition(key, value)) {
          imageNodes.push({
            url: resolvePath(urlPath, obj),
            path: path,
          });
        }
        visitNodes(value, [...path, key]);
      });
    }
  };

  visitNodes(data);

  return imageNodes;
};

export const withBlur = async (
  data,
  { condition, urlPath, propertiesPath }
) => {
  const imageNodes = getImageNodes(data, {
    condition,
    urlPath,
  });

  if (!imageNodes.length) {
    return data;
  }

  await Promise.all(
    imageNodes.map(async (imageNode) => {
      const { img, base64 } = await getPlaiceholder(imageNode.url);
      const resolvedPath = resolvePath(
        [...imageNode.path, ...propertiesPath],
        data
      );
      resolvedPath.width = img.width;
      resolvedPath.height = img.height;
      resolvedPath.blurDataURL = base64;
    })
  );

  return data;
};

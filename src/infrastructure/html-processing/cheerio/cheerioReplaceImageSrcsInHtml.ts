import type { ReplaceImageSrcsInHtml } from '@/domain/services/Cache';
import { cheerio } from '@/vendor/cheerio';

const cheerioReplaceImageSrcsInHtml: ReplaceImageSrcsInHtml = (
  uriMap: Record<string, string>,
  html: string
): string => {
  const $ = cheerio.load(html);
  Object.entries(uriMap).forEach(([src, replacement]) => {
    $(`img[src=${src}]`).attr('src', replacement);
  });
  return $('body').html() ?? '';
};

export { cheerioReplaceImageSrcsInHtml };

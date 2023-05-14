import type { ReplaceImageSrcsInHtml } from '@/domain/services/Cache';
import { cheerio } from '@/vendor/cheerio';

const cheerioReplaceImageSrcsInHtml: ReplaceImageSrcsInHtml = (
  uriMap: Record<string, string>,
  html: string
): string => {
  const $ = cheerio.load(`<main>${html}</main>`);
  Object.entries(uriMap).forEach(([src, replacement]) => {
    $(`img[src=${src}]`).attr('src', replacement);
  });
  return $('body > main:first-child').html() ?? '';
};

export { cheerioReplaceImageSrcsInHtml };

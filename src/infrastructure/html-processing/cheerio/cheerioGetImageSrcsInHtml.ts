import type { GetImageSrcsInHtml } from '@/domain/services/Cache';
import { cheerio } from '@/vendor/cheerio';

const cheerioGetImageSrcsInHtml: GetImageSrcsInHtml = (
  html: string
): string[] => {
  const $ = cheerio.load(html);
  const imgTags = $('img[src]').get();
  return imgTags.map((el) => $(el).attr('src') ?? '');
};

export { cheerioGetImageSrcsInHtml };

import { cheerioGetImageSrcsInHtml } from '@/infrastructure/html-processing/cheerio/cheerioGetImageSrcsInHtml';

describe('cheerioGetImageSrcsInHtml', () => {
  it('should get content of src attribute in one img tag', () => {
    const html = '<img src="foo.jpg">';
    const result = cheerioGetImageSrcsInHtml(html);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('foo.jpg');
  });

  it('should get content of src attribute in more than one img tag', () => {
    const html = `
    <img src="foo.jpg">
    <img src="bar.png">
    `;
    const result = cheerioGetImageSrcsInHtml(html);
    expect(result).toHaveLength(2);
    expect(result).toEqual(['foo.jpg', 'bar.png']);
  });

  it('should get content of src attribute in more than one img tag separated by other text', () => {
    const html = `
    <img src="foo.jpg">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <img src="bar.png">
    `;
    const result = cheerioGetImageSrcsInHtml(html);
    expect(result).toHaveLength(2);
    expect(result).toEqual(['foo.jpg', 'bar.png']);
  });
});

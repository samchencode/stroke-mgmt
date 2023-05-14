import { cheerioReplaceImageSrcsInHtml } from '@/infrastructure/html-processing/cheerio/cheerioReplaceImageSrcsInHtml';

describe('cheerioReplaceImageSrcsInHtml', () => {
  it('should replace one image src based on given uriMap', () => {
    const html = '<h1>Hai</h1><img src="foo.png"><p>Here is foo.</p>';
    const uriMap = { 'foo.png': 'file://dir/bar.png' };
    const result = cheerioReplaceImageSrcsInHtml(uriMap, html);
    expect(result).toBe(
      '<h1>Hai</h1><img src="file://dir/bar.png"><p>Here is foo.</p>'
    );
  });

  it('should replace more than one image source based on given uriMap', () => {
    const html =
      '<h1>Hello World</h1><img src="foo.png"><p>Some text here</p><img src="bar.jpeg">';
    const uriMap = {
      'foo.png': 'file://dir/foo.png',
      'bar.jpeg': 'file://dir/bar.jpg',
    };
    const result = cheerioReplaceImageSrcsInHtml(uriMap, html);
    expect(result).toBe(
      '<h1>Hello World</h1><img src="file://dir/foo.png"><p>Some text here</p><img src="file://dir/bar.jpg">'
    );
  });

  it('should not replace image srcs that are not in urimap', () => {
    const html = '<img src="foo.png"><img src="baz.png">';
    const uriMap = { 'foo.png': 'file://dir/bar.png' };
    const result = cheerioReplaceImageSrcsInHtml(uriMap, html);
    expect(result).toBe('<img src="file://dir/bar.png"><img src="baz.png">');
  });

  it('should replace two image srcs of the same value', () => {
    const html = '<img src="foo.png"><img src="foo.png">';
    const uriMap = { 'foo.png': 'file://dir/bar.png' };
    const result = cheerioReplaceImageSrcsInHtml(uriMap, html);
    expect(result).toBe(
      '<img src="file://dir/bar.png"><img src="file://dir/bar.png">'
    );
  });
});

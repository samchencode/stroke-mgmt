import { Tag } from '@/domain/models/Tag';

describe('Tag', () => {
  describe('Instantiation', () => {
    it('should create new tag with name and description', () => {
      const create = () => new Tag('Tag name', 'Tag description');
      expect(create).not.toThrowError();
    });
  });

  describe('getName', () => {
    it('should return the name of the tag', () => {
      const tag = new Tag('Test Tag', 'This is a test tag.');
      expect(tag.getName()).toBe('Test Tag');
    });
  });

  describe('getDescription', () => {
    it('should return the description of the tag', () => {
      const tag = new Tag('Test Tag', 'This is a test tag.');
      expect(tag.getDescription()).toBe('This is a test tag.');
    });
  });

  describe('is', () => {
    it('should return true if the name of the current tag is the same as the name of the other tag', () => {
      const tag1 = new Tag('Test Tag', 'This is a test tag.');
      const tag2 = new Tag('Test Tag', 'This is another test tag.');
      expect(tag1.is(tag2)).toBe(true);
    });

    it('should return false if the name of the current tag is different from the name of the other tag', () => {
      const tag1 = new Tag('Test Tag', 'This is a test tag.');
      const tag2 = new Tag('Another Tag', 'This is another test tag.');
      expect(tag1.is(tag2)).toBe(false);
    });
  });
});

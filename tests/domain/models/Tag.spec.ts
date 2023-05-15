import { Tag } from '@/domain/models/Tag';

describe('Tag', () => {
  describe('Instantiation', () => {
    it('should create new tag with name, last updated datetime, and description', () => {
      const create = () => new Tag('Tag name', new Date(0), 'Tag description');
      expect(create).not.toThrow();
    });
  });

  describe('getName', () => {
    it('should return the name of the tag', () => {
      const tag = new Tag('Test Tag', new Date(0), 'This is a test tag.');
      expect(tag.getName()).toBe('Test Tag');
    });
  });

  describe('getDescription', () => {
    it('should return the description of the tag', () => {
      const tag = new Tag('Test Tag', new Date(0), 'This is a test tag.');
      expect(tag.getDescription()).toBe('This is a test tag.');
    });

    it('should return the default description of the tag if not provided', () => {
      const tag = new Tag('Test Tag', new Date(0));
      expect(tag.getDescription()).toBe(
        'No description was provided for this tag.'
      );
    });
  });

  describe('getLastUpdated', () => {
    it('should return the last updated date of the tag', () => {
      const tag = new Tag('Test Tag', new Date(0), 'This is a test tag.');
      expect(tag.getUpdatedAt().getTime()).toBe(new Date(0).getTime());
    });
  });

  describe('is', () => {
    it('should return true if the name of the current tag is the same as the name of the other tag', () => {
      const tag1 = new Tag('Test Tag', new Date(0), 'This is a test tag.');
      const tag2 = new Tag(
        'Test Tag',
        new Date(0),
        'This is another test tag.'
      );
      expect(tag1.is(tag2)).toBe(true);
    });

    it('should return false if the name of the current tag is different from the name of the other tag', () => {
      const tag1 = new Tag('Test Tag', new Date(0), 'This is a test tag.');
      const tag2 = new Tag(
        'Another Tag',
        new Date(0),
        'This is another test tag.'
      );
      expect(tag1.is(tag2)).toBe(false);
    });
  });
});

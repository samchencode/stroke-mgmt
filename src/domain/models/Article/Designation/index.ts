import { Article } from '@/domain/models/Article/Designation/Article';
import { Disclaimer } from '@/domain/models/Article/Designation/Disclaimer';
import { About } from '@/domain/models/Article/Designation/About';

export const Designation = {
  get DISCLAIMER() {
    return new Disclaimer();
  },
  get ARTICLE() {
    return new Article();
  },
  get ABOUT() {
    return new About();
  },
  fromString(str: string) {
    switch (str) {
      case Disclaimer.prototype.type:
        return Designation.DISCLAIMER;
      case Article.prototype.type:
        return Designation.ARTICLE;
      case About.prototype.type:
        return Designation.ABOUT;
      default:
        return Designation.ARTICLE;
    }
  },
};

export type { BaseDesignation } from '@/domain/models/Article/Designation/BaseDesignation';

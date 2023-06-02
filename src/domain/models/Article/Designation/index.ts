import { Article } from '@/domain/models/Article/Designation/Article';
import { Disclaimer } from '@/domain/models/Article/Designation/Disclaimer';
import { StrokeFacts } from '@/domain/models/Article/Designation/StrokeFacts';
import { StrokeSigns } from '@/domain/models/Article/Designation/StrokeSigns';
import { About } from '@/domain/models/Article/Designation/About';

export const Designation = {
  get DISCLAIMER() {
    return new Disclaimer();
  },
  get STROKE_FACTS() {
    return new StrokeFacts();
  },
  get STROKE_SIGNS() {
    return new StrokeSigns();
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
      case StrokeFacts.prototype.type:
        return Designation.STROKE_FACTS;
      case StrokeSigns.prototype.type:
        return Designation.STROKE_SIGNS;
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

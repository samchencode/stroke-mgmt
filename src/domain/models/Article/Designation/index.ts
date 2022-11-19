import { Article } from '@/domain/models/Article/Designation/Article';
import { Disclaimer } from '@/domain/models/Article/Designation/Disclaimer';
import { StrokeFacts } from '@/domain/models/Article/Designation/StrokeFacts';
import { StrokeSigns } from '@/domain/models/Article/Designation/StrokeSigns';

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
};

export type { BaseDesignation } from '@/domain/models/Article/Designation/BaseDesignation';

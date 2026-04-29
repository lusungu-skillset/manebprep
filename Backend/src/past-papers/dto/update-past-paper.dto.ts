export class UpdatePastPaperDto {
  form?: 1 | 2 | 3 | 4;
  year?: number;
  season?: string;
  title?: string;
  description?: string;
  questionIds?: number[];
}


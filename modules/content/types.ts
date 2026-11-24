export interface ContentDto {
  key: string;
  title: string | null;
  value: string;
  isDefault: boolean;
}

export interface FaqDto {
  id: string;
  question: string;
  answer: string;
  applicationId: string | null;
}

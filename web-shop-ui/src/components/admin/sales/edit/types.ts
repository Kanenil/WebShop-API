export interface ISaleEdit {
  id: number | string;
  name: string;
  image: string | File | null;
  description: string;
  decreasePercent: number;
  expireTime: string;
}

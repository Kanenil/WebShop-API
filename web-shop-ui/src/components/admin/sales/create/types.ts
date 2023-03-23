export interface ISaleCreate {
  name: string;
  image: string | File | null;
  description: string;
  decreasePercent: number;
  expireTime: string;
}

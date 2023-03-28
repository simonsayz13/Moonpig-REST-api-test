export type Template = {
  id: string;
  width: number;
  height: number;
  imageUrl: string;
};

export type Page = {
  title: string;
  templateId: string;
};

export type DetailedPage = {
  title: string;
  width: number;
  height: number;
  imageUrl: string;
};

export type AvailableSize = {
  id: string;
  title: string;
};

export type Sizes = {
  id: string;
  title: string;
  priceMultiplier: number;
};

export type Card = {
  id: string;
  title: string;
  sizes: Array<string>;
  basePrice: number;
  pages: Array<Page>;
};

export type SingleCard = {
  title: string;
  size: string;
  availableSizes: Array<AvailableSize>;
  imageUrl: string;
  price: string;
  pages: Array<DetailedPage>;
};

export type Cards = {
  title: string;
  imageUrl: string;
  url: string;
};

export interface ScrapedItem {
  title: string;
  url: string;
  publishedAt?: Date;
  description?: string;
  content?: string;
  author?: string;
  imageUrl?: string;
}

export interface ScrapeResult {
  items: ScrapedItem[];
  errors: string[];
}

export interface SourceScrapeConfig {
  id: string;
  name: string;
  baseUrl: string;
  feedUrl?: string | null;
  type: "RSS" | "HTML";
  selectorConfig?: {
    itemSelector?: string;
    titleSelector?: string;
    linkSelector?: string;
    dateSelector?: string;
    descriptionSelector?: string;
  } | null;
}

export interface INewsScraper {
  scrape(source: SourceScrapeConfig): Promise<ScrapeResult>;
}

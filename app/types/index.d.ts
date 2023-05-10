export type SearchQuerySuggestion = {
  __typename?: 'SearchQuerySuggestion';
  styleText: Scalars['String'];
  text: Scalars['String'];
  trackingParameters: Scalars['String'];
}

export type PredictiveSearchResult = {
  __typename?: 'PredictiveSearchResult';
  articles: Array<Article>;
  collections: Array<Collection>;
  pages: Array<Page>;
  products: Array<Product>;
  queries: Array<SearchQuerySuggestion>;
}

export type SearchResultItem = Article | Page | Product;

export type SearchResultItemConnection = {
  __typename?: 'SearchResultItemConnection';
  edges: Array<SearchResultItemEdge>;
  nodes: Array<SearchResultItem>;
  pageInfo: PageInfo;
  productFilters: Array<Filter>;
};

export type SearchResultItemEdge = {
  __typename?: 'SearchResultItemEdge';
  cursor: Scalars['String'];
  node: SearchResultItem;
};

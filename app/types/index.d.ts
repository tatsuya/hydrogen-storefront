export type SearchResultItem = Article | Page | Product;

export type SearchResultItemConnection = {
  __typename?: 'SearchResultItemConnection';
  edges: Array<SearchResultItemEdge>;
  productFilters: Array<Filter>;
  nodes: Array<SearchResultItem>;
  pageInfo: PageInfo;
};

export type SearchResultItemEdge = {
  __typename?: 'SearchResultItemEdge';
  cursor: Scalars['String'];
  node: SearchResultItem;
};

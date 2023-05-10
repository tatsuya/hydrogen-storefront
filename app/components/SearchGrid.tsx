import {Button, Grid, ProductCard, Link} from '~/components';
import {getImageLoadingPriority} from '~/lib/const';
import type {Product} from '@shopify/hydrogen/storefront-api-types';
import {SearchResultItem, SearchResultItemConnection} from '~/types';
import {useFetcher} from '@remix-run/react';
import {useEffect, useState} from 'react';

export function SearchGrid({
  url,
  search,
  ...props
}: {
  url: string;
  search: SearchResultItemConnection;
}) {
  const [initialSearchResultItems, setInitialSearchResultItems] = useState(
    search?.nodes || [],
  );

  const [nextPage, setNextPage] = useState(search?.pageInfo?.hasNextPage);
  const [endCursor, setEndCursor] = useState(search?.pageInfo?.endCursor);
  const [searchResultItems, setSearchResultItems] = useState(
    initialSearchResultItems,
  );

  // props have changes, reset component state
  const searchResultItemProps = search?.nodes || [];
  if (initialSearchResultItems !== searchResultItemProps) {
    setInitialSearchResultItems(searchResultItemProps);
    setSearchResultItems(searchResultItemProps);
  }

  const fetcher = useFetcher();

  function fetchMoreSearchResultItems() {
    fetcher.load(`${url}?index&cursor=${endCursor}`);
  }

  useEffect(() => {
    if (!fetcher.data) return;

    const {searchResultItemConnection} = fetcher.data;

    setSearchResultItems((prev: SearchResultItem[]) => [
      ...prev,
      ...searchResultItemConnection.nodes,
    ]);
    setNextPage(searchResultItemConnection.pageInfo.hasNextPage);
    setEndCursor(searchResultItemConnection.pageInfo.endCursor);
  }, [fetcher.data]);

  const haveSearchResultItems = initialSearchResultItems.length > 0;

  if (!haveSearchResultItems) {
    return (
      <>
        <p>No products found on this collection</p>
        <Link to="/products">
          <p className="underline">Browse catalog</p>
        </Link>
      </>
    );
  }

  return (
    <>
      <Grid layout="products" {...props}>
        {searchResultItems
          .map((searchResultItem) => searchResultItem as Product)
          .map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              loading={getImageLoadingPriority(i)}
            />
          ))}
      </Grid>

      {nextPage && (
        <div className="flex items-center justify-center mt-6">
          <Button
            disabled={fetcher.state !== 'idle'}
            variant="secondary"
            onClick={fetchMoreSearchResultItems}
            width="full"
            prefetch="intent"
          >
            {fetcher.state !== 'idle' ? 'Loading...' : 'Load more products'}
          </Button>
        </div>
      )}
    </>
  );
}

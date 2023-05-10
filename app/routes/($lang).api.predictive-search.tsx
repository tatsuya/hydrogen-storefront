import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';
import {PredictiveSearchResult} from '~/types';

export async function loader({request, context: {storefront}}: LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = searchParams.get('q')!;

  const data = await storefront.query<{
    predictiveSearch: PredictiveSearchResult;
  }>(PREDICTIVE_SEARCH_QUERY, {
    variables: {
      pageBy: 4,
      searchTerm,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    storefrontApiVersion: 'unstable',
  });

  invariant(data, 'No data returned from Shopify API');
  const {predictiveSearch} = data;

  return json({
    predictiveSearch,
  });
}

const PREDICTIVE_SEARCH_QUERY = `#graphql
  query predictiveSearch(
    $searchTerm: String!
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $pageBy,
      types: PRODUCT
      query: $searchTerm,
    ) {
      products {
        id
        title
        handle
        trackingParameters
        variants(first: 1) {
          nodes {
            id
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
      pages {
        id
        title
        handle
      }
      articles {
        id
        title
        handle
        image {
          url
          altText
          width
          height
        }
      }
      queries {
        text
        styledText
        trackingParameters
      }
    }
  }
`;

// no-op
export default function PredictiveSearchApiRoute() {
  return null;
}

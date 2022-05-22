async function fetchRanking(cursor = null, volume = "THIRTY_DAY_VOLUME") {
    const uid = localStorage.getItem("ajs_user_id");
  const req = await fetch("https://api.opensea.io/graphql/", {
    headers: {
      accept: "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en-IN;q=0.8,en;q=0.7,ar;q=0.6",
      "content-type": "application/json",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-api-key": "2f6f419a083c46de9d83ce3dbe7db601",
      "x-build-id": "c2f797959419070565cabdf0b02b2adbb131882c",
      "x-signed-query":
        "c9e930e4edb22588d672233ed06bcd592177894fa5ad9c1821edf2a92f92dfef",
      "x-viewer-address": uid,
    },
    referrer: "https://opensea.io/",
    referrerPolicy: "strict-origin",
    body: JSON.stringify({
      id: "RankingsPageQuery",
      query:
        "query RankingsPageQuery(\n  $chain: [ChainScalar!]\n  $count: Int!\n  $cursor: String\n  $sortBy: CollectionSort\n  $parents: [CollectionSlug!]\n  $createdAfter: DateTime\n) {\n  ...RankingsPage_data\n}\n\nfragment PaymentAssetLogo_data on PaymentAssetType {\n  symbol\n  asset {\n    imageUrl\n    id\n  }\n}\n\nfragment RankingsPage_data on Query {\n  rankings(after: $cursor, chains: $chain, first: $count, sortBy: $sortBy, parents: $parents, createdAfter: $createdAfter) {\n    edges {\n      node {\n        createdDate\n        name\n        slug\n        logo\n        isVerified\n        nativePaymentAsset {\n          ...PaymentAssetLogo_data\n          id\n        }\n        statsV2 {\n          floorPrice {\n            unit\n            eth\n          }\n          numOwners\n          totalSupply\n          sevenDayChange\n          sevenDayVolume {\n            unit\n          }\n          oneDayChange\n          oneDayVolume {\n            unit\n          }\n          thirtyDayChange\n          thirtyDayVolume {\n            unit\n          }\n          totalVolume {\n            unit\n          }\n        }\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n",
      variables: {
        chain: null,
        count: 100,
        cursor: cursor,
        sortBy: volume,
        parents: null,
        createdAfter: null,
      },
    }),
    method: "POST",
    mode: "cors",
    credentials: "include",
  });
  const data = await req.json();
  return data;
}

async function fetchCollection(collection = "") {
  for (let index = 0; index < 5; index++) {
    try {
      const req = await fetch("https://api.opensea.io/graphql/", {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en-IN;q=0.8,en;q=0.7,ar;q=0.6",
          "content-type": "application/json",
          "sec-ch-ua":
            '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "x-api-key": "2f6f419a083c46de9d83ce3dbe7db601",
          "x-build-id": "f1af6c8019cd0712cc7c57763bd24e4ce3dfffc4",
          "x-datadog-origin": "rum",
          "x-datadog-parent-id": "878597353073020415",
          "x-datadog-sampled": "1",
          "x-datadog-sampling-priority": "1",
          "x-datadog-trace-id": "3526811517842154667",
          "x-signed-query":
            "70fca8686800c68193004e0b425cadcfc99d2544e6960ca12da4804462056a37",
        },
        referrer: "https://opensea.io/",
        referrerPolicy: "strict-origin",
        body: JSON.stringify({
          id: "CollectionPageQuery",
          query:
            "query CollectionPageQuery(\n  $collection: CollectionSlug!\n  $collections: [CollectionSlug!]\n  $collectionQuery: String\n  $includeHiddenCollections: Boolean\n  $numericTraits: [TraitRangeType!]\n  $query: String\n  $sortAscending: Boolean\n  $sortBy: SearchSortBy\n  $stringTraits: [TraitInputType!]\n  $toggles: [SearchToggle!]\n  $showContextMenu: Boolean\n  $isCategory: Boolean!\n  $includeCollectionFilter: Boolean!\n) {\n  collection(collection: $collection) {\n    isEditable\n    bannerImageUrl\n    name\n    description\n    imageUrl\n    relayId\n    connectedTwitterUsername\n    assetContracts(first: 2) {\n      edges {\n        node {\n          chain\n          id\n        }\n      }\n    }\n    representativeAsset {\n      assetContract {\n        openseaVersion\n        id\n      }\n      id\n    }\n    slug\n    ...verification_data\n    ...collection_url\n    ...CollectionHeader_data\n    ...PhoenixCollectionAddressPill_data\n    owner {\n      ...AccountLink_data\n      id\n    }\n    ...PhoenixCollectionSocialBar_data\n    ...PhoenixCollectionActionBar_data\n    ...PhoenixCollectionInfo_data\n    id\n  }\n  ...TrendingCollectionsList_data_29bCDU @include(if: $isCategory)\n  assets: query @skip(if: $isCategory) {\n    ...AssetSearch_data_40oIf9\n  }\n}\n\nfragment AccountLink_data on AccountType {\n  address\n  config\n  isCompromised\n  user {\n    publicUsername\n    id\n  }\n  displayName\n  ...ProfileImage_data\n  ...wallet_accountKey\n  ...accounts_url\n}\n\nfragment AssetCardAnnotations_assetBundle on AssetBundleType {\n  assetCount\n}\n\nfragment AssetCardAnnotations_asset_1OrK6u on AssetType {\n  assetContract {\n    chain\n    id\n  }\n  decimals\n  relayId\n  favoritesCount\n  isDelisted\n  isFavorite\n  isFrozen\n  hasUnlockableContent\n  ...AssetCardBuyNow_data\n  orderData {\n    bestAsk {\n      orderType\n      relayId\n      maker {\n        address\n        id\n      }\n    }\n  }\n  ...AssetContextMenu_data_3z4lq0 @include(if: $showContextMenu)\n}\n\nfragment AssetCardBuyNow_data on AssetType {\n  tokenId\n  relayId\n  assetContract {\n    address\n    chain\n    id\n  }\n  collection {\n    slug\n    id\n  }\n  orderData {\n    bestAsk {\n      relayId\n      decimals\n      paymentAssetQuantity {\n        asset {\n          usdSpotPrice\n          decimals\n          id\n        }\n        quantity\n        id\n      }\n    }\n  }\n}\n\nfragment AssetCardContent_asset on AssetType {\n  relayId\n  name\n  ...AssetMedia_asset\n  assetContract {\n    address\n    chain\n    openseaVersion\n    id\n  }\n  tokenId\n  collection {\n    slug\n    id\n  }\n  isDelisted\n}\n\nfragment AssetCardContent_assetBundle on AssetBundleType {\n  assetQuantities(first: 18) {\n    edges {\n      node {\n        asset {\n          relayId\n          ...AssetMedia_asset\n          id\n        }\n        id\n      }\n    }\n  }\n}\n\nfragment AssetCardFooter_assetBundle on AssetBundleType {\n  ...AssetCardAnnotations_assetBundle\n  name\n  assetCount\n  assetQuantities(first: 18) {\n    edges {\n      node {\n        asset {\n          collection {\n            name\n            relayId\n            slug\n            isVerified\n            ...collection_url\n            id\n          }\n          id\n        }\n        id\n      }\n    }\n  }\n  assetEventData {\n    lastSale {\n      unitPriceQuantity {\n        ...AssetQuantity_data\n        id\n      }\n    }\n  }\n  orderData {\n    bestBid {\n      orderType\n      paymentAssetQuantity {\n        quantity\n        ...AssetQuantity_data\n        id\n      }\n    }\n    bestAsk {\n      maker {\n        address\n        id\n      }\n      closedAt\n      orderType\n      dutchAuctionFinalPrice\n      openedAt\n      priceFnEndedAt\n      quantity\n      decimals\n      paymentAssetQuantity {\n        quantity\n        ...AssetQuantity_data\n        id\n      }\n    }\n  }\n}\n\nfragment AssetCardFooter_asset_1OrK6u on AssetType {\n  ...AssetCardAnnotations_asset_1OrK6u\n  name\n  tokenId\n  collection {\n    slug\n    name\n    isVerified\n    ...collection_url\n    id\n  }\n  isDelisted\n  assetContract {\n    address\n    chain\n    openseaVersion\n    id\n  }\n  assetEventData {\n    lastSale {\n      unitPriceQuantity {\n        ...AssetQuantity_data\n        id\n      }\n    }\n  }\n  orderData {\n    bestBid {\n      orderType\n      paymentAssetQuantity {\n        quantity\n        ...AssetQuantity_data\n        id\n      }\n    }\n    bestAsk {\n      maker {\n        address\n        id\n      }\n      closedAt\n      orderType\n      dutchAuctionFinalPrice\n      openedAt\n      priceFnEndedAt\n      quantity\n      decimals\n      paymentAssetQuantity {\n        quantity\n        ...AssetQuantity_data\n        id\n      }\n    }\n  }\n}\n\nfragment AssetContextMenu_data_3z4lq0 on AssetType {\n  ...asset_edit_url\n  ...asset_url\n  ...itemEvents_data\n  relayId\n  isDelisted\n  isEditable {\n    value\n    reason\n  }\n  isListable\n  ownership(identity: {}) {\n    isPrivate\n    quantity\n  }\n  creator {\n    address\n    id\n  }\n  collection {\n    isAuthorizedEditor\n    id\n  }\n  imageUrl\n  ownedQuantity(identity: {})\n}\n\nfragment AssetMedia_asset on AssetType {\n  animationUrl\n  backgroundColor\n  collection {\n    displayData {\n      cardDisplayStyle\n    }\n    id\n  }\n  isDelisted\n  imageUrl\n  displayImageUrl\n}\n\nfragment AssetQuantity_data on AssetQuantityType {\n  asset {\n    ...Price_data\n    id\n  }\n  quantity\n}\n\nfragment AssetSearchFilter_data_PFx8Z on Query {\n  ...CollectionFilter_data_tXjHb @include(if: $includeCollectionFilter)\n  collection(collection: $collection) {\n    numericTraits {\n      key\n      value {\n        max\n        min\n      }\n      ...NumericTraitFilter_data\n    }\n    stringTraits {\n      key\n      ...StringTraitFilter_data\n    }\n    defaultChain {\n      identifier\n    }\n    id\n  }\n  ...PaymentFilter_data_2YoIWt\n}\n\nfragment AssetSearchList_data_gVyhu on SearchResultType {\n  asset {\n    assetContract {\n      address\n      chain\n      id\n    }\n    collection {\n      isVerified\n      relayId\n      id\n    }\n    relayId\n    tokenId\n    ...AssetSelectionItem_data\n    ...asset_url\n    id\n  }\n  assetBundle {\n    relayId\n    id\n  }\n  ...Asset_data_gVyhu\n}\n\nfragment AssetSearch_data_40oIf9 on Query {\n  ...AssetSearchFilter_data_PFx8Z\n  ...SearchPills_data_2Kg4Sq\n  search(collections: $collections, first: 32, numericTraits: $numericTraits, querystring: $query, resultType: ASSETS, sortAscending: $sortAscending, sortBy: $sortBy, stringTraits: $stringTraits, toggles: $toggles) {\n    edges {\n      node {\n        ...AssetSearchList_data_gVyhu\n        __typename\n      }\n      cursor\n    }\n    totalCount\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment AssetSelectionItem_data on AssetType {\n  backgroundColor\n  collection {\n    displayData {\n      cardDisplayStyle\n    }\n    imageUrl\n    id\n  }\n  imageUrl\n  name\n  relayId\n}\n\nfragment Asset_data_gVyhu on SearchResultType {\n  asset {\n    relayId\n    isDelisted\n    ...AssetCardContent_asset\n    ...AssetCardFooter_asset_1OrK6u\n    ...AssetMedia_asset\n    ...asset_url\n    ...itemEvents_data\n    orderData {\n      bestAsk {\n        paymentAssetQuantity {\n          quantityInEth\n          id\n        }\n      }\n    }\n    id\n  }\n  assetBundle {\n    relayId\n    ...bundle_url\n    ...AssetCardContent_assetBundle\n    ...AssetCardFooter_assetBundle\n    orderData {\n      bestAsk {\n        paymentAssetQuantity {\n          quantityInEth\n          id\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment CollectionCardContextMenu_data on CollectionType {\n  ...collection_url\n}\n\nfragment CollectionCard_data on CollectionType {\n  ...CollectionCardContextMenu_data\n  ...CollectionCard_getShowCollectionCardData\n  ...collection_url\n  description\n  name\n  shortDescription\n  slug\n  logo\n  banner\n  isVerified\n  owner {\n    ...AccountLink_data\n    id\n  }\n  stats {\n    totalSupply\n    id\n  }\n  defaultChain {\n    identifier\n  }\n}\n\nfragment CollectionCard_getShowCollectionCardData on CollectionType {\n  logo\n  banner\n}\n\nfragment CollectionFilter_data_tXjHb on Query {\n  selectedCollections: collections(first: 25, collections: $collections, includeHidden: true) {\n    edges {\n      node {\n        assetCount\n        imageUrl\n        name\n        slug\n        isVerified\n        id\n      }\n    }\n  }\n  collections(first: 100, includeHidden: $includeHiddenCollections, query: $collectionQuery, sortBy: SEVEN_DAY_VOLUME) {\n    edges {\n      node {\n        assetCount\n        imageUrl\n        name\n        slug\n        isVerified\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment CollectionHeader_data on CollectionType {\n  name\n  description\n  imageUrl\n  bannerImageUrl\n  relayId\n  slug\n  owner {\n    ...AccountLink_data\n    id\n  }\n  ...CollectionStatsBar_data\n  ...SocialBar_data\n  ...verification_data\n  ...CollectionWatchlistButton_data\n}\n\nfragment CollectionModalContent_data on CollectionType {\n  description\n  imageUrl\n  name\n  slug\n}\n\nfragment CollectionStatsBar_data on CollectionType {\n  stats {\n    numOwners\n    totalSupply\n    id\n  }\n  nativePaymentAsset {\n    ...PaymentAssetLogo_data\n    id\n  }\n  ...collection_url\n  ...collection_stats\n}\n\nfragment CollectionWatchlistButton_data on CollectionType {\n  relayId\n  isWatching\n}\n\nfragment NumericTraitFilter_data on NumericTraitTypePair {\n  key\n  value {\n    max\n    min\n  }\n}\n\nfragment PaymentAssetLogo_data on PaymentAssetType {\n  symbol\n  asset {\n    imageUrl\n    id\n  }\n}\n\nfragment PaymentFilter_data_2YoIWt on Query {\n  paymentAssets(first: 10) {\n    edges {\n      node {\n        symbol\n        relayId\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  PaymentFilter_collection: collection(collection: $collection) {\n    paymentAssets {\n      symbol\n      relayId\n      id\n    }\n    id\n  }\n}\n\nfragment PhoenixCollectionActionBar_data on CollectionType {\n  relayId\n  isWatching\n  ...collection_url\n  ...CollectionWatchlistButton_data\n}\n\nfragment PhoenixCollectionAddressPill_data on CollectionType {\n  assetContracts(first: 2) {\n    edges {\n      node {\n        address\n        blockExplorerLink\n        chain\n        chainData {\n          blockExplorerName\n        }\n        id\n      }\n    }\n  }\n}\n\nfragment PhoenixCollectionInfo_data on CollectionType {\n  description\n  name\n  nativePaymentAsset {\n    ...PaymentAssetLogo_data\n    id\n  }\n  ...collection_stats\n}\n\nfragment PhoenixCollectionSocialBar_data on CollectionType {\n  discordUrl\n  externalUrl\n  instagramUsername\n  mediumUsername\n  telegramUrl\n  twitterUsername\n  connectedTwitterUsername\n  ...collection_url\n}\n\nfragment Price_data on AssetType {\n  decimals\n  imageUrl\n  symbol\n  usdSpotPrice\n  assetContract {\n    blockExplorerLink\n    chain\n    id\n  }\n}\n\nfragment ProfileImage_data on AccountType {\n  imageUrl\n  user {\n    publicUsername\n    id\n  }\n  displayName\n}\n\nfragment SearchPills_data_2Kg4Sq on Query {\n  selectedCollections: collections(first: 25, collections: $collections, includeHidden: true) {\n    edges {\n      node {\n        imageUrl\n        name\n        slug\n        ...CollectionModalContent_data\n        id\n      }\n    }\n  }\n}\n\nfragment SocialBar_data on CollectionType {\n  relayId\n  discordUrl\n  externalUrl\n  instagramUsername\n  mediumUsername\n  slug\n  telegramUrl\n  twitterUsername\n  connectedTwitterUsername\n  assetContracts(first: 2) {\n    edges {\n      node {\n        blockExplorerLink\n        chainData {\n          blockExplorerName\n        }\n        id\n      }\n    }\n  }\n  ...collection_url\n  ...CollectionWatchlistButton_data\n}\n\nfragment StringTraitFilter_data on StringTraitType {\n  counts {\n    count\n    value\n  }\n  key\n}\n\nfragment TrendingCollectionsList_data_29bCDU on Query {\n  trendingCollections(categories: $collections, first: 12) {\n    edges {\n      node {\n        ...CollectionCard_data\n        ...CollectionCard_getShowCollectionCardData\n        relayId\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment accounts_url on AccountType {\n  address\n  user {\n    publicUsername\n    id\n  }\n}\n\nfragment asset_edit_url on AssetType {\n  assetContract {\n    address\n    chain\n    id\n  }\n  tokenId\n  collection {\n    slug\n    id\n  }\n}\n\nfragment asset_url on AssetType {\n  assetContract {\n    address\n    chain\n    id\n  }\n  tokenId\n}\n\nfragment bundle_url on AssetBundleType {\n  slug\n}\n\nfragment collection_stats on CollectionType {\n  statsV2 {\n    numOwners\n    totalSupply\n    totalVolume {\n      unit\n    }\n    floorPrice {\n      unit\n    }\n  }\n}\n\nfragment collection_url on CollectionType {\n  slug\n}\n\nfragment itemEvents_data on AssetType {\n  assetContract {\n    address\n    chain\n    id\n  }\n  tokenId\n}\n\nfragment verification_data on CollectionType {\n  isMintable\n  isSafelisted\n  isVerified\n}\n\nfragment wallet_accountKey on AccountType {\n  address\n}\n",
          variables: {
            collection: collection,
            collections: [collection],
            collectionQuery: null,
            includeHiddenCollections: null,
            numericTraits: null,
            query: null,
            sortAscending: true,
            sortBy: "PRICE",
            stringTraits: null,
            toggles: null,
            showContextMenu: true,
            isCategory: false,
            includeCollectionFilter: false,
          },
        }),
        method: "POST",
        mode: "cors",
        credentials: "include",
      });

      const data = await req.json();
      return data.data.collection;
    } catch (e) {}
  }
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getTopCollections() {
  allCollections = window.allCollections || [];
  let cursor = null;
  for (let index = 0; index < 100; index++) {
    const res = await fetchRanking(cursor);
    res.data.rankings.edges.forEach((_) => {
      allCollections.push({
        isVerified: _.node.isVerified,
        name: _.node.name,
        slug: _.node.slug,
        totalVolume: _.node.statsV2.totalVolume.unit,
        thirtyDayChange: _.node.statsV2.thirtyDayChange,
      });
    });
    if (!res.data.rankings.pageInfo.hasNextPage) {
      console.log("all done");
      break;
    }
    cursor = res.data.rankings.pageInfo.endCursor;
    console.log("allCollections", allCollections);
  }

  return allCollections;
}

(async () => {
  const collections = await getTopCollections();
  parsedCollections = [];
  delayTime = 1;
  for (let index = 0; index < collections.length; index++) {
    const collection = collections[index];
    const fetchd = parsedCollections.find(
      (_) => _.collection.slug == collection.slug
    );
    if (fetchd) continue;
    const detail = await fetchCollection(collection.slug);
    await wait(delayTime * 1000);
    parsedCollections.push({
      collection,
      detail,
    });
  }
  const collectionProjects = parsedCollections
    .filter((_) => _.detail)
    .map((_) => ({
      slug: _.collection.slug,
      name: _.collection.name,
      externalUrl: _.detail.externalUrl,
      twitterUsername:
        _.detail.twitterUsername || _.detail.connectedTwitterUsername,
    }));
  console.log("collectionProjects", collectionProjects);
})();

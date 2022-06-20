import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { useRouter } from 'next/router'
import Layout from 'components/Layout'
import { useState } from 'react'
import useCollection from 'hooks/useCollection'
import useCollectionStats from 'hooks/useCollectionStats'
import useTokens from 'hooks/useTokens'
import useCollectionAttributes from 'hooks/useCollectionAttributes'
import { setToast } from 'components/token/setToast'
import { paths, setParams } from '@reservoir0x/client-sdk'
import Hero from 'components/Hero'
import { formatNumber } from 'lib/numbers'
import Sidebar from 'components/Sidebar'
import AttributesFlex from 'components/AttributesFlex'
import ExploreFlex from 'components/ExploreFlex'
import SortMenuExplore from 'components/SortMenuExplore'
import ViewMenu from 'components/ViewMenu'
import SortMenu from 'components/SortMenu'
import { FiRefreshCcw } from 'react-icons/fi'
import ExploreTokens from 'components/ExploreTokens'
import TokensGrid from 'components/TokensGrid'
import Head from 'next/head'
import FormatEth from 'components/FormatEth'
import useAttributes from 'hooks/useAttributes'
import * as Tabs from '@radix-ui/react-tabs'
import { toggleOnItem } from 'lib/router'
import CollectionActivityTable from 'components/tables/CollectionActivityTable'

// Environment variables
// For more information about these variables
// refer to the README.md file on this repository
// Reference: https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
// REQUIRED
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

// OPTIONAL
const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY

const envBannerImage = process.env.NEXT_PUBLIC_BANNER_IMAGE

const RESERVOIR_API_BASE = process.env.NEXT_PUBLIC_DATA_BASE
const PROXY_API_BASE = process.env.NEXT_PUBLIC_PROXY_API_BASE

const metaTitle = process.env.NEXT_PUBLIC_META_TITLE
const metaDescription = process.env.NEXT_PUBLIC_META_DESCRIPTION
const metaImage = process.env.NEXT_PUBLIC_META_OG_IMAGE

const COLLECTION = process.env.NEXT_PUBLIC_COLLECTION
const COMMUNITY = process.env.NEXT_PUBLIC_COMMUNITY
const COLLECTION_SET_ID = process.env.NEXT_PUBLIC_COLLECTION_SET_ID
const SOURCE_ID = process.env.NEXT_PUBLIC_SOURCE_ID

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Home: NextPage<Props> = ({ fallback, id }) => {
  const router = useRouter()
  const [localListings, setLocalListings] = useState(false)
  const [refreshLoading, setRefreshLoading] = useState(false)

  // const collection = useCollection(fallback.collection, id)
  // const stats = useCollectionStats(router, id)

  const tokens = fallback.tokens
  const collection = fallback.collection

  // const { tokens, ref: refTokens } = useTokens(
  //   id,
  //   [fallback.tokens],
  //   router,
  //   localListings
  // )

  const { collectionAttributes, ref: refCollectionAttributes } =
    useCollectionAttributes(router, id)

  const attributes = useAttributes(id)

  if (!CHAIN_ID) return null

  // if (tokens.error) {
  //   return <div>There was an error</div>
  // }

  const tokenCount = collection.total ?? 0

  // async function refreshCollection(collectionId: string | undefined) {
  //   function handleError(message?: string) {
  //     setToast({
  //       kind: 'error',
  //       message: message || 'Request to refresh collection was rejected.',
  //       title: 'Refresh collection failed',
  //     })

  //     setRefreshLoading(false)
  //   }

  //   try {
  //     if (!collectionId) throw new Error('No collection ID')

  //     const data = {
  //       collection: collectionId,
  //     }

  //     const pathname = `${PROXY_API_BASE}/collections/refresh/v1`

  //     setRefreshLoading(true)

  //     const res = await fetch(pathname, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     })

  //     if (!res.ok) {
  //       const json = await res.json()
  //       handleError(json?.message)
  //       return
  //     }

  //     setToast({
  //       kind: 'success',
  //       message: 'Request to refresh collection was accepted.',
  //       title: 'Refresh collection',
  //     })
  //   } catch (err) {
  //     handleError()
  //     console.error(err)
  //     return
  //   }

  //   setRefreshLoading(false)
  // }

  const title = metaTitle ? (
    <title>{metaTitle}</title>
  ) : (
    <title>{collection.data?.collection?.name}</title>
  )
  const description = metaDescription ? (
    <meta name="description" content={metaDescription} />
  ) : (
    <meta
      name="description"
      content={collection.data?.collection?.metadata?.description as string}
    />
  )

  const bannerImage = (envBannerImage ||
    collection?.data?.collection?.metadata?.bannerImageUrl) as string

  const image = metaImage ? (
    <>
      <meta name="twitter:image" content={metaImage} />
      <meta name="og:image" content={metaImage} />
    </>
  ) : (
    <>
      <meta name="twitter:image" content={bannerImage} />
      <meta property="og:image" content={bannerImage} />
    </>
  )

  const tabs = [
    { name: 'Items', id: 'items' },
    // { name: 'Activity', id: 'activity' },
  ]

  return (
    <Layout navbar={{}}>
      <>
        <Head>
          {title}
          {description}
          {image}
        </Head>
        <Hero collectionId={id} fallback={fallback} />
        <Tabs.Root
          value={router.query?.tab?.toString() || 'items'}
          className="col-span-full grid grid-cols-4 gap-x-4 md:grid-cols-8 lg:grid-cols-12 3xl:grid-cols-16 4xl:grid-cols-21"
        >
          <Tabs.List className="col-span-full flex justify-center border-b border-[#D4D4D4] dark:border-[#525252]">
            {tabs.map(({ name, id }) => (
              <Tabs.Trigger
                key={id}
                id={id}
                value={id}
                className={
                  'group reservoir-h6 relative min-w-0 whitespace-nowrap border-b-2 border-transparent py-4 px-8 text-center text-[#525252] hover:text-black focus:z-10 radix-state-active:border-black radix-state-active:text-black dark:text-white dark:radix-state-active:border-white dark:radix-state-active:text-white'
                }
                onClick={() => toggleOnItem(router, 'tab', id)}
              >
                <span>{name}</span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          <Tabs.Content value="items" asChild>
            <>
              {/* <Sidebar attributes={attributes}/> */}
              <div className="col-span-full px-6 mx-6 mt-4 sm:col-end-[-1] md:col-start-1">
                <div className="mb-10 flex items-center justify-between">
                  <div>
                    <AttributesFlex className="flex flex-wrap gap-3" />
                    <ExploreFlex />
                  </div>
                  {SOURCE_ID && (
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        name="localListings"
                        id="localListings"
                        className="scale-125 transform"
                        onChange={(e) => setLocalListings(e.target.checked)}
                      />
                      <label
                        htmlFor="localListings"
                        className="reservoir-body dark:text-white"
                      >
                        Show Only Local Listings
                      </label>
                    </div>
                  )}
                </div>
                {router.query?.attribute_key ||
                router.query?.attribute_key === '' ? (
                  <ExploreTokens
                    attributes={collectionAttributes}
                    viewRef={refCollectionAttributes}
                  />
                ) : (
                  <TokensGrid
                    tokens={tokens}
                    collectionId={id}
                    collectionImage={
                      collection.data?.collection?.metadata?.imageUrl as string
                    }
                  />
                )}
              </div>
            </>
          </Tabs.Content>
          <Tabs.Content
            value="activity"
            className="col-span-full mx-[25px] grid lg:col-start-2 lg:col-end-[-2]"
          >
            <CollectionActivityTable collection={collection.data?.collection} />
          </Tabs.Content>
        </Tabs.Root>
      </>
    </Layout>
  )
}

export default Home

export const getStaticPaths: GetStaticPaths = async () => {
  const collectionRes = await fetch(`${RESERVOIR_API_BASE}/v1/all.json`)
  const collections: any[] = await collectionRes.json()
  const paths = collections.map(({ contract_address }) => ({
    params: {
      id: contract_address,
    },
  }))
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<{
  collectionId?: string
  fallback: {
    collection: any
    tokens: any[]
  }
  id: string | undefined
}> = async ({ params }) => {
  const options: RequestInit | undefined = {}

  const id = params?.id?.toString()
  const collectionRes = await fetch(`${RESERVOIR_API_BASE}/v1/collections/${id}.json`,
    options
  ) 

  const data = await collectionRes.json() as any;
  return {
    props: {
      fallback: {
        collection: data.collection,
        tokens: data.tokens,
      },
      id,
    },
    revalidate: 20,
  }
}

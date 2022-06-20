import { paths } from '@reservoir0x/client-sdk/dist/types/api'
import fetcher from 'lib/fetcher'
import setParams from 'lib/params'
import { NextRouter } from 'next/router'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite'

const DATA_BASE = process.env.NEXT_PUBLIC_DATA_BASE
const COLLECTION = process.env.NEXT_PUBLIC_COLLECTION
const COMMUNITY = process.env.NEXT_PUBLIC_COMMUNITY
const COLLECTION_SET_ID = process.env.NEXT_PUBLIC_COLLECTION_SET_ID

export default function useCollections(
  router: NextRouter,
  fallback?: any[]
) {
  const { ref, inView } = useInView()
  const sortBy = router.query['sort']?.toString()

  const pathname =
    !sortBy || sortBy && sortBy != 'all'
      ? `${DATA_BASE}/v1/summary_${sortBy}.json`
      : `${DATA_BASE}/v1/all.json`

  const collections = useSWRInfinite<any>(
    (index, previousPageData) => pathname,
    fetcher,
    {
      revalidateFirstPage: false,
      fallbackData: fallback,
    }
  )

  return { collections, ref }
}

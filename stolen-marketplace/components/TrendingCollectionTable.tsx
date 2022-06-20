import { FC } from 'react'
import Link from 'next/link'
import { optimizeImage } from 'lib/optmizeImage'
import FormatEth from 'components/FormatEth'
import useCollections from 'hooks/useCollections'
import { paths } from '@reservoir0x/client-sdk'
import { formatNumber } from 'lib/numbers'
import { useRouter } from 'next/router'
import { PercentageChange } from './hero/HeroStats'
import { useMediaQuery } from '@react-hookz/web'

type Props = {
  fallback: any[]
}

type Volumes = '1DayVolume' | '7DayVolume' | '30DayVolume'

const TrendingCollectionTable: FC<Props> = ({ fallback }) => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 600px)')
  const router = useRouter()
  // Reference: https://swr.vercel.app/examples/infinite-loading
  const { collections, ref } = useCollections(router, fallback)
  const mappedCollections = collections.data
    ? collections.data.flatMap((_) => _)
    : []

  const columns = isSmallDevice
    ? ['Collection', 'Value', 'Stolen']
    : ['Collection', 'Value', 'Stolen']

  return (
    <div className="mb-11 overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            {columns.map((item) => (
              <th
                key={item}
                scope="col"
                className="reservoir-subtitle px-6 py-3 text-left dark:text-white"
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mappedCollections?.map((collection: any, index, arr) => {
            const {
              contract,
              tokenHref,
              image,
              name,
              valueInETH,
              stolen,
              days1,
              days30,
              days7,
              days1Change,
              days7Change,
              days30Change,
              floorSaleChange1Days,
              floorSaleChange7Days,
              floorSaleChange30Days,
              floorPrice,
              supply,
            } = processCollection(collection)

            return (
              <tr
                key={`${contract}-${index}`}
                // ref={index === arr.length - 5 ? ref : null}
                className="group h-[88px] border-b border-neutral-300 dark:border-neutral-600 dark:text-white"
              >
                {/* COLLECTION */}
                <td className="reservoir-body flex items-center gap-4 whitespace-nowrap px-6 py-4 dark:text-white">
                  <div className="reservoir-h6 mr-6 dark:text-white">
                    {index + 1}
                  </div>
                  <Link href={tokenHref}>
                    <a className="flex items-center gap-2">
                      <img
                        src={optimizeImage(image, 140)}
                        className="h-[56px] w-[56px] rounded-full object-cover"
                      />
                      <div
                        className={`reservoir-h6 overflow-hidden truncate whitespace-nowrap dark:text-white ${
                          isSmallDevice ? 'max-w-[140px]' : ''
                        }`}
                      >
                        {name}
                      </div>
                    </a>
                  </Link>
                </td>

                {/* FLOOR PRICE */}
                <td className="reservoir-body whitespace-nowrap px-6 py-4 dark:text-white">
                  <FormatEth amount={valueInETH} />
                </td>

                {/* SUPPLY */}
                {
                  <td className="reservoir-body whitespace-nowrap px-6 py-4 dark:text-white">
                    {stolen ? formatNumber(+stolen) : '-'}
                  </td>
                }
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TrendingCollectionTable

function getFloorDelta(
  currentFloor: number | undefined,
  previousFloor: number | undefined
) {
  if (!currentFloor || !previousFloor) return 0

  return (currentFloor - previousFloor) / previousFloor
}

function processCollection(
  collection: any
) {
  const data = {
    contract: collection?.primaryContract,
    id: collection?.id,
    image: collection?.imageUrl,
    stolen: collection?.total,
    valueInETH: collection.floorPrice
      ? (parseFloat(collection.floorPrice) * collection?.total)
      : 0,
    contract_address: collection?.contract_address,
    name: collection?.name,
    days1: collection?.volume?.['1day'],
    days7: collection?.volume?.['7day'],
    days30: collection?.volume?.['30day'],
    days1Change: collection?.volumeChange?.['1day'],
    days7Change: collection?.volumeChange?.['7day'],
    days30Change: collection?.volumeChange?.['30day'],
    floor1Days: collection?.floorSale?.['1day'],
    floor7Days: collection?.floorSale?.['7day'],
    floor30Days: collection?.floorSale?.['30day'],
    floorSaleChange1Days: collection?.floorSaleChange?.['1day'],
    floorSaleChange7Days: collection?.floorSaleChange?.['7day'],
    floorSaleChange30Days: collection?.floorSaleChange?.['30day'],
    floorPrice: collection?.floorAskPrice,
    supply: collection?.tokenCount,
  }

  const tokenHref = `/collections/${data.contract_address}`

  return { ...data, tokenHref }
}

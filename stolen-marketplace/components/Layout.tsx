import { ComponentProps, FC } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './Navbar'
import NetworkWarning from './NetworkWarning'
import Link from 'next/link'

type Props = {
  navbar: ComponentProps<typeof Navbar>
}

const DARK_MODE = process.env.NEXT_PUBLIC_DARK_MODE

const Layout: FC<Props> = ({ children, navbar }) => {
  return (
    <>
      <Toaster position={'top-right'} />
      {/* <NetworkWarning /> */}
      <main className="mx-auto grid max-w-[2560px] grid-cols-4 gap-x-4 pb-4 md:grid-cols-8 lg:grid-cols-12 3xl:grid-cols-16 4xl:grid-cols-21">
        <Navbar {...navbar} />
        {children}
      </main>
      <div className="group mt-6 mx-auto flex w-full cursor-pointer items-center justify-center gap-3  bg-neutral-100  py-4 px-4 outline-none  transition dark:bg-neutral-800 ">
        <Link href="https://reservoirprotocol.github.io/">
          <a
            className="reservoir-tiny flex gap-2 dark:text-white"
            target="_blank"
          >
            Powered by{' '}
            <img
              src={
                !!DARK_MODE
                  ? `/reservoir_watermark_dark.svg`
                  : `/reservoir_watermark_light.svg`
              }
            />
          </a>
        </Link>
      </div>
    </>
  )
}

export default Layout

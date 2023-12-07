import TradeHubLogo from '@/app/ui/tradehub-logo';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import { poppins } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col bg-black p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-sky-700 p-4 md:h-52">
        <TradeHubLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row ">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-neutral-900 px-6 py-10 md:w-2/5 md:px-20">
          <div className={styles.shape} />
          <p
            className={`${poppins.className} text-5xl text-white md:text-3xl md:leading-normal`}
          >
            <strong>Welcome to TradeHub!</strong>
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-sky-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-neutral-900 md:text-base"
          >
            <span>Log in</span>
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image
            src="/hero-desktop-v2.png"
            width={1000}
            height={686}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshots of the dashboard project showing mobile version"
          />
        </div>
      </div>
    </main>
  );
}

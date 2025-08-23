import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image className="dark:invert" src="/images/taka/logo-color.png" alt="Next.js logo" width={180} height={38} priority />
        <ol className="list-inside list-decimal text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">This page is for authorized personnel only.</li>
          <li className="tracking-[-.01em]">Contact Taka Earth administators for access.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link href="/auth/login">
            <Button size="lg" variant="secondary">
              Login
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="default">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p></p>
      </footer>
    </div>
  );
}

import Link from "next/link";
import { de } from "@/i18n/de";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{de.notFound.title}</h1>
      <p className="text-neutral-700 dark:text-neutral-300">{de.notFound.text}</p>
      <div>
        <Link href="/" className="font-semibold text-accent underline">
          {de.notFound.back}
        </Link>
      </div>
    </div>
  );
}

import { useRouter } from "@tanstack/react-router";
import { de } from "@/i18n/de";
import { ApiError } from "@/lib/api";

function messageFor(error: unknown): string {
  if (error instanceof ApiError) {
    return error.code === null ? de.errors.network : de.errors.codes[error.code];
  }
  return de.common.loadFailed;
}

/** Route error view with a retry that reruns the route loader. */
export function ErrorState({ error }: { error: unknown }) {
  const router = useRouter();
  return (
    <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-900">
      <p className="font-semibold">{de.common.loadFailed}</p>
      <p className="mt-1 text-sm">{messageFor(error)}</p>
      <button
        type="button"
        onClick={() => void router.invalidate()}
        className="mt-3 rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-red-100"
      >
        {de.common.retry}
      </button>
    </div>
  );
}

import { ExtractSearch } from '@/components/extract/extract-search';

export default function ExtractPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Extract</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Search Google Maps leads and send qualified results to Nourish.
          </p>
        </div>
      </div>

      <ExtractSearch />
    </div>
  );
}

'use client';

import { useState } from 'react';

import { StatusBadge } from '@/components/shared/status-badge';
import type { ExtractSearchInput, PlaceRow } from '@/types/places';

const defaultValues: ExtractSearchInput = {
  query: '',
  location: '',
  minRating: 4,
  openNow: false,
  hasWebsite: false,
  maxResults: 10,
  includedType: '',
  regionCode: 'IN'
};

export function ExtractSearch() {
  const [form, setForm] = useState<ExtractSearchInput>(defaultValues);
  const [results, setResults] = useState<PlaceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importingId, setImportingId] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/places/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          minRating: form.minRating ? Number(form.minRating) : undefined,
          maxResults: form.maxResults ? Number(form.maxResults) : 10
        })
      });

      const data = (await res.json()) as { places?: PlaceRow[]; error?: string; details?: string };

      if (!res.ok) {
        throw new Error(data.details ?? data.error ?? 'Search failed');
      }

      setResults(data.places ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function sendToNourish(place: PlaceRow) {
    setImportingId(place.id);
    setError(null);

    try {
      const res = await fetch('/api/leads/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: 'demo-org',
          places: [
            {
              placeId: place.id,
              name: place.displayName,
              primaryType: place.primaryType,
              formattedAddress: place.formattedAddress,
              city: place.city,
              rating: place.rating,
              reviewCount: place.userRatingCount,
              website: place.websiteUri,
              phone: place.nationalPhoneNumber,
              businessStatus: place.businessStatus,
              rawData: place
            }
          ]
        })
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? 'Import failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setImportingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border border-neutral-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Category</span>
            <input
              className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm"
              placeholder="e.g. dentists"
              value={form.query}
              onChange={(e) => setForm((prev) => ({ ...prev, query: e.target.value }))}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Location</span>
            <input
              className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm"
              placeholder="e.g. Bengaluru"
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Type</span>
            <input
              className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm"
              placeholder="e.g. dentist"
              value={form.includedType ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, includedType: e.target.value }))}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Max results</span>
            <input
              type="number"
              min={1}
              max={20}
              className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm"
              value={form.maxResults ?? 10}
              onChange={(e) => setForm((prev) => ({ ...prev, maxResults: Number(e.target.value) }))}
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Min rating</span>
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm"
              value={form.minRating ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, minRating: Number(e.target.value) }))}
            />
          </label>

          <label className="flex items-center gap-2 pt-8 text-sm">
            <input
              type="checkbox"
              checked={form.openNow ?? false}
              onChange={(e) => setForm((prev) => ({ ...prev, openNow: e.target.checked }))}
            />
            Open now
          </label>

          <label className="flex items-center gap-2 pt-8 text-sm">
            <input
              type="checkbox"
              checked={form.hasWebsite ?? false}
              onChange={(e) => setForm((prev) => ({ ...prev, hasWebsite: e.target.checked }))}
            />
            Has website
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-4 py-3">
          <div className="text-sm font-medium">Results</div>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-neutral-100">
              <tr className="text-left text-neutral-600">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Website</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-neutral-500">
                    No results yet.
                  </td>
                </tr>
              ) : (
                results.map((place, index) => (
                  <tr key={place.id} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                    <td className="px-4 py-3 font-medium">{place.displayName}</td>
                    <td className="px-4 py-3 text-neutral-600">{place.primaryType ?? '—'}</td>
                    <td className="px-4 py-3 text-neutral-600">{place.city ?? '—'}</td>
                    <td className="px-4 py-3 text-neutral-600">{place.rating ?? '—'}</td>
                    <td className="px-4 py-3">
                      {place.websiteUri ? (
                        <a className="text-emerald-700 hover:text-emerald-800" href={place.websiteUri} target="_blank" rel="noreferrer">
                          Visit
                        </a>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{place.nationalPhoneNumber ?? '—'}</td>
                    <td className="px-4 py-3">
                      {place.websiteUri ? <StatusBadge label="Website" tone="success" /> : <StatusBadge label="Missing" />}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => void sendToNourish(place)}
                        disabled={importingId === place.id}
                        className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-100 disabled:opacity-50"
                      >
                        {importingId === place.id ? 'Sending...' : 'Send to Nourish'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { GooglePlacesClient } from '@customerly/integrations';

const bodySchema = z.object({
  query: z.string().min(2),
  location: z.string().min(2),
  minRating: z.number().min(0).max(5).optional(),
  openNow: z.boolean().optional(),
  hasWebsite: z.boolean().optional(),
  maxResults: z.number().min(1).max(20).default(10),
  includedType: z.string().optional(),
  regionCode: z.string().length(2).optional()
});

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const client = GooglePlacesClient.create();
    const { query, location, minRating, hasWebsite, maxResults, includedType, regionCode } = parsed.data;
    const result = await client.searchText({
      textQuery: `${query} in ${location}`,
      minRating,
      maxResultCount: maxResults,
      includedType,
      regionCode,
      rankPreference: 'RELEVANCE'
    });

    const normalized = client.normalizePlaces(result.places ?? [])
      .filter((place) => (hasWebsite ? Boolean(place.website) : true))
      .map((place) => ({
        id: place.placeId,
        displayName: place.name,
        primaryType: place.primaryType,
        formattedAddress: place.formattedAddress,
        city: place.city,
        rating: place.rating,
        userRatingCount: place.reviewCount,
        websiteUri: place.website,
        nationalPhoneNumber: place.phone,
        googleMapsUri: place.googleMapsUrl,
        businessStatus: place.businessStatus
      }));

    return NextResponse.json({ places: normalized });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Google Places request failed' },
      { status: 500 }
    );
  }
}

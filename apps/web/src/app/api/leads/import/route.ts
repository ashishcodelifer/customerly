import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const importSchema = z.object({
  organizationId: z.string().min(1),
  places: z.array(
    z.object({
      placeId: z.string(),
      name: z.string(),
      primaryType: z.string().nullable().optional(),
      formattedAddress: z.string().nullable().optional(),
      city: z.string().nullable().optional(),
      state: z.string().nullable().optional(),
      country: z.string().nullable().optional(),
      postalCode: z.string().nullable().optional(),
      latitude: z.number().nullable().optional(),
      longitude: z.number().nullable().optional(),
      rating: z.number().nullable().optional(),
      reviewCount: z.number().nullable().optional(),
      website: z.string().nullable().optional(),
      phone: z.string().nullable().optional(),
      businessStatus: z.string().nullable().optional(),
      photos: z.array(z.string()).optional(),
      rawData: z.record(z.unknown()).optional()
    })
  )
});

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = importSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const { organizationId, places } = parsed.data;

  return NextResponse.json({
    imported: places.length,
    organizationId,
    created: places.length,
    updated: 0,
    results: places.map((place) => ({
      id: place.placeId,
      sourceId: place.placeId,
      name: place.name,
      created: true
    }))
  });
}

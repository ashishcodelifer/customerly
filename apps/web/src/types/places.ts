export type ExtractSearchInput = {
  query: string;
  location: string;
  minRating?: number;
  openNow?: boolean;
  hasWebsite?: boolean;
  maxResults?: number;
  includedType?: string;
  regionCode?: string;
};

export type PlaceRow = {
  id: string;
  displayName: string;
  primaryType: string | null;
  formattedAddress: string | null;
  city: string | null;
  rating: number | null;
  userRatingCount: number | null;
  websiteUri: string | null;
  nationalPhoneNumber: string | null;
  googleMapsUri: string | null;
  businessStatus: string | null;
};

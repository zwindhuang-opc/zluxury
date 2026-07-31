/**
 * Centralized image URL generator for ZLuxury platform
 * 
 * Uses Trae text-to-image API to generate luxury-appropriate product/category images.
 * Eliminates external unsplash.com dependencies that trigger ERR_BLOCKED_BY_ORB.
 * 
 * Image size guide:
 * - square_hd: square product cards, gallery images
 * - landscape_4_3: category banners, feature sections
 * - landscape_16_9: full-width hero sections
 * - portrait_4_3: vertical product showcase
 * 
 * @module utils/images
 */

/** Base URL for the text-to-image generation endpoint */
const IMAGE_ENDPOINT = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image'

/**
 * Builds a Trae text-to-image URL with URL-encoded prompt and size.
 * 
 * @param prompt - Visual description used to generate the image
 * @param imageSize - Size preset from the endpoint schema
 * @returns Fully-qualified image URL
 * 
 * @example
 * heroImage(
 *   'luxury boutique interior with gold accents',
 *   'landscape_16_9'
 * )
 */
export function imageUrl(prompt: string, imageSize: ImageSize = 'square_hd'): string {
  const params = new URLSearchParams({
    prompt: prompt.trim(),
    image_size: imageSize,
  })
  return `${IMAGE_ENDPOINT}?${params.toString()}`
}

export type ImageSize =
  | 'square_hd'
  | 'square'
  | 'portrait_4_3'
  | 'portrait_16_9'
  | 'landscape_4_3'
  | 'landscape_16_9'

// ============================================================================
// CATEGORY-SPECIFIC PROMPTS (reusable across components)
// ============================================================================

export const CATEGORY_IMAGE_PROMPTS: Record<string, { prompt: string; size: ImageSize }> = {
  watches: {
    prompt:
      'Luxury Swiss wristwatch collection, gold and platinum accents, black leather straps, dark marble display pedestal, dramatic studio lighting, ultra high-end product photography, depth of field bokeh',
    size: 'landscape_4_3',
  },
  bags: {
    prompt:
      'Luxury designer handbag collection, premium leather craftsmanship, gold hardware, exclusive exotic skins, elegant fashion photography on velvet background, warm mood lighting',
    size: 'landscape_4_3',
  },
  jewelry: {
    prompt:
      'Fine diamond and gemstone jewelry set, white gold and platinum settings, necklace earrings ring bracelet, dark velvet background, dramatic spot lighting, professional luxury product photography',
    size: 'landscape_4_3',
  },
  fashion: {
    prompt:
      'Haute couture fashion editorial, designer evening gown, silk and lace textures, runway style, supermodel portrait, elegant studio lighting, Vogue magazine quality',
    size: 'landscape_4_3',
  },
  art: {
    prompt:
      'Fine art gallery interior, contemporary paintings and sculptures, museum lighting, white marble floors, minimalist luxury aesthetic, professional architectural photography',
    size: 'landscape_4_3',
  },
  vehicles: {
    prompt:
      'Luxury exotic sports car, midnight black metallic paint, carbon fiber details, dramatic studio lighting, reflective black floor, supercar commercial photography',
    size: 'landscape_4_3',
  },
  realestate: {
    prompt:
      'Exclusive luxury penthouse interior, floor to ceiling windows overlooking skyline, marble floors, gold and crystal accents, high-end real estate photography, sunset lighting',
    size: 'landscape_4_3',
  },
  yachts: {
    prompt:
      'Luxury superyacht at sunset on the Mediterranean, wooden deck, infinity pool on board, golden hour photography, elegant aerial shot, yacht lifestyle editorial',
    size: 'landscape_4_3',
  },
}

/** Build category image URL from category ID */
export function categoryImageUrl(categoryId: string): string {
  const cfg = CATEGORY_IMAGE_PROMPTS[categoryId] || CATEGORY_IMAGE_PROMPTS.watches
  return imageUrl(cfg.prompt, cfg.size)
}

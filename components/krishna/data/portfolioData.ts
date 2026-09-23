export interface PortfolioImage {
  id: string;
  title: string;
  category: CategoryKey;
  categoryName: string;
  imageUrl: string;
  aspectRatio: 'portrait' | 'landscape' | 'square' | 'cinematic';
  alt: string;
  storyCaption?: string;
  year?: string;
  location?: string;
  featured?: boolean;
}

export type CategoryKey =
  | 'wedding'
  | 'engagement'
  | 'pre-wedding'
  | 'portraits'
  | 'newborn-baby'
  | 'maternity'
  | 'pre-birthday'
  | 'saree-ceremony';

export interface CategoryInfo {
  key: CategoryKey;
  label: string;
  num: string;
  subtitle: string;
  description: string;
  quote?: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    key: 'wedding',
    label: 'WEDDING',
    num: '01',
    subtitle: 'Sacred Rituals & Eternal Promises',
    description:
      'From quiet anticipation to unforgettable celebrations, we document every emotion, tradition and connection that makes your wedding uniquely yours.',
    quote: 'Every ceremony is a tapestry of unspoken prayers, joyful tears, and lifelong vows.',
  },
  {
    key: 'engagement',
    label: 'ENGAGEMENT',
    num: '02',
    subtitle: 'The Beginning of Forever',
    description:
      'The quiet chemistry, intimate glances, and joyful anticipation of two lives converging into one journey.',
    quote: 'A gentle prelude to the grandest celebration of your lives.',
  },
  {
    key: 'pre-wedding',
    label: 'PRE WEDDING',
    num: '03',
    subtitle: 'Your Story Before the Celebration',
    description:
      'Your story before the celebration. Relaxed, cinematic moments captured across picturesque landscapes and intimate frames.',
    quote: 'Unrehearsed laughter, effortless romance, and genuine connection.',
  },
  {
    key: 'portraits',
    label: 'PORTRAITS',
    num: '04',
    subtitle: 'The Depth of Human Expression',
    description:
      'Timeless individual, couple, and creative editorial portraits given thoughtful space, poetic light, and intention.',
    quote: 'In every face lies an unwritten biography waiting to be immortalized.',
  },
  {
    key: 'newborn-baby',
    label: 'NEWBORN BABY',
    num: '05',
    subtitle: 'Tender Beginnings & Pure Wonder',
    description:
      'Tender beginnings, tiny details, and pure affection captured in gentle, natural light without artificial poses.',
    quote: 'The smallest feet leave the most enduring footprints in our hearts.',
  },
  {
    key: 'maternity',
    label: 'MATERNITY',
    num: '06',
    subtitle: 'The Grace of Expectant Motherhood',
    description:
      'Graceful, expectant motherhood and the quiet beauty of a growing family embracing a sacred new chapter.',
    quote: 'Carrying life is the quietest, most profound miracle.',
  },
  {
    key: 'pre-birthday',
    label: 'PRE BIRTHDAY',
    num: '07',
    subtitle: 'Milestones & Innocent Wonder',
    description:
      'Playful milestones, genuine laughter, and celebratory childhood memories documented with warmth and artful simplicity.',
    quote: 'Preserving the fleeting magic of early wonder before time rushes ahead.',
  },
  {
    key: 'saree-ceremony',
    label: 'SAREE CEREMONY',
    num: '08',
    subtitle: 'Tradition, Grace & Coming of Age',
    description:
      'Honoring rich cultural heritage, shimmering silks, sacred rituals, and cherished blessings as young women blossom.',
    quote: 'A golden rite of passage woven with generational pride and tender family blessings.',
  },
];

export const PORTFOLIO_IMAGES: PortfolioImage[] = [
  // FEATURED SELECTIONS (Cross-category highlights)
  {
    id: 'feat-1',
    title: 'The Royal Mandap Embrace',
    category: 'wedding',
    categoryName: 'Wedding',
    imageUrl:
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Indian bride and groom sharing a serene candid moment under floral mandap by Krishna Photography',
    storyCaption: 'Quiet glance amidst holy chants and marigold showers.',
    year: '2024',
    location: 'Udaipur Palace Grounds',
    featured: true,
  },
  {
    id: 'feat-2',
    title: 'Silken Grace at Sunset',
    category: 'saree-ceremony',
    categoryName: 'Saree Ceremony',
    imageUrl:
      'https://images.unsplash.com/photo-1584278860047-22db9ff82bed?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Traditional saree ceremony portrait of a young lady in yellow silk saree with temple jewelry',
    storyCaption: 'Draped in heritage gold and blessings from three generations.',
    year: '2024',
    location: 'Hyderabad Heritage Villa',
    featured: true,
  },
  {
    id: 'feat-3',
    title: 'Golden Hour Silhouette',
    category: 'pre-wedding',
    categoryName: 'Pre Wedding',
    imageUrl:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1400',
    aspectRatio: 'cinematic',
    alt: 'Romantic cinematic pre-wedding couple framed against coastal twilight horizon',
    storyCaption: 'Where whispered laughter turns into timeless echoes.',
    year: '2024',
    location: 'Rushikonda Shoreline, Vizag',
    featured: true,
  },
  {
    id: 'feat-4',
    title: 'Quiet Slumber & Gentle Warmth',
    category: 'newborn-baby',
    categoryName: 'Newborn Baby',
    imageUrl:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000',
    aspectRatio: 'square',
    alt: 'Peaceful sleeping newborn baby cradled in natural woolen wrap captured by Krishna Photography',
    storyCaption: 'Ten days old and already holding the entire universe.',
    year: '2024',
    location: 'Private Studio, Visakhapatnam',
    featured: true,
  },
  {
    id: 'feat-5',
    title: 'Expectant Dawn',
    category: 'maternity',
    categoryName: 'Maternity',
    imageUrl:
      'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=1000',
    aspectRatio: 'portrait',
    alt: 'Graceful expectant mother in soft natural light holding her baby bump',
    storyCaption: 'A mother’s heart beating in quiet synchrony with new life.',
    year: '2024',
    location: 'Bheemili Botanical Gardens',
    featured: true,
  },
  {
    id: 'feat-6',
    title: 'Unscripted Chemistry',
    category: 'engagement',
    categoryName: 'Engagement',
    imageUrl:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'landscape',
    alt: 'Engagement couple candid portrait laughing together outdoors in golden evening light',
    storyCaption: 'Caught in that honest, unposed second before the smile settles.',
    year: '2024',
    location: 'Aravalli Hills Resort',
    featured: true,
  },

  // 01 WEDDING CATEGORY
  {
    id: 'wed-1',
    title: 'The Regal Bride',
    category: 'wedding',
    categoryName: 'Wedding',
    imageUrl:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Traditional Indian bride portrait in intricately embroidered red lehenga with royal kundan jewelry',
    storyCaption: 'Elegance woven in crimson thread and timeless ancestral pearls.',
    year: '2024',
    location: 'Taj Falaknuma, Hyderabad',
  },
  {
    id: 'wed-2',
    title: 'The Varmala Exchange',
    category: 'wedding',
    categoryName: 'Wedding',
    imageUrl:
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'landscape',
    alt: 'Bride and groom exchanging fresh floral varmala garlands surrounded by cheering family',
    storyCaption: 'Rose petals suspended in mid-air as two souls seal their union.',
    year: '2024',
    location: 'Radisson Blu Resort, Vizag',
  },
  {
    id: 'wed-3',
    title: 'Sacred Agni & The Seven Steps',
    category: 'wedding',
    categoryName: 'Wedding',
    imageUrl:
      'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Couple taking saptapadi pheras around the holy sacred fire during wedding ritual',
    storyCaption: 'Seven promises witnessed by holy flames and collective blessings.',
    year: '2024',
    location: 'Grand Heritage Hall, Vijayawada',
  },
  {
    id: 'wed-4',
    title: 'Intricate Bridal Mehendi',
    category: 'wedding',
    categoryName: 'Wedding',
    imageUrl:
      'https://images.unsplash.com/photo-1596451190630-186aff535bf2?auto=format&fit=crop&q=80&w=1000',
    aspectRatio: 'square',
    alt: 'Detailed close-up of bridal hands adorned with dark henna art and gold bangles',
    storyCaption: 'Hidden initials painted into intricate botanical paisley motifs.',
    year: '2024',
    location: 'Private Residence, Vizag',
  },
  {
    id: 'wed-5',
    title: 'The Groom’s Grand Entry',
    category: 'wedding',
    categoryName: 'Wedding',
    imageUrl:
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=1400',
    aspectRatio: 'cinematic',
    alt: 'Cinematic wide frame of groom arriving with baraat celebration and brass lamps',
    storyCaption: 'Pounding dhol beats, swirling turbans, and electric celebration.',
    year: '2024',
    location: 'Novotel Varun Beach',
  },
  {
    id: 'wed-6',
    title: 'A Father’s Blessing',
    category: 'wedding',
    categoryName: 'Wedding',
    imageUrl:
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'landscape',
    alt: 'Emotional candid father blessing his daughter on wedding day',
    storyCaption: 'A quiet squeeze of hands that conveys twenty-five years of love.',
    year: '2024',
    location: 'ITC Kakatiya, Hyderabad',
  },

  // 02 ENGAGEMENT CATEGORY
  {
    id: 'eng-1',
    title: 'A Ring of Promises',
    category: 'engagement',
    categoryName: 'Engagement',
    imageUrl:
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Engagement couple smiling softly with diamond ring in warm ambient lights',
    storyCaption: 'The instant anticipation turns into a declared promise.',
    year: '2024',
    location: 'The Park Hotel, Visakhapatnam',
  },
  {
    id: 'eng-2',
    title: 'Whispered Affection',
    category: 'engagement',
    categoryName: 'Engagement',
    imageUrl:
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'landscape',
    alt: 'Couple sharing candid laughter in modern engagement attire outdoors',
    storyCaption: 'No stage directions; simply two people blissfully lost in the moment.',
    year: '2024',
    location: 'Jubilee Hills Garden, Hyderabad',
  },
  {
    id: 'eng-3',
    title: 'The Diamond Detail',
    category: 'engagement',
    categoryName: 'Engagement',
    imageUrl:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000',
    aspectRatio: 'square',
    alt: 'Artistic macro shot of engagement rings resting on velvet box and white jasmine blooms',
    storyCaption: 'Every curve and gemstone reflecting the dawn of tomorrow.',
    year: '2024',
    location: 'Krishna Studio, Vizag',
  },
  {
    id: 'eng-4',
    title: 'Evening Celebration Lights',
    category: 'engagement',
    categoryName: 'Engagement',
    imageUrl:
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=1400',
    aspectRatio: 'cinematic',
    alt: 'Engagement party celebration under fairy lights and hanging floral arches',
    storyCaption: 'Under a canopy of fairy lights as friends toast to new chapters.',
    year: '2024',
    location: 'Ananthagiri Hills Lawn',
  },
  {
    id: 'eng-5',
    title: 'Garden Sunset Promise',
    category: 'engagement',
    categoryName: 'Engagement',
    imageUrl:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Engagement couple strolling hand in hand in sunlit garden',
    storyCaption: 'Quiet footsteps in a golden garden, promising eternity.',
    year: '2024',
    location: 'Rushikonda Hills',
  },
  {
    id: 'eng-6',
    title: 'Golden Ring Exchange',
    category: 'engagement',
    categoryName: 'Engagement',
    imageUrl:
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'landscape',
    alt: 'Close-up of traditional golden ring exchange ceremony with florals',
    storyCaption: 'A symbol of devotion sliding gently onto finger with quiet tears.',
    year: '2024',
    location: 'Royal Palace, Vizag',
  },
  {
    id: 'eng-7',
    title: 'The Engagement Toast',
    category: 'engagement',
    categoryName: 'Engagement',
    imageUrl:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'cinematic',
    alt: 'Couple toasting with champagne under fairy lights',
    storyCaption: 'Glasses clinking to the beginning of forever.',
    year: '2024',
    location: 'Dolphin Hotel',
  },

  // 03 PRE WEDDING CATEGORY
  {
    id: 'pre-1',
    title: 'Azure Coastline Breeze',
    category: 'pre-wedding',
    categoryName: 'Pre Wedding',
    imageUrl:
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Pre-wedding couple standing on seaside rocks with ocean waves breaking softly',
    storyCaption: 'The restless sea echoing the calm anchor they found in each other.',
    year: '2024',
    location: 'Yarada Beach, Visakhapatnam',
  },
  {
    id: 'pre-2',
    title: 'Architectural Shadows',
    category: 'pre-wedding',
    categoryName: 'Pre Wedding',
    imageUrl:
      'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'landscape',
    alt: 'Cinematic couple walking hand in hand through sandstone arches with dramatic sun shafts',
    storyCaption: 'Light piercing through timeless carved columns of history.',
    year: '2024',
    location: 'Kondaveedu Fort Ruins',
  },
  {
    id: 'pre-3',
    title: 'Golden Meadow Laughter',
    category: 'pre-wedding',
    categoryName: 'Pre Wedding',
    imageUrl:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=1000',
    aspectRatio: 'portrait',
    alt: 'Couple laughing candidly in a golden sunlit meadow at sunset',
    storyCaption: 'Natural, unforced moments bathed in amber autumn light.',
    year: '2024',
    location: 'Araku Valley Terraces',
  },
  {
    id: 'pre-4',
    title: 'Twilight Reverie',
    category: 'pre-wedding',
    categoryName: 'Pre Wedding',
    imageUrl:
      'https://images.unsplash.com/photo-1509927083803-4bd519298ac4?auto=format&fit=crop&q=80&w=1400',
    aspectRatio: 'cinematic',
    alt: 'Wide cinematic pre-wedding shot of couple walking into dusk sky with long shadows',
    storyCaption: 'Framed between earth and sky just as the stars begin to whisper.',
    year: '2024',
    location: 'Lambasinghi Hills',
  },
  {
    id: 'pre-5',
    title: 'Coastal Horizon',
    category: 'pre-wedding',
    categoryName: 'Pre Wedding',
    imageUrl:
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Couple walking along scenic shoreline at golden hour',
    storyCaption: 'Footprints on sun-warmed sand that the tides cannot wash away.',
    year: '2024',
    location: 'Bheemili Beach',
  },
  {
    id: 'pre-6',
    title: 'Echoes of Love',
    category: 'pre-wedding',
    categoryName: 'Pre Wedding',
    imageUrl:
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'landscape',
    alt: 'Couple framed by historic arches in natural ambient light',
    storyCaption: 'Timeless love framed by classic stone porticos.',
    year: '2024',
    location: 'Simhachalam Foothills',
  },
  {
    id: 'pre-7',
    title: 'Sunrise Serenade',
    category: 'pre-wedding',
    categoryName: 'Pre Wedding',
    imageUrl:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'cinematic',
    alt: 'Silhouette of couple at dawn with misty hills',
    storyCaption: 'Greeting the first light together as future husband and wife.',
    year: '2024',
    location: 'Vanajangi Hills',
  },

  // 04 PORTRAITS CATEGORY
  {
    id: 'por-1',
    title: 'The Silent Gaze',
    category: 'portraits',
    categoryName: 'Portraits',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Editorial fine art portrait of a woman with dramatic natural window lighting',
    storyCaption: 'Purity in simplicity: soft contrast and unguarded depth.',
    year: '2024',
    location: 'Studio Minimalist, Vizag',
  },
  {
    id: 'por-2',
    title: 'Traditional Splendor',
    category: 'portraits',
    categoryName: 'Portraits',
    imageUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Classic Indian portrait in pure silk with temple gold jhumkas and jasmine flowers',
    storyCaption: 'Honoring heritage through poise, grace and timeless elegance.',
    year: '2024',
    location: 'Hyderabad Cultural Centre',
  },
  {
    id: 'por-3',
    title: 'Monochrome Intimacy',
    category: 'portraits',
    categoryName: 'Portraits',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000',
    aspectRatio: 'square',
    alt: 'Black and white classic fine-art male portrait with Rembrandt lighting',
    storyCaption: 'When color is stripped away, character speaks with quiet authority.',
    year: '2024',
    location: 'Krishna Studio, Vizag',
  },
  {
    id: 'por-4',
    title: 'Natural Light Study',
    category: 'portraits',
    categoryName: 'Portraits',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'landscape',
    alt: 'Environmental portrait with warm natural bokeh and thoughtful glance',
    storyCaption: 'Every portrait captured at Krishna Photography honors genuine spirit.',
    year: '2024',
    location: 'Kailasagiri Overlook',
  },
  {
    id: 'por-5',
    title: 'Reflective Grace',
    category: 'portraits',
    categoryName: 'Portraits',
    imageUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Intimate studio portrait focusing on delicate expressions and light',
    storyCaption: 'The quiet beauty found in unguarded stillness.',
    year: '2024',
    location: 'Studio Vizag',
  },
  {
    id: 'por-6',
    title: 'Cinematic Stance',
    category: 'portraits',
    categoryName: 'Portraits',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Dignified portrait with warm chiaroscuro shadow play',
    storyCaption: 'Shadows sculpting strength, dignity and wisdom.',
    year: '2024',
    location: 'Heritage Quarter, Vizag',
  },
  {
    id: 'por-7',
    title: 'Golden Hour Silhouette',
    category: 'portraits',
    categoryName: 'Portraits',
    imageUrl:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'cinematic',
    alt: 'Fine art portrait against golden sunset horizon',
    storyCaption: 'A timeless silhouette framed by setting sun and coastal breeze.',
    year: '2024',
    location: 'Tenneti Park',
  },

  // 05 NEWBORN BABY CATEGORY
  {
    id: 'new-1',
    title: 'Peaceful Slumber',
    category: 'newborn-baby',
    categoryName: 'Newborn Baby',
    imageUrl:
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=1000',
    aspectRatio: 'square',
    alt: 'Tender close-up of sleeping newborn baby in oatmeal linen wrap',
    storyCaption: 'Nine days of life, breathing softly in a world made gentle for you.',
    year: '2024',
    location: 'In-home Studio Session',
  },
  {
    id: 'new-2',
    title: 'Tiny Hands in Father’s Palm',
    category: 'newborn-baby',
    categoryName: 'Newborn Baby',
    imageUrl:
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'landscape',
    alt: 'Father gently holding tiny newborn baby hand showing delicate contrast of size',
    storyCaption: 'A promise of protection whispered without words.',
    year: '2024',
    location: 'Studio Visakhapatnam',
  },
  {
    id: 'new-3',
    title: 'Mother’s Sacred Embrace',
    category: 'newborn-baby',
    categoryName: 'Newborn Baby',
    imageUrl:
      'https://images.unsplash.com/photo-1510154221590-ff63e90a136f?auto=format&fit=crop&q=80&w=1000',
    aspectRatio: 'portrait',
    alt: 'Mother holding her newborn close to heart in natural soft window light',
    storyCaption: 'The safest harbor in the entire world.',
    year: '2024',
    location: 'Home Session, Madhurawada',
  },
  {
    id: 'new-4',
    title: 'Curled in Cocoon',
    category: 'newborn-baby',
    categoryName: 'Newborn Baby',
    imageUrl:
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'landscape',
    alt: 'Newborn sleeping peacefully surrounded by soft neutral textures',
    storyCaption: 'Every curl of a finger is a tiny miracle to be remembered.',
    year: '2024',
    location: 'Krishna Studio, Vizag',
  },
  {
    id: 'new-5',
    title: 'Gentle Dreams',
    category: 'newborn-baby',
    categoryName: 'Newborn Baby',
    imageUrl:
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Sleeping baby wrapped snugly in knitted organic wool',
    storyCaption: 'Wrapped in handmade warmth and quiet serenity.',
    year: '2024',
    location: 'Krishna Studio, Vizag',
  },
  {
    id: 'new-6',
    title: 'Tender Tenderness',
    category: 'newborn-baby',
    categoryName: 'Newborn Baby',
    imageUrl:
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'square',
    alt: 'Gentle hands cradling the newborn head with pure tenderness',
    storyCaption: 'Little fingers holding tightly to father’s hand.',
    year: '2024',
    location: 'Vizag Residence',
  },
  {
    id: 'new-7',
    title: 'First Morning Light',
    category: 'newborn-baby',
    categoryName: 'Newborn Baby',
    imageUrl:
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'cinematic',
    alt: 'Baby resting peacefully on soft cotton bedding in sunlight',
    storyCaption: 'The quiet beauty of early dawn in the nursery.',
    year: '2024',
    location: 'Studio Suite',
  },

  // 06 MATERNITY CATEGORY
  {
    id: 'mat-1',
    title: 'The Maternal Glow',
    category: 'maternity',
    categoryName: 'Maternity',
    imageUrl:
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Elegant maternity portrait of expectant mother in flowing dress in soft sunlight',
    storyCaption: 'Radiance that comes only from nurturing tomorrow within.',
    year: '2024',
    location: 'Botanical Sanctuary, Vizag',
  },
  {
    id: 'mat-2',
    title: 'Shared Anticipation',
    category: 'maternity',
    categoryName: 'Maternity',
    imageUrl:
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'landscape',
    alt: 'Couple tenderly holding hands over baby bump in golden hour outdoors',
    storyCaption: 'Two hearts beating in eager preparation to welcome a third.',
    year: '2024',
    location: 'Tenneti Park Cliffs',
  },
  {
    id: 'mat-3',
    title: 'Silhouette by the Window',
    category: 'maternity',
    categoryName: 'Maternity',
    imageUrl:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=1000',
    aspectRatio: 'portrait',
    alt: 'Fine art maternity silhouette of expectant mother standing in front of sheer white drapery',
    storyCaption: 'Poetry in shadow and line — the sacred architecture of motherhood.',
    year: '2024',
    location: 'Studio Suite, Visakhapatnam',
  },
  {
    id: 'mat-4',
    title: 'Nature’s Blessing',
    category: 'maternity',
    categoryName: 'Maternity',
    imageUrl:
      'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&q=80&w=1400',
    aspectRatio: 'cinematic',
    alt: 'Wide landscape maternity shoot in misty green meadows with ethereal light',
    storyCaption: 'Surrounded by nature’s blooming grace.',
    year: '2024',
    location: 'Coffee Plantations, Araku',
  },
  {
    id: 'mat-5',
    title: 'Whispering to the Bump',
    category: 'maternity',
    categoryName: 'Maternity',
    imageUrl:
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Expecting father kissing mother’s bump in sunlit living space',
    storyCaption: 'A quiet whisper into the future, felt from within.',
    year: '2024',
    location: 'Residence, Vizag',
  },
  {
    id: 'mat-6',
    title: 'Glow of New Life',
    category: 'maternity',
    categoryName: 'Maternity',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Artistic silhouette of mother admiring baby bump at sunrise',
    storyCaption: 'Bathed in morning glow, anticipating the journey ahead.',
    year: '2024',
    location: 'Beach Road, Vizag',
  },
  {
    id: 'mat-7',
    title: 'Sunlit Meadow Walk',
    category: 'maternity',
    categoryName: 'Maternity',
    imageUrl:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'cinematic',
    alt: 'Expecting couple walking peacefully among wildflowers',
    storyCaption: 'Walking hand-in-hand toward their sweetest blessing.',
    year: '2024',
    location: 'Araku Valley',
  },

  // 07 PRE BIRTHDAY CATEGORY
  {
    id: 'bday-1',
    title: 'The First Year Smile',
    category: 'pre-birthday',
    categoryName: 'Pre Birthday',
    imageUrl:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'One year old child laughing joyfully during pre-birthday photoshoot with pastel props',
    storyCaption: 'Pure, uninhibited joy celebrating 365 days of love.',
    year: '2024',
    location: 'Krishna Studio, Vizag',
  },
  {
    id: 'bday-2',
    title: 'Little Explorer',
    category: 'pre-birthday',
    categoryName: 'Pre Birthday',
    imageUrl:
      'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'landscape',
    alt: 'Toddler playing outdoors in garden grass with vintage wooden toys during birthday session',
    storyCaption: 'Curiosity in every step and wonder in every glance.',
    year: '2024',
    location: 'Sivaji Park Lawn',
  },
  {
    id: 'bday-3',
    title: 'Cake & Giggles',
    category: 'pre-birthday',
    categoryName: 'Pre Birthday',
    imageUrl:
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1000',
    aspectRatio: 'square',
    alt: 'Baby enjoying playful cake smash with organic neutral frosting and wooden cake stand',
    storyCaption: 'Messy hands and heart-melting laughter.',
    year: '2024',
    location: 'Studio Visakhapatnam',
  },
  {
    id: 'bday-4',
    title: 'Family In The Air',
    category: 'pre-birthday',
    categoryName: 'Pre Birthday',
    imageUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1400',
    aspectRatio: 'cinematic',
    alt: 'Parents joyfully tossing their one year old child in the air against open sky',
    storyCaption: 'Held high in the warmth of unconditional devotion.',
    year: '2024',
    location: 'Beach Road, Visakhapatnam',
  },
  {
    id: 'bday-5',
    title: 'Balloon Wonder',
    category: 'pre-birthday',
    categoryName: 'Pre Birthday',
    imageUrl:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Baby sitting surrounded by pastel balloons celebrating first birthday milestone',
    storyCaption: 'Wide wonder in little eyes surrounded by pastel balloons.',
    year: '2024',
    location: 'Studio Visakhapatnam',
  },
  {
    id: 'bday-6',
    title: 'Birthday Cupcake Joy',
    category: 'pre-birthday',
    categoryName: 'Pre Birthday',
    imageUrl:
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'landscape',
    alt: 'Toddler reaching eagerly for colorful birthday cake',
    storyCaption: 'Sweetest smiles and sticky joyful fingers.',
    year: '2024',
    location: 'Family Residence',
  },
  {
    id: 'bday-7',
    title: 'Giggles & Confetti',
    category: 'pre-birthday',
    categoryName: 'Pre Birthday',
    imageUrl:
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'cinematic',
    alt: 'Parents celebrating baby first milestone with paper confetti and joy',
    storyCaption: 'Laughter ringing across the room as confetti falls.',
    year: '2024',
    location: 'Grand Bay Hotel',
  },

  // 08 SAREE CEREMONY CATEGORY
  {
    id: 'saree-1',
    title: 'The Golden Kanjeevaram',
    category: 'saree-ceremony',
    categoryName: 'Saree Ceremony',
    imageUrl:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Young woman in traditional golden silk saree with intricate temple gold jewellery for half saree ceremony',
    storyCaption: 'Stepping into womanhood with ancient grace and radiant dignity.',
    year: '2024',
    location: 'Gajuwaka Heritage Palace, Vizag',
  },
  {
    id: 'saree-2',
    title: 'The Sacred Aarti Blessing',
    category: 'saree-ceremony',
    categoryName: 'Saree Ceremony',
    imageUrl:
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'landscape',
    alt: 'Elders giving traditional aarti blessing to girl dressed in festive half saree with marigold decorations',
    storyCaption: 'Sacred camphor flames reflecting hopes and lifelong blessings.',
    year: '2024',
    location: 'Family Courtyard, Anakapalle',
  },
  {
    id: 'saree-3',
    title: 'Gajra & Silken Pleats',
    category: 'saree-ceremony',
    categoryName: 'Saree Ceremony',
    imageUrl:
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=1000',
    aspectRatio: 'square',
    alt: 'Close-up detail of fresh jasmine gajra in hair and intricate zardozi embroidery on traditional saree',
    storyCaption: 'The scent of fresh jasmine and the rustle of pure silk.',
    year: '2024',
    location: 'Heritage Suite, Vizag',
  },
  {
    id: 'saree-4',
    title: 'Generations of Grace',
    category: 'saree-ceremony',
    categoryName: 'Saree Ceremony',
    imageUrl:
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=1400',
    aspectRatio: 'cinematic',
    alt: 'Grandmother and mother lovingly adjusting the pallu for the young girl during traditional saree function',
    storyCaption: 'Tradition is not preserved in books; it is passed tenderly from mother to daughter.',
    year: '2024',
    location: 'Vizag Convention Center',
  },
  {
    id: 'saree-5',
    title: 'Temple Bell Blessings',
    category: 'saree-ceremony',
    categoryName: 'Saree Ceremony',
    imageUrl:
      'https://images.unsplash.com/photo-1584278860047-22db9ff82bed?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'portrait',
    alt: 'Girl offering prayers in traditional silk pavada saree at temple',
    storyCaption: 'Prayers whispered beneath the temple bells.',
    year: '2024',
    location: 'Simhachalam Temple',
  },
  {
    id: 'saree-6',
    title: 'Henna & Golden Bangles',
    category: 'saree-ceremony',
    categoryName: 'Saree Ceremony',
    imageUrl:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'square',
    alt: 'Close-up of traditional mehndi patterns on hands holding auspicious coconut',
    storyCaption: 'Intricate henna swirls mirroring the blossoming of youth.',
    year: '2024',
    location: 'Vizag',
  },
  {
    id: 'saree-7',
    title: 'Celebratory Family Portrait',
    category: 'saree-ceremony',
    categoryName: 'Saree Ceremony',
    imageUrl:
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=1200',
    aspectRatio: 'cinematic',
    alt: 'Family surrounding young girl during traditional half saree ceremony celebration',
    storyCaption: 'Surrounded by generations of unconditional love and blessings.',
    year: '2024',
    location: 'Convention Centre',
  },
];

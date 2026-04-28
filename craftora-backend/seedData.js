const BASE = 'http://localhost:5000/uploads/products';
const IMG = {
  j: `${BASE}/jewelry.png`,
  p: `${BASE}/pottery.png`,
  a: `${BASE}/paintings.png`,
  d: `${BASE}/decor.png`,
  t: `${BASE}/textiles.png`,
  s: `${BASE}/sculpture.png`,
  l: `${BASE}/leather.png`,
  w: `${BASE}/woodwork.png`,
  c: `${BASE}/candles.png`,
};

const mk = (seller, title, desc, price, cat, stock, img, mats, tags, sales, rating, disc) => ({
  seller,
  title,
  description: desc,
  price,
  ...(disc ? { discountPrice: disc } : {}),
  category: cat,
  stock,
  images: [{ url: img }],
  isSustainable: true,
  materials: mats,
  tags,
  status: 'approved',
  totalSales: sales,
  averageRating: rating,
  numReviews: Math.floor(sales / 3),
});

const getProducts = (s) => {
  const [s0, s1, s2] = s;
  return [
    // ── Jewelry ──────────────────────────────────────────────────────────────
    mk(s0,'Gold Wire-Wrapped Amethyst Ring','Hand-formed 18k gold-filled wire wraps a raw amethyst crystal in this one-of-a-kind statement ring.',2800,'Jewelry',10,IMG.j,['18k Gold-Fill','Amethyst'],['ring','gemstone','handmade'],34,4.8),
    mk(s0,'Moonstone Silver Pendant','Sterling silver bezel sets a glowing moonstone, suspended on a delicate 18" chain. Ethically sourced.',3200,'Jewelry',8,IMG.j,['Sterling Silver','Moonstone'],['pendant','necklace','silver'],28,4.9,2800),
    mk(s0,'Turquoise Boho Earrings','Hand-forged copper hoops with genuine turquoise drops. Lightweight and hypoallergenic.',1800,'Jewelry',15,IMG.j,['Copper','Turquoise'],['earrings','boho','turquoise'],52,4.7),
    mk(s0,'Labradorite Statement Necklace','Chunky labradorite cabochon wrapped in oxidised silver wire on a leather cord.',4500,'Jewelry',6,IMG.j,['Silver Wire','Labradorite','Leather'],['necklace','labradorite','statement'],18,4.9),
    mk(s0,'Rose Quartz Crystal Bracelet','Faceted rose quartz beads on stretchy cord with a silver heart charm.',1500,'Jewelry',20,IMG.j,['Rose Quartz','Silver'],['bracelet','crystal','rose quartz'],67,4.6,1200),
    mk(s0,'Hammered Copper Cuff','Wide hammered copper cuff bangle with patina finish. Each piece uniquely textured.',2200,'Jewelry',12,IMG.j,['Copper'],['cuff','bangle','copper'],41,4.7),
    mk(s1,'Lapis Lazuli Drop Earrings','Deep blue lapis lazuli ovals in simple gold-fill ear wire drops for everyday elegance.',2600,'Jewelry',9,IMG.j,['Lapis Lazuli','Gold-Fill'],['earrings','lapis','gold'],23,4.8),
    mk(s1,'Pearl Cluster Stud Earrings','Freshwater pearls clustered on sterling silver posts. Classic meets organic.',2000,'Jewelry',14,IMG.j,['Freshwater Pearl','Sterling Silver'],['earrings','pearl','studs'],39,4.9,1700),
    mk(s1,'Garnet Stackable Ring Set','Set of three delicate stackable rings with tiny garnet stones. Mix and match freely.',1900,'Jewelry',18,IMG.j,['Sterling Silver','Garnet'],['rings','stackable','garnet'],55,4.7),
    mk(s2,'Hand-Stamped Silver Bangle','Personalised sterling silver bangle with hand-stamped botanical motifs.',3500,'Jewelry',7,IMG.j,['Sterling Silver'],['bangle','botanical','personalised'],16,5.0),

    // ── Pottery ──────────────────────────────────────────────────────────────
    mk(s0,'Rustic Terracotta Vase','Hand-thrown terracotta vase with raw earthy finish. Perfect for dried botanicals.',3500,'Pottery',5,IMG.p,['Terracotta Clay','Natural Glaze'],['vase','terracotta','rustic'],12,4.8),
    mk(s0,'Speckled Ceramic Mug Set','Set of two stoneware mugs with speckled white glaze and thick ergonomic handles.',2200,'Pottery',12,IMG.p,['Stoneware','Food-safe Glaze'],['mugs','coffee','speckled'],45,4.7,1800),
    mk(s0,'Wabi-Sabi Ceramic Bowl','Wide shallow bowl inspired by Japanese wabi-sabi. Subtle ash glaze in soft grey.',4100,'Pottery',7,IMG.p,['Stoneware','Ash Glaze'],['bowl','japanese','wabi-sabi'],21,4.9),
    mk(s0,'Raku-Fired Incense Holder','Small raku-fired pinch pot incense holder with crackle glaze finish.',1200,'Pottery',20,IMG.p,['Raku Clay','Crackle Glaze'],['incense','raku','holder'],63,4.6,950),
    mk(s0,'Ceramic Pour-Over Coffee Set','Handmade pour-over dripper with matching mug in matte charcoal glaze.',5800,'Pottery',4,IMG.p,['Stoneware','Matte Glaze'],['coffee','pour-over','set'],9,4.9),
    mk(s0,'Blue Salt-Glaze Serving Platter','Wide oval serving platter with traditional salt-glaze in ocean blue.',6200,'Pottery',3,IMG.p,['Stoneware','Salt Glaze'],['platter','serving','blue'],7,4.8),
    mk(s1,'Terracotta Plant Pot Set','Set of three nested terracotta pots with saucers. Ideal for succulents.',2800,'Pottery',10,IMG.p,['Terracotta'],['plant pot','succulents','set'],38,4.7,2400),
    mk(s1,'Hand-Pinched Espresso Cups','Set of four tiny pinched espresso cups in speckled cream, each unique.',1900,'Pottery',8,IMG.p,['Porcelain','Speckle Glaze'],['espresso','cups','porcelain'],29,4.8),
    mk(s1,'Stoneware Soap Dispenser','Wheel-thrown soap dispenser with matte sage green glaze and brass pump.',3400,'Pottery',6,IMG.p,['Stoneware','Matte Glaze'],['soap dispenser','bathroom','sage'],14,4.7),
    mk(s2,'Ceramic Wind Chime','Six hand-thrown ceramic discs strung on waxed cord, gentle melodic tones.',2600,'Pottery',11,IMG.p,['Porcelain','Waxed Cord'],['wind chime','garden','ceramic'],22,4.6),

    // ── Paintings ────────────────────────────────────────────────────────────
    mk(s2,'Indigo Abstract Canvas','Large 60×80cm original abstract painting in deep indigo and gold leaf on stretched canvas.',12000,'Paintings',1,IMG.a,['Acrylic','Gold Leaf','Canvas'],['abstract','indigo','gold'],5,5.0),
    mk(s2,'Botanical Watercolour Print','A4 hand-painted watercolour of wild herbs, signed and mounted. Ready to frame.',2800,'Paintings',8,IMG.a,['Watercolour','Cotton Paper'],['botanical','watercolour','herbs'],31,4.8,2400),
    mk(s2,'Sunset Seascape Oil Painting','50×40cm oil on linen seascape capturing a dramatic golden-hour coastal scene.',9500,'Paintings',1,IMG.a,['Oil Paint','Linen Canvas'],['seascape','oil','sunset'],3,5.0),
    mk(s0,'Geometric Gouache Study','Series of four A5 geometric gouache studies in muted earth tones. Sold as a set.',4200,'Paintings',5,IMG.a,['Gouache','Acid-free Paper'],['geometric','gouache','earth tones'],17,4.7),
    mk(s1,'Portrait in Charcoal','Original A3 charcoal portrait study on acid-free paper, expressive loose style.',6800,'Paintings',1,IMG.a,['Charcoal','Acid-free Paper'],['portrait','charcoal','figurative'],2,4.9),
    mk(s1,'Wildflower Meadow Acrylic','Textured impasto meadow scene in vibrant summer colours, 40×30cm on board.',5500,'Paintings',2,IMG.a,['Acrylic','Impasto Medium','Wood Panel'],['meadow','flowers','impasto'],8,4.8),
    mk(s2,'Moon Phase Ink Drawing','Original ink illustration of the 8 lunar phases on antique parchment paper.',3100,'Paintings',6,IMG.a,['Ink','Parchment Paper'],['moon','ink','illustration'],24,4.9,2700),
    mk(s0,'Abstract Expressionist Mini','Set of six 10×10cm mini canvases – bold gestural marks in black and terracotta.',3800,'Paintings',4,IMG.a,['Acrylic','Mini Canvas'],['abstract','mini','set'],13,4.6),
    mk(s1,'Mandala Dot Art on Wood','Intricate hand-dotted mandala on a 30cm circular wood slice using acrylic inks.',4400,'Paintings',7,IMG.a,['Acrylic Ink','Wood Slice'],['mandala','dot art','wood'],19,4.8),
    mk(s2,'Mountain Landscape Pastel','Soft-pastel mountain panorama on velvet paper, 50×25cm. Evokes early morning mist.',5000,'Paintings',3,IMG.a,['Soft Pastels','Velvet Paper'],['mountain','landscape','pastel'],10,4.7),

    // ── Decor ────────────────────────────────────────────────────────────────
    mk(s2,'Macrame Wall Hanging','Large boho macrame wall hanging in natural cotton rope, 60cm wide.',5200,'Decor',8,IMG.d,['Cotton Rope'],['macrame','wall art','boho'],26,4.8),
    mk(s1,'Hand-Carved Mango Wood Bowl','Decorative mango wood bowl with natural grain. Use as a fruit bowl or centrepiece.',3800,'Decor',10,IMG.d,['Mango Wood','Tung Oil'],['bowl','wood','carved'],33,4.7),
    mk(s0,'Woven Seagrass Basket Set','Nested set of three handwoven seagrass baskets in natural and black trim.',4600,'Decor',6,IMG.d,['Seagrass'],['basket','storage','woven'],19,4.8,3900),
    mk(s2,'Dried Floral Wreath','Circular wreath of dried pampas, eucalyptus and lavender. 40cm diameter.',3200,'Decor',12,IMG.d,['Dried Botanicals','Rattan Wire'],['wreath','dried flowers','floral'],44,4.9),
    mk(s1,'Hammered Brass Wall Disc','Hand-hammered raw brass wall disc, 25cm. Catches light beautifully.',7500,'Decor',5,IMG.d,['Raw Brass'],['wall decor','brass','hammered'],11,4.7),
    mk(s0,'Hand-Painted Ceramic Tile Set','Set of 4 hand-painted Portuguese-style ceramic tiles in cobalt and white.',2900,'Decor',15,IMG.d,['Ceramic','Food-safe Paint'],['tiles','portuguese','ceramic'],37,4.8),
    mk(s2,'Rattan Pendant Light Shade','Hand-woven rattan pendant shade, 35cm diameter. Warm dappled light effect.',6800,'Decor',4,IMG.d,['Natural Rattan'],['light shade','rattan','pendant'],8,4.6),
    mk(s1,'Driftwood Photo Frame','Rustic photo frame made from collected driftwood pieces, holds 4×6" print.',2200,'Decor',18,IMG.d,['Driftwood','Reclaimed Wood'],['frame','driftwood','photo'],55,4.7),
    mk(s0,'Hand-Forged Iron Candle Sconce','Wall-mounted iron sconce for a pillar candle, with leaf motif detail.',4100,'Decor',7,IMG.d,['Wrought Iron'],['candle sconce','wall','iron'],16,4.8),
    mk(s2,'Terracotta Incense Burner Tower','Stacked terracotta tower incense burner with geometric cut-out pattern.',1800,'Decor',22,IMG.d,['Terracotta'],['incense','burner','terracotta'],61,4.6,1500),

    // ── Textiles ─────────────────────────────────────────────────────────────
    mk(s2,'Handwoven Indigo Throw Blanket','Luxuriously soft organic cotton throw dyed with natural indigo on a traditional loom.',8900,'Textiles',8,IMG.t,['Organic Cotton','Natural Indigo Dye'],['blanket','indigo','woven'],22,4.9),
    mk(s2,'Vibrant Geometric Cushion Cover','Handwoven cushion cover with traditional West-African geometric motifs.',3200,'Textiles',15,IMG.t,['Cotton Blend'],['cushion','geometric','woven'],35,4.7),
    mk(s2,'Block-Printed Linen Table Runner','Hand block-printed botanical pattern on natural linen, 180cm long.',2600,'Textiles',11,IMG.t,['Linen','Natural Dye'],['table runner','block print','linen'],48,4.8),
    mk(s2,'Shibori Silk Scarf','Hand-pleated shibori-dyed silk scarf in violet and cream, 180×45cm.',6500,'Textiles',6,IMG.t,['Silk','Indigo Dye'],['scarf','shibori','silk'],15,4.9,5800),
    mk(s2,'Batik Cotton Tote Bag','Hand-waxed and dyed batik cotton tote bag with traditional Javanese pattern.',2800,'Textiles',20,IMG.t,['Cotton','Wax Dye'],['tote','batik','cotton'],57,4.7),
    mk(s2,'Handloom Wool Rug 60×90cm','Flat-woven wool rug in natural grey and rust stripe, traditional handloom.',11500,'Textiles',3,IMG.t,['Wool','Natural Dye'],['rug','wool','handloom'],6,4.8),
    mk(s1,'Embroidered Linen Napkin Set','Set of six linen napkins with hand-embroidered wildflower corner motif.',3900,'Textiles',9,IMG.t,['Linen','Cotton Thread'],['napkins','embroidered','linen'],27,4.9,3400),
    mk(s1,'Kantha Quilt Throw','Vintage cotton kantha throw with running-stitch floral embroidery, 120×150cm.',7200,'Textiles',5,IMG.t,['Recycled Cotton','Cotton Thread'],['kantha','quilt','throw'],13,4.8),
    mk(s0,'Macrame Cotton Hammock','Hand-knotted cotton macrame hammock for one. Holds up to 120kg.',15000,'Textiles',2,IMG.t,['Natural Cotton Rope'],['hammock','macrame','outdoor'],4,5.0),
    mk(s0,'Tie-Dye Meditation Cushion Cover','Hand-tied and dyed spiral cushion cover in calming earth tones.',2100,'Textiles',14,IMG.t,['Cotton','Reactive Dye'],['cushion','tie-dye','meditation'],42,4.6),

    // ── Sculpture ────────────────────────────────────────────────────────────
    mk(s0,'Abstract Terracotta Figure','Hand-coiled terracotta figurative sculpture, 28cm tall. Expressive and raw.',8500,'Sculpture',2,IMG.s,['Terracotta'],['figurine','abstract','terracotta'],4,5.0),
    mk(s1,'Carved Soapstone Animal Totem','Hand-carved soapstone owl totem, 15cm. Smooth tactile finish.',4200,'Sculpture',7,IMG.s,['Soapstone'],['owl','totem','carved'],18,4.8),
    mk(s2,'Driftwood Abstract Wall Piece','Assembled driftwood abstract wall sculpture, 50cm wide. Each piece unique.',9800,'Sculpture',2,IMG.s,['Driftwood'],['wall art','driftwood','abstract'],5,4.9),
    mk(s0,'Papier-Mâché Mask','Hand-formed and painted papier-mâché decorative mask with gold leaf accent.',3600,'Sculpture',9,IMG.s,['Papier-Mâché','Acrylic','Gold Leaf'],['mask','papier mache','decorative'],23,4.7),
    mk(s1,'Bronze-Effect Resin Head','Hand-sculpted head cast in resin with antique bronze finish, 20cm.',6500,'Sculpture',4,IMG.s,['Resin','Bronze Powder'],['head','bronze','sculpture'],9,4.8),
    mk(s2,'Stone-Carved Abstract Form','Smooth hand-carved alabaster abstract form, 18cm. Translucent in light.',12000,'Sculpture',1,IMG.s,['Alabaster'],['alabaster','stone','abstract'],2,5.0),
    mk(s0,'Clay Relief Wall Panel','Hand-built clay wall panel with botanical relief pattern, 30×30cm.',5500,'Sculpture',5,IMG.s,['White Clay','Matte Glaze'],['wall panel','relief','clay'],11,4.7),
    mk(s1,'Wire & Bead Figurine','Delicate wire-formed human figure with glass bead accents, 22cm on stone base.',3100,'Sculpture',12,IMG.s,['Copper Wire','Glass Beads','Stone'],['figurine','wire','beads'],31,4.6),
    mk(s2,'Reclaimed Wood Totem Pole','Stacked carved reclaimed wood segments, 60cm tall. Totemic and grounding.',14500,'Sculpture',2,IMG.s,['Reclaimed Wood'],['totem','wood','carved'],3,4.9),
    mk(s0,'Ceramic Moon Plaque','Round ceramic wall plaque with textured moon surface, 25cm diameter.',2900,'Sculpture',13,IMG.s,['Stoneware','Matte White Glaze'],['moon','plaque','ceramic'],36,4.8,2500),

    // ── Leather ──────────────────────────────────────────────────────────────
    mk(s1,'Hand-Stitched Bifold Wallet','Full-grain vegetable-tanned leather wallet with hand-saddle-stitch.',3800,'Leather',15,IMG.l,['Full-Grain Leather','Waxed Thread'],['wallet','bifold','leather'],48,4.9),
    mk(s1,'Embossed Leather Journal','A5 hand-embossed mandala cover journal with refillable cotton pages.',4500,'Leather',10,IMG.l,['Genuine Leather','Cotton Paper'],['journal','embossed','notebook'],34,4.8,3900),
    mk(s1,'Minimalist Leather Tote','Simple structured tote in pebbled tan leather with brass rivets.',9500,'Leather',5,IMG.l,['Pebbled Leather','Brass Hardware'],['tote','bag','minimalist'],12,4.9),
    mk(s1,'Leather Watch Strap','Handmade 20mm vegetable-tanned watch strap, choice of tan or dark brown.',2200,'Leather',20,IMG.l,['Vegetable-Tanned Leather'],['watch strap','leather','handmade'],71,4.7,1900),
    mk(s1,'Woven Leather Belt','Hand-woven strip leather belt with solid brass buckle, 3cm wide.',4200,'Leather',8,IMG.l,['Full-Grain Leather','Brass'],['belt','woven','leather'],25,4.8),
    mk(s2,'Leather-Bound Sketchbook','Rustic A4 leather-wrapped sketchbook with deckle-edge paper, 200 pages.',5800,'Leather',6,IMG.l,['Rustic Leather','Acid-free Paper'],['sketchbook','art','leather'],17,4.7),
    mk(s0,'Keychain Tassel Fob','Hand-cut and punched leather keychain tassel with brass D-ring.',950,'Leather',30,IMG.l,['Full-Grain Leather','Brass'],['keychain','tassel','leather'],93,4.6,750),
    mk(s1,'Leather Desk Pad','Large 60×40cm full-grain leather desk pad with stitched edges.',7500,'Leather',4,IMG.l,['Full-Grain Leather'],['desk pad','office','leather'],8,4.9),
    mk(s2,'Passport Holder Wallet','Slim vegetable-tanned passport holder with card slots and boarding-pass sleeve.',2800,'Leather',18,IMG.l,['Vegetable-Tanned Leather'],['passport','travel','leather'],43,4.7,2400),
    mk(s1,'Hand-Tooled Leather Coasters','Set of 4 round leather coasters with hand-tooled floral border.',3200,'Leather',12,IMG.l,['Full-Grain Leather'],['coasters','set','tooled'],29,4.8),

    // ── Woodwork ─────────────────────────────────────────────────────────────
    mk(s1,'Walnut Desk Organizer','Sustainably sourced walnut desk organizer with three compartments. Engravable.',5400,'Woodwork',3,IMG.w,['Walnut Wood','Beeswax Finish'],['desk','organizer','walnut'],8,4.8),
    mk(s1,'Hand-Turned Cherry Wood Bowl','Elegant lathe-turned cherry wood salad bowl, 28cm diameter.',6800,'Woodwork',4,IMG.w,['Cherry Wood','Food-safe Oil'],['bowl','turned','cherry'],14,4.9),
    mk(s1,'Oak Serving Paddle Board','End-grain oak charcuterie and serving board with rope handle.',4500,'Woodwork',8,IMG.w,['Oak','Food-safe Wax'],['serving board','charcuterie','oak'],33,4.8,3900),
    mk(s1,'Hand-Carved Wooden Spoon Set','Set of three hand-carved olive wood cooking spoons, various sizes.',2800,'Woodwork',12,IMG.w,['Olive Wood'],['spoons','kitchen','carved'],51,4.7),
    mk(s1,'Reclaimed Teak Candle Tray','Reclaimed teak slab candle tray with three carved hollows, 40cm.',3900,'Woodwork',9,IMG.w,['Reclaimed Teak'],['tray','candle','teak'],27,4.8),
    mk(s1,'Wooden Geometric Wall Clock','Laser-etched walnut wood wall clock with silent quartz movement, 30cm.',7200,'Woodwork',5,IMG.w,['Walnut Wood'],['clock','wall','geometric'],11,4.7),
    mk(s1,'Pine Wood Photo Ledge Shelf','Hand-sanded pine photo ledge shelf, 60cm, holds frames and small plants.',3100,'Woodwork',14,IMG.w,['Pine Wood','Natural Wax'],['shelf','photo ledge','pine'],39,4.6),
    mk(s2,'Hand-Painted Wooden Keepsake Box','Hand-painted floral wooden trinket box with velvet lining, 20×15cm.',4600,'Woodwork',7,IMG.w,['Basswood','Acrylic Paint','Velvet'],['box','keepsake','painted'],18,4.8),
    mk(s1,'Driftwood Mirror Frame','Round 50cm mirror in hand-assembled natural driftwood frame.',8900,'Woodwork',3,IMG.w,['Driftwood','Mirror Glass'],['mirror','driftwood','frame'],7,4.9),
    mk(s1,'Oak Floating Wall Shelf Set','Set of two minimalist floating oak shelves, 40cm with hidden brackets.',5500,'Woodwork',6,IMG.w,['Oak Wood','Steel Brackets'],['shelf','floating','oak'],22,4.7,4800),

    // ── Candles ──────────────────────────────────────────────────────────────
    mk(s0,'Beeswax Pillar Candle Set','Set of three hand-dipped natural beeswax pillar candles in varying heights.',3500,'Candles',12,IMG.c,['Natural Beeswax','Cotton Wick'],['pillar','beeswax','natural'],44,4.9),
    mk(s2,'Soy Wax Botanical Jar Candle','Hand-poured soy wax candle with embedded dried roses and lavender. 40hr burn.',2800,'Candles',18,IMG.c,['Soy Wax','Dried Botanicals','Cotton Wick'],['jar candle','botanical','soy'],63,4.8,2400),
    mk(s0,'Sculptural Mushroom Candle','Poured soy wax mushroom-shaped candle in terracotta and sage. Collectable.',1900,'Candles',20,IMG.c,['Soy Wax','Fragrance Oil'],['mushroom','sculptural','soy'],87,4.7),
    mk(s0,'Twisted Taper Candle Pair','Pair of hand-twisted 30cm beeswax taper candles in natural ivory.',1600,'Candles',25,IMG.c,['Beeswax','Cotton Wick'],['taper','twisted','pair'],95,4.8,1300),
    mk(s2,'Concrete Vessel Soy Candle','Industrial-chic concrete vessel with soy wax and bergamot-cedar scent.',3200,'Candles',10,IMG.c,['Soy Wax','Concrete','Bergamot'],['concrete','vessel','bergamot'],31,4.7),
    mk(s0,'Beeswax Honeycomb Sheet Candle','Roll-your-own beeswax honeycomb kit, includes 6 sheets and wicks.',2200,'Candles',15,IMG.c,['Beeswax Sheets','Cotton Wick'],['honeycomb','kit','beeswax'],48,4.9),
    mk(s2,'Crystal-Embedded Spell Candle','Hand-poured soy candle with amethyst crystal chip garnish and lavender scent.',2500,'Candles',16,IMG.c,['Soy Wax','Amethyst','Lavender Oil'],['crystal','spell','amethyst'],52,4.8),
    mk(s0,'Dip-Dye Gradient Taper Set','Set of four hand dip-dyed gradient taper candles in blush to burgundy.',2400,'Candles',13,IMG.c,['Paraffin Wax','Dye'],['taper','gradient','dip-dye'],39,4.6),
    mk(s2,'Cinnamon Spice Wax Melt Set','Pack of 8 hand-formed cinnamon and clove scented soy wax melts.',1200,'Candles',30,IMG.c,['Soy Wax','Cinnamon Oil'],['wax melt','cinnamon','scented'],71,4.7,950),
    mk(s0,'Black Moon Phase Pillar','Dramatic black beeswax pillar with moon phase relief embossed sides, 20cm.',4200,'Candles',8,IMG.c,['Beeswax','Candle Dye'],['moon','pillar','black'],21,4.9,3700),
  ];
};

module.exports = { getProducts };

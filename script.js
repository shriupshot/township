/* =========================================================================
   Township Ledger — Application logic
   Sections: Data model · State/storage · Utils · Rendering · Interactions
   ========================================================================= */
'use strict';

/* ---------------- Data model ---------------- */
// id: { name, emoji, building, time(min), ingredients:[{id, qty}] }
// items with empty ingredients are treated as base/raw goods (crops, farm animal products)
const DB = {
  // FIELD CROPS
  wheat:      {name:"Wheat", emoji:"🌾", building:"Field", time:2, ingredients:[]},
  corn:       {name:"Corn", emoji:"🌽", building:"Field", time:5, ingredients:[]},
  carrot:     {name:"Carrot", emoji:"🥕", building:"Field", time:10, ingredients:[]},
  sugarcane:  {name:"Sugarcane", emoji:"🎋", building:"Field", time:20, ingredients:[]},
  cotton:     {name:"Cotton", emoji:"☁️", building:"Field", time:30, ingredients:[]},
  strawberry: {name:"Strawberry", emoji:"🍓", building:"Field", time:60, ingredients:[]},
  tomato:     {name:"Tomato", emoji:"🍅", building:"Field", time:120, ingredients:[]},
  pine_tree:  {name:"Pine Tree", emoji:"🌳", building:"Field", time:90, ingredients:[]},
  potato:     {name:"Potato", emoji:"🥔", building:"Field", time:240, ingredients:[]},
  cacao:      {name:"Cacao", emoji:"🍠", building:"Field", time:480, ingredients:[]},
  rubber_tree:{name:"Rubber Tree", emoji:"🌳", building:"Field", time:90, ingredients:[]},
  pepper:     {name:"Pepper", emoji:"🌶️", building:"Field", time:300, ingredients:[]},
  silk:       {name:"Silk", emoji:"🕸", building:"Field", time:900, ingredients:[]},
  rice:       {name:"Rice", emoji:"🌱", building:"Field", time:30, ingredients:[]},
  mint:       {name:"Mint", emoji:"☘️", building:"Field", time:150, ingredients:[]},
  cork_oak:   {name:"Cork oak", emoji:"🧱", building:"Field", time:600, ingredients:[]},

  // FARM ANIMALS
  milk:        {name:"Milk", emoji:"🥛", building:"Farm Animals", time:20, ingredients:[{id:"cow_feed", qty:1}]},
  egg:         {name:"Egg", emoji:"🥚", building:"Farm Animals", time:60, ingredients:[{id:"chicken_feed", qty:1}]},
  wool:        {name:"Wool", emoji:"☁️", building:"Farm Animals", time:240, ingredients:[{id:"sheep_feed", qty:1}]},
  apiary:      {name:"Apiary", emoji:"🍯", building:"Farm Animals", time:600, ingredients:[{id:"bee_feed", qty:1}]},
  bacon:       {name:"Bacon", emoji:"🥓", building:"Farm Animals", time:420, ingredients:[{id:"pig_feed", qty:1}]},
  down_feather:{name:"Down Feather", emoji:"🍂", building:"Farm Animals", time:90, ingredients:[]},
  feather:     {name:"Colorful Feather", emoji:"🍂", building:"Farm Animals", time:90, ingredients:[]},
  seaweed:     {name:"Seaweed", emoji:"🌿", building:"Farm Animals", time:270, ingredients:[]},
  scallop:     {name:"Scallop", emoji:"🐚", building:"Farm Animals", time:270, ingredients:[]},
  pearls:      {name:"Pearls", emoji:"🦪", building:"Farm Animals", time:240, ingredients:[]},
  mushroom:    {name:"Mushroom", emoji:"🍄", building:"Farm Animals", time:300, ingredients:[]},

  // FEED MILL
  cow_feed:     {name:"Cow Feed", emoji:"🐄", building:"Feed Mill", time:5, ingredients:[{id:"wheat", qty:2},{id:"corn", qty:1}]},
  chicken_feed: {name:"Chicken Feed", emoji:"🐔", building:"Feed Mill", time:10, ingredients:[{id:"wheat", qty:2},{id:"carrot", qty:1}]},
  sheep_feed:   {name:"Sheep Feed", emoji:"🐑", building:"Feed Mill", time:20, ingredients:[{id:"corn", qty:2},{id:"carrot", qty:2}]},
  bee_feed:     {name:"Bee Feed", emoji:"🐝", building:"Feed Mill", time:30, ingredients:[{id:"wheat", qty:3},{id:"sugarcane", qty:1}]},
  pig_feed:     {name:"Pig Feed", emoji:"🐖", building:"Feed Mill", time:40, ingredients:[{id:"wheat", qty:2},{id:"carrot", qty:2},{id:"corn", qty:1}]},

  // BAKERY
  bread:        {name:"Bread", emoji:"🍞", building:"Bakery", time:15, ingredients:[{id:"wheat", qty:2}]},
  cookie:       {name:"Cookie", emoji:"🍪", building:"Bakery", time:40, ingredients:[{id:"wheat", qty:2},{id:"egg", qty:2}]},
  bagel:        {name:"Bagel", emoji:"🥯", building:"Bakery", time:20, ingredients:[{id:"wheat", qty:2},{id:"sugar", qty:1},{id:"egg", qty:3}]},
  pizza:        {name:"Pizza", emoji:"🍕", building:"Bakery", time:60, ingredients:[{id:"wheat", qty:2},{id:"cheese", qty:1},{id:"tomato", qty:2}]},
  potato_bread: {name:"Potato Bread", emoji:"🍞", building:"Bakery", time:60, ingredients:[{id:"wheat", qty:2},{id:"potato", qty:2},{id:"egg", qty:4}]},
  banana_bread: {name:"Banana Bread", emoji:"🍞", building:"Bakery", time:60, ingredients:[{id:"wheat", qty:1},{id:"banana", qty:3},{id:"egg", qty:2},{id:"butter", qty:1}]},
  seafood_pizza:{name:"Seafood Pizza", emoji:"🍕", building:"Bakery", time:60, ingredients:[{id:"wheat", qty:2},{id:"cheese", qty:1},{id:"fish", qty:1},{id:"shrimp", qty:1}]},

  // DAIRY FACTORY
  cream:  {name:"Cream", emoji:"🍦", building:"Dairy Factory", time:10, ingredients:[{id:"milk", qty:1}]},
  cheese: {name:"Cheese", emoji:"🧀", building:"Dairy Factory", time:40, ingredients:[{id:"milk", qty:2}]},
  butter: {name:"Butter", emoji:"🧈", building:"Dairy Factory", time:20, ingredients:[{id:"milk", qty:3}]},
  yogurt: {name:"Yogurt", emoji:"🥣", building:"Dairy Factory", time:30, ingredients:[{id:"milk", qty:4}]},
  peach_yogurt: {name:"Peach Yogurt", emoji:"🥣", building:"Dairy Factory", time:30, ingredients:[{id:"milk", qty:2},{id:"peach", qty:2}]},

  // SUGAR FACTORY
  sugar: {name:"Sugar", emoji:"🧊", building:"Sugar Factory", time:20, ingredients:[{id:"sugarcane", qty:1}]},
  syrup: {name:"Syrup", emoji:"🧂", building:"Sugar Factory", time:20, ingredients:[{id:"sugarcane", qty:2}]},
  caramel: {name:"Caramel", emoji:"🥃", building:"Sugar Factory", time:20, ingredients:[{id:"sugarcane", qty:3}]},
  honey_caramel: {name:"Honey Caramel", emoji:"🧉", building:"Sugar Factory", time:20, ingredients:[{id:"sugarcane", qty:1},{id:"apiary", qty:1}]},

  // TEXTILE FACTORY
  cotton_fabric: {name:"Cotton Fabric", emoji:"🧣", building:"Textile Factory", time:30, ingredients:[{id:"cotton", qty:2}]},
  yarn:   {name:"Yarn", emoji:"🧶", building:"Textile Factory", time:40, ingredients:[{id:"wool", qty:2}]},
  fabric: {name:"Silk Fabric", emoji:"🧦", building:"Textile Factory", time:30, ingredients:[{id:"silk", qty:2}]},
  nylon:  {name:"Nylon Thread", emoji:"🧵", building:"Textile Factory", time:50, ingredients:[{id:"rubber_tree", qty:3}]},

  // TAILOR SHOP
  shirt:   {name:"Shirt", emoji:"👕", building:"Tailor Shop", time:60, ingredients:[{id:"cotton_fabric", qty:1}]},
  sweater: {name:"Sweater", emoji:"🥼", building:"Tailor Shop", time:60, ingredients:[{id:"yarn", qty:1}]},
  coat:    {name:"Coat", emoji:"👚", building:"Tailor Shop", time:60, ingredients:[{id:"yarn", qty:1},{id:"cotton_fabric", qty:1}]},
  dress:   {name:"Dress", emoji:"👗", building:"Tailor Shop", time:90, ingredients:[{id:"cotton_fabric", qty:3},{id:"fabric", qty:2}]},
  suit:    {name:"Suit", emoji:"🧥", building:"Tailor Shop", time:45, ingredients:[{id:"cotton_fabric", qty:1},{id:"yarn", qty:1},{id:"fabric", qty:1}]},
  hat:     {name:"Tyrolean Hat", emoji:"🧢", building:"Tailor Shop", time:90, ingredients:[{id:"cotton_fabric", qty:1},{id:"fabric", qty:1},{id:"feather", qty:1}]},

  // SNACK FACTORY
  popcorn:      {name:"Popcorn", emoji:"🍿", building:"Snack Factory", time:20, ingredients:[{id:"corn", qty:2}]},
  chips:        {name:"Corn Chips", emoji:"🥐", building:"Snack Factory", time:30, ingredients:[{id:"corn", qty:3}]},
  granola:      {name:"Granola", emoji:"🥣", building:"Snack Factory", time:40, ingredients:[{id:"wheat", qty:2},{id:"strawberry", qty:2}]},
  potato_chips: {name:"Potato Chips", emoji:"🥔", building:"Snack Factory", time:2, ingredients:[{id:"potato", qty:2}]},
  canape:       {name:"Canapé", emoji:"🥪", building:"Snack Factory", time:15, ingredients:[{id:"olives", qty:2},{id:"grapes", qty:2},{id:"cheese", qty:1}]},
  glazed_bacon: {name:"Glazed Bacon", emoji:"🥓", building:"Snack Factory", time:30, ingredients:[{id:"bacon", qty:2},{id:"syrup", qty:1}]},

  // FAST FOOD RESTAURANT
  milkshake:    {name:"Milkshake", emoji:"🥤", building:"Fast Food Restaurant", time:15, ingredients:[{id:"milk", qty:2},{id:"strawberry", qty:1}]},
  cheeseburger: {name:"Cheeseburger", emoji:"🍔", building:"Fast Food Restaurant", time:30, ingredients:[{id:"bread", qty:2},{id:"cheese", qty:1},{id:"tomato", qty:1}]},
  sandwich:     {name:"Sandwich", emoji:"🥪", building:"Fast Food Restaurant", time:40, ingredients:[{id:"bread", qty:1},{id:"butter", qty:1},{id:"strawberry", qty:2}]},
  french_fries: {name:"French Fries", emoji:"🍟", building:"Fast Food Restaurant", time:60, ingredients:[{id:"potato", qty:2},{id:"cream", qty:1},{id:"tomato", qty:2}]},
  baked_potato: {name:"Baked Potato", emoji:"🥔", building:"Fast Food Restaurant", time:50, ingredients:[{id:"potato", qty:2},{id:"bacon", qty:1},{id:"cheese", qty:1}]},
  fish_burger:  {name:"Fish Burger", emoji:"🍔", building:"Fast Food Restaurant", time:45, ingredients:[{id:"bread", qty:2},{id:"fish", qty:2},{id:"pepper", qty:1}]},

  // PAPER FACTORY
  paper:     {name:"Paper", emoji:"📄", building:"Paper Factory", time:30, ingredients:[{id:"pine_tree", qty:1}]},
  towel:     {name:"Towel", emoji:"📦", building:"Paper Factory", time:40, ingredients:[{id:"pine_tree", qty:2}]},
  wallpaper: {name:"Wall Paper", emoji:"🖼️", building:"Paper Factory", time:60, ingredients:[{id:"pine_tree", qty:2},{id:"rubber", qty:1}]},
  book:      {name:"Book", emoji:"📚", building:"Paper Factory", time:45, ingredients:[{id:"paper", qty:4},{id:"cotton_fabric", qty:1},{id:"glue", qty:1}]},

  // ICE CREAM SHOP
  ice_cream_cone: {name:"Ice Cream Cone", emoji:"🍦", building:"Ice Cream Shop", time:30, ingredients:[{id:"milk", qty:1},{id:"cream", qty:1},{id:"sugar", qty:1}]},
  popsicle:       {name:"Popsicle", emoji:"🧊", building:"Ice Cream Shop", time:90, ingredients:[{id:"strawberry", qty:2},{id:"sugar", qty:1}]},
  frozen_yogurt:  {name:"Frozen Yogurt", emoji:"🍨", building:"Ice Cream Shop", time:180, ingredients:[{id:"yogurt", qty:1},{id:"cream", qty:1}]},
  ice_cream_bar:  {name:"Ice Cream Bar", emoji:"🍫", building:"Ice Cream Shop", time:240, ingredients:[{id:"syrup", qty:1},{id:"cacao", qty:1},{id:"pine_tree", qty:1}]},
  mint_chocolate_ice_cream: {name:"Mint Chocolate Ice Cream", emoji:"🍨", building:"Ice Cream Shop", time:60, ingredients:[{id:"milk", qty:1},{id:"mint", qty:2},{id:"chocolate", qty:1}]},
  pineapple_sorbet: {name:"Pineapple Sorbet", emoji:"🍍", building:"Ice Cream Shop", time:150, ingredients:[{id:"syrup", qty:1},{id:"pineapple", qty:2}]},

  // PASTRY FACTORY
  muffin:  {name:"Muffin", emoji:"🧁", building:"Pastry Factory", time:30, ingredients:[{id:"wheat", qty:3},{id:"sugar", qty:1},{id:"egg", qty:4}]},
  brownie: {name:"Brownie", emoji:"🍫", building:"Pastry Factory", time:40, ingredients:[{id:"cacao", qty:2},{id:"syrup", qty:1},{id:"butter", qty:1}]},
  cupcake: {name:"Cupcake", emoji:"🧁", building:"Pastry Factory", time:60, ingredients:[{id:"sugar", qty:1},{id:"egg", qty:5},{id:"cream", qty:1}]},
  donut:   {name:"Donut", emoji:"🍩", building:"Pastry Factory", time:90, ingredients:[{id:"bagel", qty:1},{id:"caramel", qty:1},{id:"cacao", qty:1}]},
  cheesecake: {name:"Cheesecake", emoji:"🍰", building:"Pastry Factory", time:180, ingredients:[{id:"cookie", qty:1},{id:"cheese", qty:1},{id:"syrup", qty:1},{id:"strawberry", qty:2}]},
  honey_gingerbread: {name:"Honey Gingerbread", emoji:"🍯", building:"Pastry Factory", time:60, ingredients:[{id:"wheat", qty:3},{id:"apiary", qty:2},{id:"egg", qty:1}]},
  key_lime_pie: {name:"Key Lime Pie", emoji:"🥧", building:"Pastry Factory", time:120, ingredients:[{id:"wheat", qty:3},{id:"lime", qty:2},{id:"sugar", qty:1},{id:"cream", qty:1}]},
  coconut_macaroon: {name:"Coconut Macaroon", emoji:"🥥", building:"Pastry Factory", time:90, ingredients:[{id:"coconut", qty:2},{id:"egg", qty:2},{id:"sugar", qty:1}]},

  // JAM FACTORY
  strawberry_jam: {name:"Strawberry Jam", emoji:"🍓", building:"Jam Factory", time:90, ingredients:[{id:"strawberry", qty:3}]},
  peach_marmalade: {name:"Peach Jam", emoji:"🍑", building:"Jam Factory", time:150, ingredients:[{id:"peach", qty:3}]},
  watermelon_jam: {name:"Watermelon Jam", emoji:"🍉", building:"Jam Factory", time:180, ingredients:[{id:"watermelon", qty:3}]},
  plum_jam: {name:"Plum Jam", emoji:"🟣", building:"Jam Factory", time:240, ingredients:[{id:"plum", qty:3}]},
  grape_jelly: {name:"Grape Jam", emoji:"🍇", building:"Jam Factory", time:210, ingredients:[{id:"grapes", qty:3}]},

  // RUBBER FACTORY
  rubber:   {name:"Rubber", emoji:"⚫", building:"Rubber Factory", time:60, ingredients:[{id:"rubber_tree", qty:1}]},
  plastic:  {name:"Plastic", emoji:"🧴", building:"Rubber Factory", time:90, ingredients:[{id:"rubber_tree", qty:2}]},
  glue:     {name:"Glue", emoji:"🧪", building:"Rubber Factory", time:120, ingredients:[{id:"rubber_tree", qty:3}]},
  dumbbell: {name:"Dumbbell", emoji:"🏋️", building:"Rubber Factory", time:180, ingredients:[{id:"rubber", qty:2},{id:"bronze_ore", qty:2}]},

  // FOOD PROCESSING FACTORY
  dough:             {name:"Dough", emoji:"🥣", building:"Food Processing Factory", time:30, ingredients:[{id:"wheat", qty:4}]},
  frozen_vegetables: {name:"Frozen Vegetables", emoji:"🥕", building:"Food Processing Factory", time:90, ingredients:[{id:"tomato", qty:1},{id:"corn", qty:1},{id:"carrot", qty:1}]},
  dumplings:         {name:"Dumplings", emoji:"🥟", building:"Food Processing Factory", time:210, ingredients:[{id:"dough", qty:2},{id:"bacon", qty:2}]},
  seafood_mix:       {name:"Seafood Mix", emoji:"🦐", building:"Food Processing Factory", time:150, ingredients:[{id:"shrimp", qty:1},{id:"scallop", qty:1},{id:"fish", qty:1}]},

  // PLASTICS FACTORY
  plastic_bottle:  {name:"Plastic Bottle", emoji:"🍼", building:"Plastics Factory", time:90, ingredients:[{id:"plastic", qty:1}]},
  toys:            {name:"Toys", emoji:"🧸", building:"Plastics Factory", time:45, ingredients:[{id:"plastic", qty:1},{id:"rubber", qty:1}]},
  ball:            {name:"Ball", emoji:"⚽", building:"Plastics Factory", time:120, ingredients:[{id:"plastic", qty:1},{id:"glue", qty:1}]},
  inflatable_boat: {name:"Inflatable Boat", emoji:"🛥️", building:"Plastics Factory", time:150, ingredients:[{id:"rubber", qty:2},{id:"glue", qty:1}]},
  shuttlecock:     {name:"Shuttlecock", emoji:"🏸", building:"Plastics Factory", time:40, ingredients:[{id:"down_feather", qty:2},{id:"plastic", qty:1}]},
  modeling_clay:   {name:"Modeling Clay", emoji:"🟤", building:"Plastics Factory", time:60, ingredients:[{id:"clay", qty:2},{id:"rubber_tree", qty:2}]},

  // HOUSEHOLD GOODS FACTORY
  scrub_brush:    {name:"Scrub Brush", emoji:"🧽", building:"Household Goods Factory", time:120, ingredients:[{id:"sugarcane", qty:3},{id:"nylon", qty:1}]},
  soap_dispenser: {name:"Soap Dispenser", emoji:"🧴", building:"Household Goods Factory", time:140, ingredients:[{id:"cork_oak", qty:1},{id:"plastic_bottle", qty:1}]},
  clothesline:    {name:"Clothesline", emoji:"🎀", building:"Household Goods Factory", time:170, ingredients:[{id:"sugarcane", qty:5},{id:"nylon", qty:1}]},
  plunger:        {name:"Plunger", emoji:"🧹", building:"Household Goods Factory", time:190, ingredients:[{id:"pine_tree", qty:1},{id:"rubber", qty:1}]},
  feather_duster: {name:"Feather Duster", emoji:"🎉", building:"Household Goods Factory", time:210, ingredients:[{id:"sugarcane", qty:1},{id:"feather", qty:3}]},

  // CANDY FACTORY
  jelly_beans:  {name:"Jelly Beans", emoji:"🧆", building:"Candy Factory", time:120, ingredients:[{id:"strawberry", qty:3},{id:"syrup", qty:1}]},
  toffee:       {name:"Toffee", emoji:"🍬", building:"Candy Factory", time:180, ingredients:[{id:"caramel", qty:1},{id:"butter", qty:1}]},
  candy_cane:   {name:"Candy Cane", emoji:"🍭", building:"Candy Factory", time:240, ingredients:[{id:"caramel", qty:1},{id:"cream", qty:1},{id:"paper", qty:1}]},
  chocolate:    {name:"Chocolate", emoji:"🍫", building:"Candy Factory", time:150, ingredients:[{id:"cacao", qty:3},{id:"cream", qty:1},{id:"sugar", qty:1}]},
  lollipop:     {name:"Lollipop", emoji:"🍭", building:"Candy Factory", time:300, ingredients:[{id:"strawberry", qty:2},{id:"syrup", qty:1},{id:"pine_tree", qty:2}]},
  honey_marshmallow: {name:"Honey Marshmallow", emoji:"🍡", building:"Candy Factory", time:270, ingredients:[{id:"honey_caramel", qty:1},{id:"egg", qty:2}]},
  mint_candy:   {name:"Mint Candy", emoji:"🍬", building:"Candy Factory", time:120, ingredients:[{id:"mint", qty:2},{id:"syrup", qty:1}]},

  // MEXICAN FACTORY
  chili_sauce: {name:"Chili Sauce", emoji:"🌶️", building:"Mexican Factory", time:120, ingredients:[{id:"tomato", qty:3},{id:"pepper", qty:3},{id:"sugar", qty:1}]},
  burrito:     {name:"Burrito", emoji:"🌯", building:"Mexican Factory", time:60, ingredients:[{id:"wheat", qty:2},{id:"bacon", qty:2},{id:"tomato", qty:1}]},
  nachos:      {name:"Nachos", emoji:"🧀", building:"Mexican Factory", time:180, ingredients:[{id:"chips", qty:1},{id:"cheese", qty:1},{id:"pepper", qty:2}]},
  taco:        {name:"Taco", emoji:"🌮", building:"Mexican Factory", time:90, ingredients:[{id:"corn", qty:3},{id:"cream", qty:1},{id:"tomato", qty:2},{id:"pepper", qty:2}]},
  bacon_wrap:  {name:"Bacon-Wrapped", emoji:"🥓", building:"Mexican Factory", time:120, ingredients:[{id:"pepper", qty:2},{id:"bacon", qty:1},{id:"cheese", qty:1}]},

  // STATIONERY FACTORY
  eraser:          {name:"Eraser", emoji:"🧼", building:"Stationery Factory", time:120, ingredients:[{id:"rubber_tree", qty:3}]},
  sticky_notes:    {name:"Sticky Notes", emoji:"🗒️", building:"Stationery Factory", time:150, ingredients:[{id:"paper", qty:3},{id:"glue", qty:1}]},
  bulletin_board:  {name:"Bulletin Board", emoji:"📋", building:"Stationery Factory", time:170, ingredients:[{id:"cork_oak", qty:3},{id:"paper", qty:1}]},
  highlighter_pen: {name:"Highlighter Pen", emoji:"🖍️", building:"Stationery Factory", time:190, ingredients:[{id:"nylon", qty:1},{id:"cotton", qty:3},{id:"plastic", qty:1}]},

  // FURNITURE FACTORY
  table: {name:"Table", emoji:"🗳", building:"Furniture Factory", time:240, ingredients:[{id:"pine_tree", qty:3}]},
  chair: {name:"Chair", emoji:"🪑", building:"Furniture Factory", time:180, ingredients:[{id:"plastic", qty:1}]},
  couch: {name:"Couch", emoji:"🛋️", building:"Furniture Factory", time:360, ingredients:[{id:"pine_tree", qty:2},{id:"cotton_fabric", qty:1}]},
  bed:   {name:"Bed", emoji:"🛏️", building:"Furniture Factory", time:270, ingredients:[{id:"fabric", qty:1},{id:"cotton_fabric", qty:1},{id:"pine_tree", qty:2}]},

  // SHOE FACTORY
  flip_flops: {name:"Flip Flops", emoji:"👞", building:"Shoe Factory", time:90, ingredients:[{id:"rubber", qty:1}]},
  sandals:    {name:"Sandals", emoji:"👡", building:"Shoe Factory", time:120, ingredients:[{id:"cork_oak", qty:3},{id:"nylon", qty:1}]},
  sneakers:   {name:"Sneakers", emoji:"👟", building:"Shoe Factory", time:120, ingredients:[{id:"rubber", qty:1},{id:"cotton_fabric", qty:1},{id:"glue", qty:1}]},
  boots:      {name:"Boots", emoji:"🥾", building:"Shoe Factory", time:180, ingredients:[{id:"rubber", qty:1},{id:"fabric", qty:1},{id:"glue", qty:1}]},

  // ASIAN FACTORY
  sushi_roll:    {name:"Sushi Roll", emoji:"🍣", building:"Asian Factory", time:45, ingredients:[{id:"rice", qty:5},{id:"fish", qty:1}]},
  lobster_sushi: {name:"Lobster Sushi", emoji:"🦞", building:"Asian Factory", time:75, ingredients:[{id:"lobster", qty:1},{id:"rice", qty:4}]},

  // ISLAND
  peach:      {name:"Peach", emoji:"🍑", building:"Island", time:360, ingredients:[]},
  watermelon: {name:"Watermelon", emoji:"🍉", building:"Island", time:360, ingredients:[]},
  plum:       {name:"Plum", emoji:"🟣", building:"Island", time:360, ingredients:[]},
  grapes:     {name:"Grapes", emoji:"🍇", building:"Island", time:360, ingredients:[]},
  olives:     {name:"Olives", emoji:"🫒", building:"Island", time:360, ingredients:[]},
  lime:       {name:"Lime", emoji:"🍋", building:"Island", time:360, ingredients:[]},
  banana:     {name:"Banana", emoji:"🍌", building:"Island", time:360, ingredients:[]},
  coconut:    {name:"Coconut", emoji:"🥥", building:"Island", time:360, ingredients:[]},
  pineapple:  {name:"Pineapple", emoji:"🍍", building:"Island", time:360, ingredients:[]},
  fish:       {name:"Fish", emoji:"🐟", building:"Island", time:360, ingredients:[]},
  shrimp:     {name:"Shrimp", emoji:"🦐", building:"Island", time:360, ingredients:[]},
  lobster:    {name:"Lobster", emoji:"🦞", building:"Island", time:360, ingredients:[]},

  // MINE
  bronze_ore:   {name:"Bronze Ore", emoji:"🟤", building:"Mine", time:0, ingredients:[]},
  silver_ore:   {name:"Silver Ore", emoji:"⚪", building:"Mine", time:0, ingredients:[]},
  gold_ore:     {name:"Gold Ore", emoji:"🟡", building:"Mine", time:0, ingredients:[]},
  platinum_ore: {name:"Platinum Ore", emoji:"🔷", building:"Mine", time:0, ingredients:[]},
  clay:         {name:"Clay", emoji:"🧱", building:"Mine", time:0, ingredients:[]},

  // FOUNDRY
  bronze_ingot:   {name:"Bronze Ingot", emoji:"🥉", building:"Foundry", time:90, ingredients:[{id:"bronze_ore", qty:5}]},
  silver_ingot:   {name:"Silver Ingot", emoji:"🥈", building:"Foundry", time:120, ingredients:[{id:"silver_ore", qty:5}]},
  gold_ingot:     {name:"Gold Ingot", emoji:"🥇", building:"Foundry", time:180, ingredients:[{id:"gold_ore", qty:5}]},
  platinum_ingot: {name:"Platinum Ingot", emoji:"💎", building:"Foundry", time:240, ingredients:[{id:"platinum_ore", qty:5}]},

};

/* ---------------- State ---------------- */
let order = {};        // id -> count of DIRECTLY ordered finished goods
let theme = 'dark';
const isDesktopLayout = () => window.matchMedia('(min-width:1181px)').matches;
// On desktop this is a genuine "collapsed" (hidden) sidebar. On tablet/phone
// the same flag drives the slide-over overlay's open/closed state — but it
// should default to CLOSED there regardless of the desktop preference, since
// they're two different UI patterns sharing one CSS hook.
let sidebarCollapsed = !isDesktopLayout();

/* ---------------- Storage ---------------- */
function saveData(){
  try{
    localStorage.setItem('tl_order', JSON.stringify(order));
    localStorage.setItem('tl_db', JSON.stringify(DB));
  }catch(e){ /* storage unavailable — app still works in-memory */ }
}
function saveTheme(){ try{ localStorage.setItem('tl_theme', theme); }catch(e){} }
function saveSidebar(){
  if(!isDesktopLayout()) return; // mobile overlay open/closed state isn't a "preference" worth persisting
  try{ localStorage.setItem('tl_sidebar', sidebarCollapsed ? '1' : '0'); }catch(e){}
}

function loadData(){
  try{
    const savedOrder = localStorage.getItem('tl_order');
    if(savedOrder) order = JSON.parse(savedOrder);
    const savedDB = localStorage.getItem('tl_db');
    if(savedDB) Object.assign(DB, JSON.parse(savedDB));
    const savedTheme = localStorage.getItem('tl_theme');
    if(savedTheme) theme = savedTheme;
    else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) theme = 'light';
    if(isDesktopLayout()){
      const savedSidebar = localStorage.getItem('tl_sidebar');
      if(savedSidebar) sidebarCollapsed = savedSidebar === '1';
    }
  }catch(e){ /* ignore corrupt storage */ }
}

/* ---------------- Utils ---------------- */
function slugify(s){
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'') || ('item_'+Date.now());
}
function formatTime(mins){
  mins = Math.round(mins);
  if(mins < 60) return mins + "m";
  const h = Math.floor(mins/60), m = mins%60;
  return h + "h" + (m ? " " + m + "m" : "");
}
function isBase(id){ return !DB[id] || !DB[id].ingredients || DB[id].ingredients.length === 0; }
function buildingsList(){
  const set = [];
  Object.values(DB).forEach(it => { if(!set.includes(it.building)) set.push(it.building); });
  return set;
}
function debounce(fn, wait){
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), wait); };
}
const buildingColorCache = {};
function buildingColor(name){
  if(buildingColorCache[name]) return buildingColorCache[name];
  let hash = 0;
  for(let i=0;i<name.length;i++){ hash = (hash*31 + name.charCodeAt(i)) >>> 0; }
  const hue = hash % 360;
  const color = `hsl(${hue} 70% 62%)`;
  buildingColorCache[name] = color;
  return color;
}
function animateCount(el, to){
  if(!el) return;
  const from = parseInt(el.textContent.replace(/[^\d-]/g,''),10) || 0;
  if(from === to){ el.textContent = to; return; }
  const dur = 420, start = performance.now();
  function tick(now){
    const p = Math.min(1, (now-start)/dur);
    const eased = 1 - Math.pow(1-p, 3);
    el.textContent = Math.round(from + (to-from)*eased);
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------------- Toasts ---------------- */
function toast(msg, kind=''){
  const stack = document.getElementById('toastStack');
  if(!stack) return;
  const el = document.createElement('div');
  el.className = 'toast' + (kind ? ' toast-' + kind : '');
  el.textContent = msg;
  stack.appendChild(el);
  el.addEventListener('animationend', ev=>{ if(ev.animationName === 'fadeOutToast') el.remove(); });
  setTimeout(()=> el.remove(), 2900);
}

/* ---------------- Bump animation helper ---------------- */
function bump(el, cls='bump'){
  if(!el) return;
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  el.addEventListener('animationend', function handler(){
    el.classList.remove(cls);
    el.removeEventListener('animationend', handler);
  });
}

/* =========================================================================
   Rendering: cards / factory sections
   ========================================================================= */
const buildingsEl = document.getElementById('buildings');
const factoryNavEl = document.getElementById('factoryNav');

function otherItemsOptions(excludeId){
  return Object.keys(DB).filter(id=>id!==excludeId)
    .sort((a,b)=>DB[a].name.localeCompare(DB[b].name))
    .map(id => `<option value="${id}">${DB[id].emoji} ${DB[id].name}</option>`).join('');
}

function renderFactoryNav(){
  const bnames = buildingsList();
  factoryNavEl.innerHTML = bnames.map(b=>{
    const count = Object.keys(DB).filter(id=>DB[id].building===b).length;
    const slug = 'fac-' + slugify(b);
    return `<a href="#${slug}" style="--fc:${buildingColor(b)}"><span class="fn-name"><span class="fn-dot"></span>${b}</span><span class="fn-count">${count}</span></a>`;
  }).join('');
}

function renderBuildings(filter=""){
  filter = filter.trim().toLowerCase();
  buildingsEl.innerHTML = "";
  const orderBuildings = buildingsList();
  let shown = 0;
  orderBuildings.forEach(bname => {
    const ids = Object.keys(DB).filter(id => DB[id].building === bname &&
      (!filter || DB[id].name.toLowerCase().includes(filter)));
    if(ids.length === 0) return;
    shown++;
    const sec = document.createElement('div');
    sec.className = 'building';
    sec.id = 'fac-' + slugify(bname);
    sec.style.setProperty('--b-accent', buildingColor(bname));
    sec.innerHTML = `<div class="building-head"><h2>${bname}</h2><span class="count">${ids.length} good${ids.length>1?'s':''}</span></div>
      <div class="grid" data-building="${bname}"></div>`;
    buildingsEl.appendChild(sec);
    const grid = sec.querySelector('.grid');
    ids.forEach(id => grid.appendChild(makeCard(id)));
  });
  if(shown === 0){
    buildingsEl.innerHTML = `<div class="no-results">No goods match “${filter}”. Try another search, or <button class="btn btn-ghost btn-small" id="clearSearchBtn" type="button">clear search</button>.</div>`;
    const cs = document.getElementById('clearSearchBtn');
    if(cs) cs.addEventListener('click', ()=>{ document.getElementById('search').value=''; renderBuildings(''); });
  }
  attachTilt();
}

function makeCard(id){
  const item = DB[id];
  const card = document.createElement('div');
  card.className = 'card' + ((order[id]>0) ? ' has-count' : '');
  card.dataset.id = id;
  card.style.setProperty('--b-accent', buildingColor(item.building));

  const ingLine = item.ingredients.length
      ? item.ingredients.map(ing => {
          const ingredient = DB[ing.id];
          if(!ingredient) return `<span class="ing">❌ ${ing.id} (missing)</span>`;
          return `<span class="ing">${ingredient.emoji} ${ing.qty}× ${ingredient.name}</span>`;
        }).join('')
      : `<span class="ing">Raw / grown good</span>`;

  card.innerHTML = `
    <div class="card-top">
      <span class="emoji">${item.emoji}</span>
      <span class="name">${item.name}</span>
      <button class="card-icon-btn tree-btn" title="Trace ingredient tree" aria-label="Trace ingredient tree for ${item.name}">🌳</button>
      <button class="card-icon-btn edit-toggle" title="Edit recipe" aria-label="Edit recipe for ${item.name}">✎</button>
    </div>
    <div class="meta">${ingLine}<span class="ing">⏱ ${formatTime(item.time)}</span></div>
    <div class="counter-row">
      <button class="minus" aria-label="Remove one ${item.name}">−</button>
      <div class="amt ${(order[id]||0)===0?'zero':''}">${order[id]||0}</div>
      <button class="plus" aria-label="Add one ${item.name}">+</button>
    </div>
    <div class="edit-panel"></div>
  `;

  card.querySelector('.plus').addEventListener('click', ()=> changeOrder(id, 1));
  card.querySelector('.minus').addEventListener('click', ()=> changeOrder(id, -1));
  card.querySelector('.edit-toggle').addEventListener('click', ()=> toggleEdit(card, id));
  card.querySelector('.tree-btn').addEventListener('click', ()=> openTreeModal(id));
  return card;
}

function changeOrder(id, delta){
  order[id] = Math.max(0, (order[id]||0) + delta);
  if(order[id] === 0) delete order[id];
  saveData();
  renderBuildings(document.getElementById('search').value);
  renderReceipt();
  renderDashboard();
  const card = buildingsEl.querySelector(`.card[data-id="${id}"]`);
  if(card){
    bump(card.querySelector('.amt'));
    if(delta > 0) bump(card, 'bump');
  }
  bump(document.getElementById('headerBadge') || document.querySelector('.head-badge'));
}

/* ---------------- Inline recipe editor ---------------- */
function toggleEdit(card, id){
  const panel = card.querySelector('.edit-panel');
  const isOpen = panel.classList.contains('open');
  document.querySelectorAll('.edit-panel.open').forEach(p => p.classList.remove('open'));
  if(isOpen) return;
  panel.classList.add('open');
  buildEditPanel(panel, id);
}

function buildEditPanel(panel, id){
  const item = DB[id];
  let html = `<label>Time (minutes)</label><input type="number" min="0" class="edit-time" value="${item.time}">`;
  html += `<label>Ingredients</label><div class="ing-rows"></div>`;
  html += `<div class="add-ing-row">
      <select class="ing-add-select">${otherItemsOptions(id)}</select>
      <input type="number" class="ing-add-qty" min="1" value="1" style="width:50px;">
      <button class="btn btn-small btn-ghost ing-add-btn" type="button">+ Add</button>
    </div>`;
  panel.innerHTML = html;

  const rowsWrap = panel.querySelector('.ing-rows');
  function drawRows(){
    rowsWrap.innerHTML = "";
    item.ingredients.forEach((ing, idx) => {
      const row = document.createElement('div');
      row.className = 'ing-edit-row';
      row.innerHTML = `<span class="ing-name">${DB[ing.id].emoji} ${DB[ing.id].name}</span>
        <input type="number" min="1" value="${ing.qty}" style="width:50px;">
        <button title="Remove" aria-label="Remove ingredient">✕</button>`;
      row.querySelector('input').addEventListener('change', e=>{
        ing.qty = Math.max(1, parseInt(e.target.value)||1);
        saveData();
        renderBuildings(document.getElementById('search').value);
        renderReceipt(); renderDashboard();
      });
      row.querySelector('button').addEventListener('click', ()=>{
        item.ingredients.splice(idx,1);
        saveData();
        drawRows();
        renderBuildings(document.getElementById('search').value);
        renderReceipt(); renderDashboard();
      });
      rowsWrap.appendChild(row);
    });
    if(item.ingredients.length === 0){
      rowsWrap.innerHTML = '<div style="font-size:11px;color:var(--text-3);">No ingredients — treated as a raw/grown good.</div>';
    }
  }
  drawRows();

  panel.querySelector('.edit-time').addEventListener('change', e=>{
    item.time = Math.max(0, parseFloat(e.target.value)||0);
    saveData();
    renderBuildings(document.getElementById('search').value);
    renderReceipt(); renderDashboard();
  });
  panel.querySelector('.ing-add-btn').addEventListener('click', ()=>{
    const sel = panel.querySelector('.ing-add-select');
    const qtyInput = panel.querySelector('.ing-add-qty');
    const addId = sel.value;
    const qty = Math.max(1, parseInt(qtyInput.value)||1);
    if(!addId || addId === id) return;
    const existing = item.ingredients.find(i=>i.id===addId);
    if(existing){ existing.qty += qty; } else { item.ingredients.push({id:addId, qty}); }
    saveData();
    drawRows();
    renderBuildings(document.getElementById('search').value);
    renderReceipt(); renderDashboard();
  });
}

/* =========================================================================
   Ingredient tree modal (recursive breakdown)
   ========================================================================= */
const treeModalBg = document.getElementById('treeModalBg');
function openTreeModal(id){
  const item = DB[id];
  document.getElementById('treeModalTitle').textContent = `${item.emoji} ${item.name} — ingredient tree`;
  const body = document.getElementById('treeModalBody');
  body.innerHTML = buildTreeNode(id, 1, true);
  treeModalBg.classList.add('open');
}
function buildTreeNode(id, qty, isRoot){
  const item = DB[id];
  if(!item){
    return `<div class="tree-node${isRoot?' root':''}"><div class="tn-row"><span class="tn-emoji">❌</span><span class="tn-name">${id} (missing)</span></div></div>`;
  }
  const base = isBase(id);
  const rowHtml = `<div class="tn-row">
      <span class="tn-emoji">${item.emoji}</span>
      <span class="tn-qty">${qty}×</span>
      <span class="tn-name">${item.name}</span>
      ${base ? '<span class="tn-base">raw</span>' : `<span class="tn-base" style="color:var(--accent-cyan)">${formatTime(item.time*qty)}</span>`}
    </div>`;
  let childrenHtml = '';
  if(!base){
    childrenHtml = `<div class="tree-children">${item.ingredients.map(ing => buildTreeNode(ing.id, ing.qty*qty, false)).join('')}</div>`;
  }
  return `<div class="tree-node${isRoot?' root':''}">${rowHtml}${childrenHtml}</div>`;
}
document.getElementById('treeModalClose').addEventListener('click', ()=> treeModalBg.classList.remove('open'));
treeModalBg.addEventListener('click', e=>{ if(e.target===treeModalBg) treeModalBg.classList.remove('open'); });

/* =========================================================================
   Receipt / calculation
   ========================================================================= */
function computeAll(){
  const baseTotals = {};
  const craftTotals = {};
  function addNeed(id, qty){
    if(!DB[id]) return;
    if(isBase(id)){
      baseTotals[id] = (baseTotals[id]||0) + qty;
    } else {
      craftTotals[id] = (craftTotals[id]||0) + qty;
      DB[id].ingredients.forEach(ing => addNeed(ing.id, ing.qty*qty));
    }
  }
  Object.entries(order).forEach(([id,qty])=>{ if(qty>0) addNeed(id, qty); });

  const buildingTime = {};
  Object.entries(craftTotals).forEach(([id,qty])=>{
    const b = DB[id].building;
    buildingTime[b] = (buildingTime[b]||0) + qty*DB[id].time;
  });
  Object.entries(baseTotals).forEach(([id,qty])=>{
    const b = DB[id].building;
    buildingTime[b] = (buildingTime[b]||0) + qty*DB[id].time;
  });

  return {baseTotals, craftTotals, buildingTime};
}

function renderReceipt(){
  const receiptEl = document.getElementById('receiptPanel');
  if(receiptEl){
    receiptEl.classList.add('updated');
    clearTimeout(receiptEl._pulseTimer);
    receiptEl._pulseTimer = setTimeout(()=> receiptEl.classList.remove('updated'), 550);
  }
  const orderedIds = Object.keys(order).filter(id=>order[id]>0 && DB[id]);
  const orderedEl = document.getElementById('receiptOrdered');
  const rawEl = document.getElementById('receiptRaw');
  const timeEl = document.getElementById('receiptTime');
  const headerCount = document.getElementById('headerCount');
  const fabCount = document.getElementById('fabCount');

  const totalOrdered = orderedIds.reduce((s,id)=>s+order[id],0);
  animateCount(headerCount, totalOrdered);
  if(fabCount) fabCount.textContent = totalOrdered;

  if(orderedIds.length === 0){
    orderedEl.innerHTML = '<div class="r-empty">Nothing on order yet.<br>Tap “+” on any good to begin.</div>';
    rawEl.innerHTML = "";
    timeEl.innerHTML = "";
    return;
  }

  orderedEl.innerHTML = '<p class="r-sec-title">Goods ordered</p>' + orderedIds
    .sort((a,b)=>DB[a].name.localeCompare(DB[b].name))
    .map(id => `<div class="r-row ordered" data-id="${id}">
        <span class="n">${DB[id].emoji} ${DB[id].name}</span>
        <span class="q">×${order[id]}</span>
        <button class="r-remove" title="Remove from order" aria-label="Remove ${DB[id].name}">✕</button>
      </div>`).join('');

  const {baseTotals, buildingTime} = computeAll();
  const rawIds = Object.keys(baseTotals);
  rawEl.innerHTML = rawIds.length
    ? rawIds.sort((a,b)=>DB[a].name.localeCompare(DB[b].name))
        .map(id => `<div class="r-row"><span class="n">${DB[id].emoji} ${DB[id].name}</span><span class="q">×${baseTotals[id]}</span></div>`).join('')
    : '<div class="r-empty">All base goods already on hand.</div>';

  const bIds = Object.keys(buildingTime).sort((a,b)=>buildingTime[b]-buildingTime[a]);
  const totalMin = bIds.reduce((s,b)=>s+buildingTime[b],0);
  timeEl.innerHTML = bIds.map(b => `<div class="time-total"><span>${b}</span><b>${formatTime(buildingTime[b])}</b></div>`).join('')
    + `<div class="time-total grand"><span>Combined workload</span><b>${formatTime(totalMin)}</b></div>`;
}

/* =========================================================================
   Sidebar production dashboard (stats + workload chart)
   ========================================================================= */
function renderDashboard(){
  const orderedIds = Object.keys(order).filter(id=>order[id]>0 && DB[id]);
  const totalOrdered = orderedIds.reduce((s,id)=>s+order[id],0);
  const {baseTotals, craftTotals, buildingTime} = computeAll();
  const rawCount = Object.values(baseTotals).reduce((s,v)=>s+v,0);
  const craftCount = Object.values(craftTotals).reduce((s,v)=>s+v,0);
  const factoriesBusy = Object.keys(buildingTime).length;

  animateCount(document.getElementById('statOrdered'), totalOrdered);
  animateCount(document.getElementById('statRaw'), rawCount);
  animateCount(document.getElementById('statCraft'), craftCount);
  animateCount(document.getElementById('statFactories'), factoriesBusy);

  const bIds = Object.keys(buildingTime).sort((a,b)=>buildingTime[b]-buildingTime[a]);
  const totalMin = bIds.reduce((s,b)=>s+buildingTime[b],0);
  document.getElementById('workloadTotal').textContent = formatTime(totalMin);
  const chart = document.getElementById('workloadChart');
  if(bIds.length === 0){
    chart.innerHTML = '<p class="empty-hint">Add goods to see the workload breakdown.</p>';
    return;
  }
  const max = buildingTime[bIds[0]] || 1;
  chart.innerHTML = bIds.slice(0,8).map(b=>{
    const pct = Math.max(4, Math.round((buildingTime[b]/max)*100));
    return `<div class="wc-row" style="--fc:${buildingColor(b)}">
        <span class="wc-label">${b}</span><span class="wc-val">${formatTime(buildingTime[b])}</span>
        <div class="wc-track"><div class="wc-fill" style="width:${pct}%;background:${buildingColor(b)}"></div></div>
      </div>`;
  }).join('');
}

/* =========================================================================
   3D tilt on cards (pointer-based, rAF-throttled)
   ========================================================================= */
let tiltRAF = null, pendingTilt = null;
function attachTilt(){
  document.querySelectorAll('.card').forEach(card=>{
    if(card._tiltBound) return;
    card._tiltBound = true;
    card.addEventListener('pointermove', e=>{
      if(e.pointerType === 'touch') return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const px = x/rect.width, py = y/rect.height;
      pendingTilt = { card, rx:(0.5-py)*7, ry:(px-0.5)*9, mx:px*100+'%', my:py*100+'%' };
      if(!tiltRAF){
        tiltRAF = requestAnimationFrame(()=>{
          if(pendingTilt){
            const {card,rx,ry,mx,my} = pendingTilt;
            card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
            card.style.setProperty('--mx', mx);
            card.style.setProperty('--my', my);
          }
          tiltRAF = null;
        });
      }
    });
    card.addEventListener('pointerleave', ()=>{ card.style.transform = ''; });
  });
}

/* =========================================================================
   Ripple effect (event delegation, works for buttons added later)
   ========================================================================= */
document.addEventListener('click', e=>{
  const btn = e.target.closest('.btn, .icon-btn');
  if(!btn) return;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.3;
  const rip = document.createElement('span');
  rip.className = 'rip';
  rip.style.width = rip.style.height = size + 'px';
  rip.style.left = (e.clientX - rect.left - size/2) + 'px';
  rip.style.top = (e.clientY - rect.top - size/2) + 'px';
  btn.style.position = btn.style.position || 'relative';
  btn.appendChild(rip);
  rip.addEventListener('animationend', ()=> rip.remove());
});

/* =========================================================================
   Search (live, debounced)
   ========================================================================= */
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', debounce(e=>renderBuildings(e.target.value), 90));

/* =========================================================================
   Receipt interactions
   ========================================================================= */
document.getElementById('receiptOrdered').addEventListener('click', e=>{
  const btn = e.target.closest('.r-remove');
  if(!btn) return;
  const row = btn.closest('.r-row');
  const id = row.dataset.id;
  const removedName = DB[id] ? `${DB[id].emoji} ${DB[id].name}` : 'Item';
  row.classList.add('leaving');
  row.addEventListener('animationend', ()=>{
    delete order[id];
    saveData();
    renderBuildings(document.getElementById('search').value);
    renderReceipt(); renderDashboard();
    toast(`${removedName} removed from order`);
  }, {once:true});
});

document.getElementById('clearBtn').addEventListener('click', ()=>{
  if(Object.keys(order).length === 0){ toast('Order is already empty'); return; }
  order = {};
  saveData();
  renderBuildings(document.getElementById('search').value);
  renderReceipt(); renderDashboard();
  toast('🧾 Order cleared');
});

/* ---------------- Export / print ---------------- */
function exportOrder(){
  const orderedIds = Object.keys(order).filter(id=>order[id]>0 && DB[id]);
  if(orderedIds.length === 0){ toast('Nothing to export yet', 'error'); return; }
  const {baseTotals, craftTotals, buildingTime} = computeAll();
  const payload = {
    generated: new Date().toISOString(),
    ordered: orderedIds.map(id=>({id, name:DB[id].name, qty:order[id]})),
    rawMaterials: Object.entries(baseTotals).map(([id,qty])=>({id, name:DB[id].name, qty})),
    craftedGoods: Object.entries(craftTotals).map(([id,qty])=>({id, name:DB[id].name, qty})),
    workloadMinutesByFactory: buildingTime
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'township-order.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  toast('Order exported as JSON', 'success');
}
document.getElementById('exportBtn').addEventListener('click', exportOrder);
document.getElementById('exportReceiptBtn').addEventListener('click', exportOrder);
document.getElementById('printBtn').addEventListener('click', ()=> window.print());
document.getElementById('printReceiptBtn').addEventListener('click', ()=> window.print());

/* =========================================================================
   Add custom good modal
   ========================================================================= */
const modalBg = document.getElementById('modalBg');
let newIngredients = [];

function openAddModal(){
  document.getElementById('newName').value = "";
  document.getElementById('newEmoji').value = "";
  document.getElementById('newBuilding').value = "";
  document.getElementById('newTime').value = 10;
  newIngredients = [];
  refreshNewIngList();
  refreshNewIngSelect();
  modalBg.classList.add('open');
  setTimeout(()=> document.getElementById('newName').focus(), 60);
}
function closeAddModal(){ modalBg.classList.remove('open'); }

document.getElementById('addItemBtn').addEventListener('click', openAddModal);
document.getElementById('modalCancel').addEventListener('click', closeAddModal);
document.getElementById('modalCancelX').addEventListener('click', closeAddModal);
modalBg.addEventListener('click', e=>{ if(e.target === modalBg) closeAddModal(); });

function refreshNewIngSelect(){
  const sel = document.getElementById('newIngSelect');
  sel.innerHTML = Object.keys(DB).sort((a,b)=>DB[a].name.localeCompare(DB[b].name))
    .map(id=>`<option value="${id}">${DB[id].emoji} ${DB[id].name}</option>`).join('');
}
function refreshNewIngList(){
  const wrap = document.getElementById('newIngList');
  wrap.innerHTML = "";
  newIngredients.forEach((ing, idx)=>{
    const row = document.createElement('div');
    row.className = 'ing-edit-row';
    row.innerHTML = `<span class="ing-name">${DB[ing.id].emoji} ${ing.qty}× ${DB[ing.id].name}</span><button title="Remove" aria-label="Remove">✕</button>`;
    row.querySelector('button').addEventListener('click', ()=>{ newIngredients.splice(idx,1); refreshNewIngList(); });
    wrap.appendChild(row);
  });
}
document.getElementById('newIngAdd').addEventListener('click', ()=>{
  const id = document.getElementById('newIngSelect').value;
  const qty = Math.max(1, parseInt(document.getElementById('newIngQty').value)||1);
  const existing = newIngredients.find(i=>i.id===id);
  if(existing) existing.qty += qty; else newIngredients.push({id, qty});
  refreshNewIngList();
});

document.getElementById('modalSave').addEventListener('click', ()=>{
  const name = document.getElementById('newName').value.trim();
  if(!name){ document.getElementById('newName').focus(); toast('Give the good a name first', 'error'); return; }
  const emoji = document.getElementById('newEmoji').value.trim() || "📦";
  const building = document.getElementById('newBuilding').value.trim() || "Custom";
  const time = Math.max(0, parseFloat(document.getElementById('newTime').value)||0);
  let id = slugify(name);
  while(DB[id]) id = id + "_2";
  DB[id] = {name, emoji, building, time, ingredients: newIngredients.map(i=>({id:i.id, qty:i.qty}))};
  saveData();
  closeAddModal();
  renderFactoryNav();
  renderBuildings(document.getElementById('search').value);
  renderReceipt(); renderDashboard();
  toast(`${emoji} ${name} added to the ledger`, 'success');
});

/* =========================================================================
   Theme toggle
   ========================================================================= */
function applyTheme(){
  document.body.setAttribute('data-theme', theme);
  const moon = document.getElementById('themeIconMoon');
  if(moon) moon.style.opacity = theme === 'dark' ? '1' : '.85';
}
document.getElementById('themeToggle').addEventListener('click', ()=>{
  theme = theme === 'dark' ? 'light' : 'dark';
  applyTheme(); saveTheme();
  toast(theme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode');
});

/* =========================================================================
   Sidebar collapse
   ========================================================================= */
const appShell = document.querySelector('.app-shell');
const overlayBackdrop = document.getElementById('overlayBackdrop');
function syncOverlayBackdrop(){
  const sidebarOpenOverlay = !isDesktopLayout() && !sidebarCollapsed;
  const receiptOpenOverlay = !isDesktopLayout() && receiptPanel.classList.contains('open');
  const show = sidebarOpenOverlay || receiptOpenOverlay;
  overlayBackdrop.classList.toggle('show', show);
  document.body.classList.toggle('scroll-locked', show);
}
function applySidebar(){
  appShell.classList.toggle('sidebar-collapsed', sidebarCollapsed);
  document.getElementById('sidebarToggle').setAttribute('aria-expanded', String(!sidebarCollapsed));
  syncOverlayBackdrop();
}
document.getElementById('sidebarToggle').addEventListener('click', ()=>{
  sidebarCollapsed = !sidebarCollapsed;
  applySidebar(); saveSidebar();
});

/* =========================================================================
   Receipt panel open/close (mobile)
   ========================================================================= */
const receiptPanel = document.getElementById('receiptPanel');
const receiptFab = document.getElementById('receiptFab');
function openReceipt(){ receiptPanel.classList.add('open'); receiptFab.setAttribute('aria-expanded','true'); syncOverlayBackdrop(); }
function closeReceipt(){ receiptPanel.classList.remove('open'); receiptFab.setAttribute('aria-expanded','false'); syncOverlayBackdrop(); }
function toggleReceipt(){ receiptPanel.classList.contains('open') ? closeReceipt() : openReceipt(); }
receiptFab.addEventListener('click', toggleReceipt);
document.getElementById('receiptClose').addEventListener('click', closeReceipt);

// Tapping the scrim closes whichever mobile overlay is open
overlayBackdrop.addEventListener('click', ()=>{
  if(!isDesktopLayout() && !sidebarCollapsed){ sidebarCollapsed = true; applySidebar(); saveSidebar(); }
  closeReceipt();
});

// Keep layout state sane when the viewport crosses the 1180px breakpoint
// (device rotation, resizing a browser window, etc.) instead of leaving
// the app stuck in a mismatched desktop/mobile sidebar state.
let wasDesktopLayout = isDesktopLayout();
window.addEventListener('resize', ()=>{
  const nowDesktop = isDesktopLayout();
  if(nowDesktop !== wasDesktopLayout){
    wasDesktopLayout = nowDesktop;
    if(nowDesktop){
      // Restore the saved desktop preference now that there's room for it
      let saved = false;
      try{ saved = localStorage.getItem('tl_sidebar') === '1'; }catch(e){}
      sidebarCollapsed = saved;
    } else {
      sidebarCollapsed = true; // always start closed when shrinking into overlay mode
    }
    applySidebar();
  } else {
    syncOverlayBackdrop();
  }
});

/* =========================================================================
   Keyboard shortcuts
   ========================================================================= */
document.addEventListener('keydown', e=>{
  const tag = (e.target.tagName || '').toLowerCase();
  const typing = tag === 'input' || tag === 'select' || tag === 'textarea';

  if(e.key === 'Escape'){
    closeAddModal();
    treeModalBg.classList.remove('open');
    closeReceipt();
    if(typing) e.target.blur();
    return;
  }
  if(typing) return;

  if(e.key === '/' ){
    e.preventDefault();
    searchInput.focus();
  } else if(e.key.toLowerCase() === 't'){
    document.getElementById('themeToggle').click();
  } else if(e.key.toLowerCase() === 'r'){
    toggleReceipt();
  } else if(e.key.toLowerCase() === 'e'){
    exportOrder();
  } else if(e.key.toLowerCase() === 'p'){
    window.print();
  }
});

/* =========================================================================
   Init
   ========================================================================= */
function boot(){
  loadData();
  applyTheme();
  applySidebar();
  renderFactoryNav();
  renderBuildings();
  renderReceipt();
  renderDashboard();
}

const loaderFill = document.getElementById('loaderFill');
const loaderCaption = document.getElementById('loaderCaption');
const captions = ['Warming up the silos…','Counting crates…','Tuning the conveyor belts…','Polishing the ledger…'];
let capIdx = 0, progress = 0;
const loadTimer = setInterval(()=>{
  progress = Math.min(96, progress + (8 + Math.random()*14));
  if(loaderFill) loaderFill.style.width = progress + '%';
  if(loaderCaption && Math.random() > .55){ capIdx = (capIdx+1) % captions.length; loaderCaption.textContent = captions[capIdx]; }
}, 160);

function finishLoading(){
  clearInterval(loadTimer);
  if(loaderFill) loaderFill.style.width = '100%';
  boot();
  setTimeout(()=>{
    const ls = document.getElementById('loadingScreen');
    if(ls) ls.classList.add('hidden');
  }, 260);
}

if(document.readyState === 'complete') setTimeout(finishLoading, 500);
else window.addEventListener('load', ()=> setTimeout(finishLoading, 500));

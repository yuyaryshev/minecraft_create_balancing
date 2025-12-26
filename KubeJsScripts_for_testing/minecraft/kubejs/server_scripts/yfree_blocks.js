const freeBlocks = [
  "minecraft:stone_bricks",
  "chipped:lodestone_bricks", 
];

// Function to create a shapeless recipe giving 64 of the same b
// onEvent is not supported anymore on this kubejs!
//onEvent('recipes', event => {
//  freeBlocks.forEach(b => {
//    event.shapeless(item.of(b, 64), b)
//      .id(`chipped:${b.replace(':', '_')}_free`);
//  });
//});



// /give lordodin minecraft:stone_bricks
// /give lordodin chipped:lodestone_bricks
// /give lordodin chipped:dirt_bricks
// /give lordodin chipped:mud_bricks
// /give lordodin chipped:packed_mud_bricks
// /give lordodin chipped:clay_bricks
// /give lordodin chipped:mud_bricks_bricks
// /give lordodin minecraft:bricks
// /give lordodin chipped:red_sandstone_bricks
// /give lordodin chipped:sandstone_bricks
// /give lordodin chipped:smooth_stone_bricks

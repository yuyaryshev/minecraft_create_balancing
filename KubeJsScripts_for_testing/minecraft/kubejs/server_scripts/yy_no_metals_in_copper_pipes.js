//const protectedBlocks = [
//    'createmetallurgy:foundry_basin'
//];
//
//const copperFluidBlocks = [
//    'create:fluid_pipe',
//    'create:fluid_tank',
//    'create:mechanical_pump'
//];
//
//// Utility function to check and destroy a block if it matches a list
//function destroyIfMatches(world, pos, matchingBlocks) {
//    const block = world.getBlock(pos);
//    if (matchingBlocks.includes(block.id)) {
//        world.setBlock(pos, 'minecraft:air'); // Destroy the block
//        return true;
//    }
//    return false;
//}
//
//// Helper to get adjacent positions (same level, directly adjacent)
//function getAdjacentPositions(pos) {
//    return [
//        { x: pos.x + 1, y: pos.y, z: pos.z },
//        { x: pos.x - 1, y: pos.y, z: pos.z },
//        { x: pos.x, y: pos.y + 1, z: pos.z },
//        { x: pos.x, y: pos.y - 1, z: pos.z },
//        { x: pos.x, y: pos.y, z: pos.z + 1 },
//        { x: pos.x, y: pos.y, z: pos.z - 1 }
//    ];
//}
//
//// When a protected block is placed
//for (let protectedBlock of protectedBlocks) {
//    BlockEvents.placed(protectedBlock, event => {
//        const pos = event.block;
//        const world = event.world;
//
//		
//        event.player.tell(`${protectedBlock} is placed! ${JSON.stringify(Object.keys(event))}`);
//		const ppos = event.getBlock().east.getBlock().block;//.getPos();
////		const a = [ppos.x,ppos.y,ppos.z];
//        event.player.tell(`a = ${JSON.stringify(Object.keys(ppos))}`);
//
////        for (let adj of getAdjacentPositions(pos)) {
////            if (destroyIfMatches(world, adj, copperFluidBlocks)) {
////                event.player.tell(`Destroyed a copper fluid block next to ${protectedBlock}!`);
////            }
////        }
//    });
//}
//
//// When a copper fluid block is placed
//for (let fluidBlock of copperFluidBlocks) {
//    BlockEvents.placed(fluidBlock, event => {
//        const pos = event.block;
//        const world = event.world;
//
//        event.player.tell(`${fluidBlock} is placed!`);
//
//        for (let adj of getAdjacentPositions(pos)) {
//            if (destroyIfMatches(world, adj, protectedBlocks)) {
//                event.player.tell(`Destroyed a protected block next to ${fluidBlock}!`);
//            }
//        }
//    });
//}

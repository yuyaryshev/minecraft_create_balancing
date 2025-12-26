// yy_replace_iron_with_andesite.js
// Converts iron ingredients in selected recipes to andesite equivalents

ServerEvents.recipes(event => {	
	event.remove({ output: 'create:andesite_alloy' });
	for(let nugget of [
		'minecraft:iron_nugget',
		'create:copper_nugget',
		'create:zinc_nugget',
		]) {
		event.shapeless(
		  Item.of('create:andesite_alloy', 2), 
		  [
			'minecraft:andesite',
			nugget,
		  ],
		)
	}
	
	event.shapeless(
	  Item.of('yyitems:andesite_nugget', 9), 
	  [
		'create:andesite_alloy',
	  ],
	)
	
	event.shapeless(
	  Item.of('create:andesite_alloy', 1), 
	  [
		'yyitems:andesite_nugget','yyitems:andesite_nugget','yyitems:andesite_nugget',
		'yyitems:andesite_nugget','yyitems:andesite_nugget','yyitems:andesite_nugget',
		'yyitems:andesite_nugget','yyitems:andesite_nugget','yyitems:andesite_nugget',
	  ],
	)
	event.recipes.create.pressing('yyitems:andesite_sheet', 'create:andesite_alloy');
	
	event.shapeless(
	  Item.of('create_pattern_schematics:empty_pattern_schematic', 1), 
	  [
		'yyitems:andesite_sheet',
		'minecraft:paper',
		'#forge:dyes/pink',
	  ],
	)
		
	event.shaped(
	  Item.of('flopper:flopper', 1), 
	  [
		'ABA',
		' A ',
		'   '
	  ],
	  {
		A: 'yyitems:andesite_sheet',
		B: 'minecraft:bucket',
	  }
	)	
	
	event.shaped(
	  Item.of('chisel:chisel', 1), 
	  [
		' A ',
		'S  ',
		'   '
	  ],
	  {
		S: '#forge:rods/wooden',
		A: 'yyitems:andesite_sheet',
	  }
	)
	
	event.shaped(
	  Item.of('minecraft:hopper', 1), 
	  [
		'A A',
		'ACA',
		' A '
	  ],
	  {
		A: 'yyitems:andesite_sheet',
		C: '#forge:chests/wooden',
	  }
	)
	
	event.shaped(
	  Item.of('minecraft:rail', 16), 
	  [
		'A A',
		'ABA',
		'A A'
	  ],
	  {
		A: 'create:andesite_alloy',
		B: '#forge:rods/wooden',
	  }
	)
	
		
	event.shaped(
	  Item.of('minecraft:activator_rail', 16), 
	  [
		'ABA',
		'ARA',
		'ABA'
	  ],
	  {
		A: 'create:andesite_alloy',
		B: '#forge:rods/wooden',
		R: 'minecraft:redstone_torch',
	  }
	)
	
			
	event.shaped(
	  Item.of('minecraft:powered_rail', 16), 
	  [
		'A A',
		'ABA',
		'AGA'
	  ],
	  {
		A: 'create:andesite_alloy',
		B: '#forge:rods/wooden',
		G: 'minecraft:gold_ingot',
	  }
	)
	
	
			
	event.shaped(
	  Item.of('minecraft:minecart', 1), 
	  [
		'A A',
		'BBB',
		'   '
	  ],
	  {
		A: 'create:andesite_alloy',
		B: 'yyitems:andesite_sheet',
	  }
	)
		
			
	event.shaped(
	  Item.of('minecraft:stonecutter', 1), 
	  [
		' A ',
		'BBB',
		'   '
	  ],
	  {
		A: 'yyitems:andesite_sheet',
		B: 'minecraft:stone',
	  }
	)
	
	
	event.shaped(
	  Item.of('create:brass_hand', 1), 
	  [
		' A ',
		'BBB',
		' B '
	  ],
	  {
		A: 'create:andesite_alloy',
		B: 'yyitems:andesite_sheet',
	  }
	)
	
	event.shaped(
	  Item.of('minecraft:piston', 1), 
	  [
		'WWW',
		'SDS',
		'SRS'
	  ],
	  {
		W: '#minecraft:planks',
		S: 'minecraft:cobblestone',
		D: 'create:andesite_alloy',
		R: 'minecraft:redstone',
	  }
	)
	
	event.shaped(
	  Item.of('minecraft:cauldron', 1), 
	  [
		'A A',
		'A A',
		'AAA'
	  ],
	  {
		A: 'yyitems:andesite_sheet',
	  }
	)
	
		
	event.replaceInput(
		{ id: 'create:schematicannon'}, 
		'minecraft:iron_block',  
		'create:andesite_alloy'
	);


    event.replaceInput(
        { id: 'create_connected:overstress_clutch'},
        'create:electron_tube',
        'create:large_cogwheel'
    );


    // List of recipes to modify
  const recipesToReplace = [
    'cookingforblockheads:tool_rack',
    'create:metal_bracket',
    'create_connected:overstress_clutch',         
    'create_connected:centrifugal_clutch',        
    'create_connected:freewheel_clutch',           
    'cookingforblockheads:toaster',
    'cookingforblockheads:sink',
    'cookingforblockheads:oven',
    'cookingforblockheads:heating_unit',
    'cookingforblockheads:ice_unit',
	'cookingforblockheads:preservation_chamber',
	'farmersdelight:stove',
	'farmersdelight:cooking_pot',
	'farmersdelight:skillet',
    'storagedrawers:compacting_drawers_1',
    'storagedrawers:compacting_drawers_2',
    'storagedrawers:compacting_drawers_3',
    'storagedrawers:compacting_half_drawers_1',
    'storagedrawers:compacting_half_drawers_2',
    'storagedrawers:compacting_half_drawers_3',
    'flopper:flopper',
    'create_factory_logistics:jar_packager',
    'create_pattern_schematics:empty_pattern_schematic',
    'create:empty_blaze_burner',                          
	'create:electron_tube',                               
    'create:chute',
	'create:item_drain',                                  
	'sliceanddice:sprinkler',                             
    'create:crafting/kinetics/propeller',
    'create:crafting/curiosities/minecart_coupling',
    'create:crafting/kinetics/item_vault',
	'create_connected:item_silo',
    'create:crafting/kinetics/mechanical_drill',
    'create:crafting/kinetics/mechanical_press',
    'create:crafting/kinetics/mechanical_harvester',
    'create:crafting/kinetics/mechanical_plough',
    'create:crafting/kinetics/mechanical_saw',
    'create:crafting/kinetics/metal_girder',
    'create:crafting/kinetics/rope_pulley',
    'create:crafting/kinetics/super_glue',
    'create:crafting/kinetics/whisk',
    'create:crafting/logistics/packager',
    'create:crafting/logistics/redstone_contact',
    'create:crafting/logistics/redstone_requester',
    'createmoredrillheads:stone_drill',
    'createmoredrillheads:wooden_drill',
    'lightmanscurrency:upgrades/create_template',
    'create:crafting/kinetics/encased_chain_drive',
    'create:crafting/kinetics/fluid_valve',
    'create_vibrant_vaults:crafting/black_redstone_requester',
    'create_vibrant_vaults:crafting/blue_redstone_requester',
    'create_vibrant_vaults:crafting/brown_redstone_requester',
    'create_vibrant_vaults:crafting/cyan_redstone_requester',
    'create_vibrant_vaults:crafting/gray_redstone_requester',
    'create_vibrant_vaults:crafting/green_redstone_requester',
    'create_vibrant_vaults:crafting/light_blue_redstone_requester',
    'create_vibrant_vaults:crafting/light_gray_redstone_requester',
    'create_vibrant_vaults:crafting/lime_redstone_requester',
    'create_vibrant_vaults:crafting/magenta_redstone_requester',
    'create_vibrant_vaults:crafting/orange_redstone_requester',
    'create_vibrant_vaults:crafting/pink_redstone_requester',
    'create_vibrant_vaults:crafting/purple_redstone_requester',
    'create_vibrant_vaults:crafting/red_redstone_requester',
    'create_vibrant_vaults:crafting/white_redstone_requester',
    'create_vibrant_vaults:crafting/yellow_redstone_requester'
  ];

  // Replacement map: tag → new item
  const replacements = [
    { f: '#forge:nuggets/iron', t: 'yyitems:andesite_nugget' },
    { f: '#forge:plates/iron', t: 'yyitems:andesite_sheet' },
    { f: '#forge:ingots/iron', t: 'create:andesite_alloy' },
    { f: '#forge:storage_blocks/iron', t: 'create:andesite_alloy_block' },
    { f: 'minecraft:iron_bars', t: 'create:andesite_bars' },
  ];
  
	for(let recipeId of recipesToReplace) {
		for(let {f,t} of replacements) {
			event.replaceInput(
				{ 
					id: recipeId
				}, // Arg 1: the filter
				f,            // Arg 2: the item to replace
				t         		// Arg 3: the item to replace it with
			);
			
			event.replaceInput(
				{ 
					output: recipeId
				}, // Arg 1: the filter
				f,            // Arg 2: the item to replace
				t         		// Arg 3: the item to replace it with
			);
		}
	}
});



	
	
 
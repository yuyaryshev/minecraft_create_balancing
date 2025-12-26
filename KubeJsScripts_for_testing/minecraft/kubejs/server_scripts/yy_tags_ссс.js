ServerEvents.tags('item', event => {
    // All non decorative, create (and accompanied mods) here
	// To select create and automation blocks & tools use '#ccc' in JEI 
    // Also should include all basic automation blocks from minecraft (piston, dispenset, etc)
    // Core Create automation and components
    event.add('yyitems:ccc', 'create:gearshift');
    event.add('yyitems:ccc', 'create:encased_chain_drive');
    event.add('yyitems:ccc', 'create:portable_storage_interface');
    event.add('yyitems:ccc', 'create:clutch');
    event.add('yyitems:ccc', 'create:schematic_table');
    event.add('yyitems:ccc', 'create:schematicannon');
    event.add('yyitems:ccc', 'create:weighted_ejector');
    event.add('yyitems:ccc', 'create:gantry_carriage');
    event.add('yyitems:ccc', 'create:millstone');
    event.add('yyitems:ccc', 'create:mechanical_arm');
    event.add('yyitems:ccc', 'create:mechanical_crafter');
    event.add('yyitems:ccc', 'create:rotation_speed_controller');
    event.add('yyitems:ccc', 'create:sequenced_gearshift');
    event.add('yyitems:ccc', 'create:mechanical_drill');
    event.add('yyitems:ccc', 'create:brass_funnel');
    event.add('yyitems:ccc', 'create:brass_tunnel');
    event.add('yyitems:ccc', 'create:smart_chute');
    event.add('yyitems:ccc', 'create:crushing_wheel');
    event.add('yyitems:ccc', 'create:controller_rail');
    event.add('yyitems:ccc', 'create:track_station');
    event.add('yyitems:ccc', 'create:track_signal');
    event.add('yyitems:ccc', 'create:track_observer');
    event.add('yyitems:ccc', 'create:controls');

    // Connected / expansion mods
    event.add('yyitems:ccc', 'create_connected:brass_gearbox');
    event.add('yyitems:ccc', 'create_connected:kinetic_battery');
    event.add('yyitems:ccc', 'create_connected:inventory_bridge');
    event.add('yyitems:ccc', 'create_connected:inventory_access_port');
    event.add('yyitems:ccc', 'create_connected:sequenced_pulse_generator');
    event.add('yyitems:ccc', 'create_connected:fluid_vessel');

    // Energy / power handling
    event.add('yyitems:ccc', 'create_new_age:basic_motor');
    event.add('yyitems:ccc', 'create_new_age:advanced_motor');
    event.add('yyitems:ccc', 'create_new_age:reinforced_motor');
    event.add('yyitems:ccc', 'create_new_age:energiser_t1');
    event.add('yyitems:ccc', 'create_new_age:energiser_t2');
    event.add('yyitems:ccc', 'create_new_age:energiser_t3');
    event.add('yyitems:ccc', 'create_new_age:generator_coil');
    event.add('yyitems:ccc', 'create_new_age:stirling_engine');
    event.add('yyitems:ccc', 'create_new_age:heater');

    // Factory / fluid mods
    event.add('yyitems:ccc', 'create_factory_logistics:jar_packager');
    event.add('yyitems:ccc', 'create_factory_logistics:factory_fluid_gauge');
    event.add('yyitems:ccc', 'create_factory_logistics:network_link');
    event.add('yyitems:ccc', 'create_factory_logistics:fluid_mechanism');
    event.add('yyitems:ccc', 'createmetallurgy:foundry_mixer');
    event.add('yyitems:ccc', 'create:item_drain');
    event.add('yyitems:ccc', 'create:spout');
    event.add('yyitems:ccc', 'create:fluid_tank');
    event.add('yyitems:ccc', 'create:fluid_pipe');
    event.add('yyitems:ccc', 'create:fluid_valve');

    // balancedflight
    event.add('yyitems:ccc', 'balancedflight:ascended_flight_ring');
    event.add('yyitems:ccc', 'balancedflight:flight_anchor');

    // Unipacks
    event.add('yyitems:ccc', 'yyitems:andesite_machinery_unipack');
    event.add('yyitems:ccc', 'yyitems:brass_machinery_unipack');
    event.add('yyitems:ccc', 'yyitems:cannons_unipack');
    event.add('yyitems:ccc', 'yyitems:cloth_unipack');
    event.add('yyitems:ccc', 'yyitems:diamond_unipack');
    event.add('yyitems:ccc', 'yyitems:food_unipack');
    event.add('yyitems:ccc', 'yyitems:kitchen_unipack');
    event.add('yyitems:ccc', 'yyitems:redstone_unipack');
});


/*
Hi, ChatGPT! I need your help in classifying items for my minecraft modpack.
Please output exactly in this format:
    event.add('yyitems:CATEGORY', 'ITEM_IDS');
Example:
    event.add('yyitems:rrr', 'minecraft:redstone');	

My categories are isolated, have no intersections - that is if an item belongs to one category it can't belong to another
My categories:
ddd - decorations and variations. Decoration blocks (like chiseled) and items (like cosmetic baubles), misc items that has no recipe like monster spawn eggs and buckets of all fluids, monster heads.
	And variations - all items of different colors or wood types except for the first/main one. For example Create have brown_toolbox - that is crafted. And then one can dye toolbox into different colors.
	brown_toolbox should go to ccc, and all other colors - to ddd. Drawers - also have many woods variants. Oak wood variants should go to ccc and all the rest to ddd.
bbb - botania automation (only non decorative items: exclude decorative baubles and initial flowers and dyes)
ccc - automation & storage (create machines, pistons, etc, but not decorative blocks and variations), including stationary cannons but excluding hand held tools and guns
rrr - redstone and signal processing
ttt - tools including Paxels, AIOTs and multitools
www - weapons - hand held weapos excluding tools (ttt), excluding stationarry weapons like cannons, mortars or other turrets
aaa - armor
fff - food and food only - items that player can eat directly. Not kitchen tools, not food ingredients.
other - put here all that you don't know, can't classify or goes to many categories.

Below is list of item ids to be categorized. Please use only them, dont generate your own even if some categories are left empty (because this is only part of the list, and all the rest will be categorized in other promts).
*/
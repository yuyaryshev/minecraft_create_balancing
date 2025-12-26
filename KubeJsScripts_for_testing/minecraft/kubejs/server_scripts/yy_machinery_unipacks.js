// yy_mechanical_unipacks.js
const copperMachineryUnipack = [];
const brassMachineryUnipack = [
];

var nn;
function f(n0, s, p){
    if(n0 <= 1) {
        return s;
    }

    nn = n0;
    if(n0 > 1) {
        switch(p) {
            case 'andesite_machinery':
            case 'redstone':
            case 'cannons':
            case 'kitchen':
                break;

            case 'copper_machinery':
                nn = Math.round(n0 * 1.5);
                break;

            case 'brass_machinery':
                nn = Math.round(n0 * 4);
                break;

            case 'diamond':
                nn = Math.round(n0 * 8);
                break;
        }

        if(nn>64) {
            nn = 64;
        }
    }

    return `${nn}x ${s}`;
}

let inc;
let pn;
ServerEvents.recipes(event => {
    // event.shapeless('yyitems:andesite_machinery_unipack', [
    //     'create:andesite_alloy_block',
    //     'create:gearbox',
    //     'create:andesite_casing',
    //     'minecraft:dried_kelp_block'
    // ]);


    event.recipes.create.compacting('yyitems:andesite_machinery_unipack', [
        'create:andesite_alloy_block',
        'create:gearbox',
        'create:andesite_casing',
        'minecraft:dried_kelp_block'
    ]);

    event.recipes.create.compacting('yyitems:copper_machinery_unipack', [
        'yyitems:andesite_machinery_unipack',
        'minecraft:copper_block'
    ]);

    event.recipes.create.compacting('yyitems:brass_machinery_unipack', [
        'yyitems:copper_machinery_unipack',
        'create:brass_block',
        'create:precision_mechanism',
        'create:brass_funnel'
    ]);

    event.recipes.create.compacting('yyitems:cannons_unipack', [
        'yyitems:copper_machinery_unipack',
        'createmetallurgy:steel_block'
    ]);

    event.recipes.create.compacting('yyitems:diamond_unipack', [
        'yyitems:brass_machinery_unipack',
        'minecraft:diamond_block'
    ]);

    event.recipes.create.compacting('yyitems:kitchen_unipack', [ 'create:andesite_alloy_block',
        'minecraft:glass',
        'minecraft:terracotta',
        'minecraft:terracotta',
        'minecraft:terracotta',
        'minecraft:terracotta',
        'minecraft:terracotta',
        'minecraft:terracotta',
        'minecraft:terracotta'
    ]);

    event.recipes.create.compacting('yyitems:kitchen_unipack', [
        'yyitems:andesite_machinery_unipack',
        'minecraft:terracotta',
        'minecraft:terracotta',
        'minecraft:terracotta',
        'minecraft:terracotta',
        'minecraft:terracotta',
        'minecraft:terracotta',
        'minecraft:terracotta',
        'minecraft:terracotta'
    ]);

    event.recipes.create.compacting('yyitems:redstone_unipack', [
        'minecraft:redstone_block',
        'minecraft:quartz',
        'minecraft:stone',
        'minecraft:stone',
        'minecraft:stone',
        'minecraft:stone',
        'minecraft:stone',
        'minecraft:stone',
        'minecraft:stone'
    ]);



    for(let oi of ['#minecraft:planks','minecraft:stone','minecraft:cobblestone','minecraft:stick']) {
        event.shapeless('8x minecraft:stonecutter', ['yyitems:andesite_machinery_unipack',  oi]);
        event.shapeless('16x minecraft:stonecutter', ['yyitems:copper_machinery_unipack',  oi]);
        event.shapeless('32x minecraft:stonecutter', ['yyitems:brass_machinery_unipack',  oi]);
        event.shapeless('64x minecraft:stonecutter', ['yyitems:diamond_unipack',  oi]);
        event.shapeless('4x minecraft:stonecutter', ['yyitems:redstone_unipack',  oi]);
        event.shapeless('4x minecraft:stonecutter', ['yyitems:kitchen_unipack',  oi]);
        event.shapeless('4x minecraft:stonecutter', ['yyitems:cannons_unipack',  oi]);
    }
	

	event.stonecutting('1x yyitems:andesite_machinery_unipack',   ['yyitems:copper_machinery_unipack']);
	
	event.stonecutting('8x yyitems:andesite_machinery_unipack',   ['yyitems:brass_machinery_unipack']);
	event.stonecutting('3x yyitems:copper_machinery_unipack',     ['yyitems:brass_machinery_unipack']);
	
	event.stonecutting('yyitems:cannons_unipack',    		  	  ['yyitems:brass_machinery_unipack']);
	event.stonecutting('2x yyitems:kitchen_unipack',    		  ['yyitems:brass_machinery_unipack']);
	event.stonecutting('2x yyitems:redstone_unipack',    		  ['yyitems:brass_machinery_unipack']);
	
	event.stonecutting('32x yyitems:andesite_machinery_unipack',  ['yyitems:diamond_unipack']);
	event.stonecutting('8x yyitems:copper_machinery_unipack',     ['yyitems:diamond_unipack']);
	event.stonecutting('2x yyitems:brass_machinery_unipack',      ['yyitems:diamond_unipack']);
	event.stonecutting('4x yyitems:cannons_unipack',    		  ['yyitems:diamond_unipack']);
	event.stonecutting('8x yyitems:kitchen_unipack',    		  ['yyitems:diamond_unipack']);
	event.stonecutting('8x yyitems:redstone_unipack',    		  ['yyitems:diamond_unipack']);

    for (let p of ['andesite_machinery','copper_machinery','brass_machinery','diamond','redstone','cannons','kitchen']) {
        let pn = `yyitems:${p}_unipack`;

        if (p === 'andesite_machinery' || p === 'copper_machinery' || p === 'brass_machinery' || p === 'diamond_machinery') {
            event.stonecutting(f(8,'minecraft:chest',p), pn);
            event.stonecutting(f(12,'minecraft:barrel',p), pn);
            event.stonecutting(f(8,'minecraft:stonecutter',p), pn);
            event.stonecutting(f(6,'create:portable_storage_interface',p), pn);
            event.stonecutting(f(8,'create:gearshift',p), pn); // Redstone
            event.stonecutting(f(8,'create:encased_chain_drive',p), pn);
            event.stonecutting(f(2,'create:andesite_alloy_block',p), pn);
            event.stonecutting(f(2,'minecraft:dried_kelp_block',p), pn);
            event.stonecutting(f(1,'create_new_age:basic_motor',p), pn); // Replace nuggets with andesite nuggets
            event.stonecutting(f(1,'create_new_age:carbon_brushes',p), pn);
            event.stonecutting(f(8,'create_connected:crank_wheel',p), pn);
            event.stonecutting(f(8,'create_connected:large_crank_wheel',p), pn);
            event.stonecutting(f(8,'create_connected:inverted_clutch',p), pn);
            event.stonecutting(f(8,'create:clutch',p), pn); // 1 redstone
            event.stonecutting(f(6,'create_connected:encased_chain_cogwheel',p), pn);
            event.stonecutting(f(32,'create_connected:shear_pin',p), pn);
            event.stonecutting(f(6,'create_connected:cross_connector',p), pn);
            event.stonecutting(f(8,'escalated:wooden_walkway_steps',p), pn);
            event.stonecutting(f(6,'createmetallurgy:faucet',p), pn);
            event.stonecutting(f(4,'create_cultivation:cultivation_base',p), pn); // 2 glowstone
            event.stonecutting(f(1,'create:schematic_table',p), pn);
            event.stonecutting(f(1,'create:schematicannon',p), pn);
            event.stonecutting(f(2,'create:chain_conveyor',p), pn);
            event.stonecutting(f(1,'create:weighted_ejector',p), pn);
            event.stonecutting(f(1,'create:gantry_carriage',p), pn);
            event.stonecutting(f(1,'create:white_postbox',p), pn);
            event.stonecutting(f(8,'create:white_table_cloth',p), pn); // 1 cloth
            event.stonecutting(f(8,'create:andesite_table_cloth',p), pn);
            event.stonecutting(f(16,'create:analog_lever',p), pn);

            event.stonecutting(f(8,'create:clipboard',p), pn);
            event.stonecutting(f(24,'create:andesite_ladder',p), pn);
            event.stonecutting(f(12,'create:andesite_scaffolding',p), pn);
            event.stonecutting(f(6,'create:andesite_door',p), pn);
            event.stonecutting(f(4,'minecraft:hopper_minecart',p), pn);
            event.stonecutting(f(1,'minecraft:chest_minecart',p), pn);
            event.stonecutting(f(1,'minecraft:furnace_minecart',p), pn);
            event.stonecutting(f(1,'supplementaries:dispenser_minecart',p), pn);
            event.stonecutting(f(2,'createsifter:andesite_mesh',p), pn);
        }

        if (p === 'copper_machinery' || p === 'brass_machinery' || p === 'diamond') {
            // Copper
            //event.stonecutting(f(1,'create_furnace_lava_adapter:furnace_lava_adapter',p), pn);
            event.stonecutting(f(8,'create_pneuequip:airvent',p), pn);
            event.stonecutting(f(8,'drill_drain:drill_drain',p), pn);
            event.stonecutting(f(8,'create:item_drain',p), pn);
            //event.stonecutting(f(8,'thermantics:thermal_exchanger',p), pn);
            event.stonecutting(f(1,'create_enchantment_industry:disenchanter',p), pn);
            event.stonecutting(f(8,'mechanical_botany:mechanical_insolator',p), pn);
            event.stonecutting(f(4,'create:hose_pulley',p), pn);
            event.stonecutting(f(6,'create:spout',p), pn);
            event.stonecutting(f(8,'create:portable_fluid_interface',p), pn);
            event.stonecutting(f(8,'create:copper_door',p), pn);
            event.stonecutting(f(16,'create_new_age:heat_pipe',p), pn); // 2 zinc nugget, 3 terracota blocks
            event.stonecutting(f(1,'ratatouille:squeeze_basin',p), pn);
            event.stonecutting(f(1,'ratatouille:irrigation_tower',p), pn);
            event.stonecutting(f(1,'create_connected:fluid_vessel',p), pn);
            // event.stonecutting(f(1,'create:wrench',p), pn);
            event.stonecutting(f(32,'create:fluid_pipe',p), pn);
            event.stonecutting(f(8,'create:copper_valve_handle',p), pn);
            event.stonecutting(f(9,'create:fluid_tank',p), pn);
            event.stonecutting(f(1,'create:transmitter',p), pn);
            event.stonecutting(f(1,'create:goggles',p), pn);
            event.stonecutting(f(6,'sliceanddice:sprinkler',p), pn);
            event.stonecutting(f(1,'minecraft:lightning_rod',p), pn);
            event.stonecutting(f(8,'suppsquared:copper_plaque',p), pn);
            event.stonecutting(f(8,'supplementaries:turn_table',p), pn);
            event.stonecutting(f(16,'friendsandfoes:waxed_copper_button',p), pn);
            // event.stonecutting(f(1,'supplementaries:wrench',p), pn);
            event.stonecutting(f(8,'copper_bucket_mod:copper_bucket',p), pn);
            event.stonecutting(f(2,'create_factory_logistics:jar_packager',p), pn); // 2 redstone
            event.stonecutting(f(8,'mcwlights:copper_chain',p), pn);
            event.stonecutting(f(1,'moreburners:copper_coil',p), pn);
            event.stonecutting(f(1,'storagedrawers:copper_storage_upgrade',p), pn);
            event.stonecutting(f(1,'storagedrawers:magnet_upgrade',p), pn);
            event.stonecutting(f(1,'storagedrawers:magnet_upgrade_2',p), pn);
            event.stonecutting(f(1,'storagedrawers:magnet_upgrade_3',p), pn);
            event.stonecutting(f(1,'storagedrawers:drawer_key',p), pn);
            event.stonecutting(f(2,'storagedrawers:controller',p), pn);
            event.stonecutting(f(4,'storagedrawers:controller_slave',p), pn);
            // event.stonecutting(f(4,'toughasnails:water_purifier',p), pn);
            // event.stonecutting(f(8,'toughasnails:thermometer',p), pn);
            // event.stonecutting(f(4,'toughasnails:empty_copper_canteen',p), pn);
            // event.stonecutting(f(1,'alexsmobs:hummingbird_feeder',p), pn);
            event.stonecutting(f(1,'create:steam_whistle',p), pn); // 1 Gold Sheet
            event.stonecutting(f(2,'create:copper_diving_helmet',p), pn);
            event.stonecutting(f(2,'create:copper_diving_boots',p), pn);
            event.stonecutting(f(4,'create_sa:small_filling_tank',p), pn);
            event.stonecutting(f(2,'create_sa:medium_filling_tank',p), pn);
            event.stonecutting(f(1,'create_sa:large_filling_tank',p), pn);
            event.stonecutting(f(1,'create:copper_backtank',p), pn);
            event.stonecutting(f(2,'minecraft:copper_block',p), pn);
            event.stonecutting(f(1,'create_new_age:stirling_engine',p), pn); // 1 Gold Sheet
            event.stonecutting(f(1,'create_new_age:basic_energiser',p), pn);
            event.stonecutting(f(1,'create_new_age:electrical_connector',p), pn);
            event.stonecutting(f(1,'create_new_age:carbon_brushes',p), pn);
            event.stonecutting(f(1,'create_new_age:generator_coil',p), pn);
            event.stonecutting(f(1,'createsifter:sifter',p), pn);
            event.stonecutting(f(1,'moreburners:electric_burner',p), pn);
            event.stonecutting(f(1,'create:linked_controller',p), pn);
            event.stonecutting(f(1,'create:encased_fan',p), pn);
            event.stonecutting(f(1,'create:turntable',p), pn);
            event.stonecutting(f(1,'create:millstone',p), pn);
            event.stonecutting(f(1,'create:empty_blaze_burner',p), pn);
            event.stonecutting(f(1,'create:fluid_valve',p), pn);
            event.stonecutting(f(1,'create:copper_valve_handle',p), pn);
            event.stonecutting(f(1,'create:white_valve_handle',p), pn);
            event.stonecutting(f(1,'create:copper_table_cloth',p), pn);
            event.stonecutting(f(1,'create:copper_ladder',p), pn);
            event.stonecutting(f(1,'create:copper_scaffolding',p), pn);
            event.stonecutting(f(1,'create:framed_glass_door',p), pn);
            event.stonecutting(f(1,'create:framed_glass_trapdoor',p), pn);
        }

        if (p === 'cannons') {
            // Cannon blocks
            event.stonecutting(f(1,'createbigcannons:cannon_mount',p), pn);
            event.stonecutting(f(1,'createbigcannons:cannon_mount_extension',p), pn);
            event.stonecutting(f(1,'createbigcannons:fixed_cannon_mount',p), pn);
            event.stonecutting(f(1,'createbigcannons:log_cannon_end',p), pn);
            event.stonecutting(f(1,'createbigcannons:log_cannon_chamber',p), pn);

            event.stonecutting(f(1,'createbigcannons:wrought_iron_cannon_end',p), pn);
            event.stonecutting(f(1,'createbigcannons:wrought_iron_cannon_chamber',p), pn);
            event.stonecutting(f(1,'createbigcannons:wrought_iron_drop_mortar_end',p), pn);

            event.stonecutting(f(1,'createbigcannons:cast_iron_cannon_end',p), pn);
            event.stonecutting(f(1,'createbigcannons:cast_iron_sliding_breech',p), pn);
            event.stonecutting(f(1,'createbigcannons:cast_iron_cannon_chamber',p), pn);
            event.stonecutting(f(1,'createbigcannons:cast_iron_cannon_barrel',p), pn);

            event.stonecutting(f(1,'createbigcannons:bronze_cannon_end',p), pn);
            event.stonecutting(f(1,'createbigcannons:bronze_sliding_breech',p), pn);
            event.stonecutting(f(1,'createbigcannons:bronze_quickfiring_breech',p), pn);
            event.stonecutting(f(1,'createbigcannons:bronze_cannon_chamber',p), pn);
            event.stonecutting(f(1,'createbigcannons:bronze_cannon_barrel',p), pn);

            event.stonecutting(f(1,'createbigcannons:steel_sliding_breech',p), pn);
            event.stonecutting(f(1,'createbigcannons:steel_quickfiring_breech',p), pn);
            event.stonecutting(f(1,'createbigcannons:steel_screw_breech',p), pn);
            event.stonecutting(f(1,'createbigcannons:thick_steel_cannon_chamber',p), pn);
            event.stonecutting(f(1,'createbigcannons:steel_screw_breech',p), pn);
            event.stonecutting(f(1,'createbigcannons:thick_steel_cannon_chamber',p), pn);
            event.stonecutting(f(1,'createbigcannons:built_up_steel_cannon_chamber',p), pn);
            event.stonecutting(f(1,'createbigcannons:steel_cannon_chamber',p), pn);
            event.stonecutting(f(1,'createbigcannons:built_up_steel_cannon_barrel',p), pn);
            event.stonecutting(f(1,'createbigcannons:steel_cannon_barrel',p), pn);

            event.stonecutting(f(1,'createbigcannons:cannon_builder',p), pn);
            event.stonecutting(f(1,'createbigcannons:cannon_carriage',p), pn);
            event.stonecutting(f(1,'createbigcannons:ram_rod',p), pn);
            event.stonecutting(f(1,'createbigcannons:worm',p), pn);
            event.stonecutting(f(1,'createbigcannons:yaw_controller',p), pn);
        }


        if (p === 'brass_machinery' || p === 'diamond') {
            // 'create_factory_logistics:fluid_mechanism' broken recipe!

            // Brass
			event.stonecutting(f(1,'toms_storage:ts.crafting_terminal',p), pn);
            event.stonecutting(f(1,'create_connected:empty_fan_catalyst',p), pn);
            event.stonecutting(f(1,'createdieselgenerators:chemical_turret',p), pn);
            event.stonecutting(f(1,'createmetallurgy:foundry_mixer',p), pn);
            event.stonecutting(f(1,'create_enchantment_industry:printer',p), pn);
            event.stonecutting(f(1,'moreburners:nickel_coil',p), pn);
            event.stonecutting(f(1,'create_new_age:advanced_energiser',p), pn);										/// MISSING ID
            event.stonecutting(f(1,'create_new_age:advanced_motor',p), pn);
            event.stonecutting(f(1,'createcobblestone:mechanical_generator',p), pn);
            event.stonecutting(f(1,'createsifter:brass_sifter',p), pn);
            event.stonecutting(f(1,'createsifter:advanced_brass_mesh',p), pn);
            event.stonecutting(f(1,'create_factory_logistics:factory_fluid_gauge',p), pn);
            event.stonecutting(f(1,'create:stock_ticker',p), pn);
            event.stonecutting(f(1,'create_mobile_packages:portable_stock_ticker',p), pn);
            event.stonecutting(f(1,'create_connected:brass_gearbox',p), pn);
            event.stonecutting(f(1,'create:rotation_speed_controller',p), pn);
            event.stonecutting(f(1,'create_connected:kinetic_battery',p), pn);
            event.stonecutting(f(1,'create_connected:brake',p), pn);
            event.stonecutting(f(1,'create_connected:inventory_access_port',p), pn);
            event.stonecutting(f(1,'create_connected:inventory_bridge',p), pn);
            event.stonecutting(f(1,'create_connected:redstone_link_wildcard',p), pn);

            event.stonecutting(f(1,'create_factory_logistics:network_link',p), pn);
            event.stonecutting(f(1,'create_connected:fan_blasting_catalyst',p), pn);
            event.stonecutting(f(1,'create_connected:fan_smoking_catalyst',p), pn);
            event.stonecutting(f(1,'create_connected:fan_splashing_catalyst',p), pn);
            event.stonecutting(f(1,'create_connected:fan_haunting_catalyst',p), pn);

            event.stonecutting(f(1,'create_connected:sequenced_pulse_generator',p), pn);
            event.stonecutting(f(1,'escalated:metal_walkway_steps',p), pn);
            event.stonecutting(f(1,'create_fantasizing:compact_hydraulic_engine',p), pn);
            event.stonecutting(f(1,'create_fantasizing:compact_wind_engine',p), pn);
            event.stonecutting(f(1,'create_fantasizing:sturdy_girder',p), pn);
            event.stonecutting(f(1,'create_fantasizing:transporter',p), pn);
            event.stonecutting(f(1,'createmetallurgy:foundry_basin',p), pn);
            event.stonecutting(f(1,'createmetallurgy:white_light_bulb',p), pn);
            event.stonecutting(f(1,'create:adjustable_chain_gearshift',p), pn);
            event.stonecutting(f(1,'create:crushing_wheel',p), pn);
            event.stonecutting(f(1,'create:smart_chute',p), pn);
            event.stonecutting(f(1,'create:smart_fluid_pipe',p), pn);
            event.stonecutting(f(1,'create:flywheel',p), pn);
            event.stonecutting(f(1,'create:clockwork_bearing',p), pn);
            event.stonecutting(f(1,'create:mechanical_crafter',p), pn);
            event.stonecutting(f(1,'create:sequenced_gearshift',p), pn);
            event.stonecutting(f(1,'create:mechanical_arm',p), pn);
            event.stonecutting(f(1,'create:railway_casing',p), pn);
            event.stonecutting(f(1,'create:controller_rail',p), pn);
            event.stonecutting(f(1,'create:track_station',p), pn);
            event.stonecutting(f(1,'create:track_signal',p), pn);
            event.stonecutting(f(1,'create:track_observer',p), pn);
            event.stonecutting(f(1,'create:controls',p), pn);
            event.stonecutting(f(1,'create:brass_funnel',p), pn);
            event.stonecutting(f(1,'create:brass_tunnel',p), pn);
            event.stonecutting(f(1,'create:content_observer',p), pn);
            event.stonecutting(f(1,'create:stockpile_switch',p), pn);
            event.stonecutting(f(1,'create:factory_gauge',p), pn);
            event.stonecutting(f(1,'create:brass_table_cloth',p), pn);
            event.stonecutting(f(1,'create:display_board',p), pn);
            event.stonecutting(f(1,'create:stock_link',p), pn);
            event.stonecutting(f(1,'create:rose_quartz_lamp',p), pn);
            event.stonecutting(f(1,'extra_gauges:display_collector',p), pn);
            event.stonecutting(f(1,'create:nixie_tube',p), pn);
            event.stonecutting(f(1,'create:placard',p), pn);
            event.stonecutting(f(1,'create:pulse_repeater',p), pn);
            event.stonecutting(f(1,'create:pulse_extender',p), pn);
            event.stonecutting(f(1,'create:pulse_timer',p), pn);
            event.stonecutting(f(1,'create:brown_toolbox',p), pn);
            event.stonecutting(f(1,'create:crafter_slot_cover',p), pn);
            event.stonecutting(f(1,'create:brass_ladder',p), pn);
            event.stonecutting(f(1,'delivery_director:package_rewriter',p), pn);
            event.stonecutting(f(1,'create:brass_scaffolding',p), pn);
            event.stonecutting(f(1,'create:white_seat',p), pn);
            event.stonecutting(f(1,'create:red_seat',p), pn);
            event.stonecutting(f(1,'create:black_seat',p), pn);
            event.stonecutting(f(1,'create:light_blue_seat',p), pn);
            event.stonecutting(f(1,'create:lime_seat',p), pn);
            event.stonecutting(f(1,'create:train_door',p), pn);
            event.stonecutting(f(1,'create:brass_door',p), pn);
            event.stonecutting(f(1,'create:train_trapdoor',p), pn);
            event.stonecutting(f(1,'extra_gauges:display_collector',p), pn);
            event.stonecutting(f(1,'extra_gauges:logic_gauge',p), pn);
            event.stonecutting(f(1,'extra_gauges:integer_gauge',p), pn);
            event.stonecutting(f(1,'extra_gauges:comparator_gauge',p), pn);
            event.stonecutting(f(1,'extra_gauges:counter_gauge',p), pn);
            event.stonecutting(f(1,'extra_gauges:passive_gauge',p), pn);
            event.stonecutting(f(1,'extra_gauges:string_gauge',p), pn);
            event.stonecutting(f(1,'extra_gauges:integer_selector',p), pn);

            event.stonecutting(f(1,'balancedflight:flight_anchor',p), pn);
            event.stonecutting(f(1,'create_refilling_boxes:brass_refilling_box',p), pn);
            event.stonecutting(f(1,'storagedrawers:emerald_storage_upgrade',p), pn);
            event.stonecutting(f(1,'createbigcannons:autocannon_ammo_container',p), pn);
            event.stonecutting(f(1,'create_sa:drone_controller',p), pn);


            // Diesel?
            event.stonecutting(f(1,'createdieselgenerators:huge_diesel_engine',p), pn);
            event.stonecutting(f(1,'createdieselgenerators:diesel_engine',p), pn);
            event.stonecutting(f(1,'createdieselgenerators:large_diesel_engine',p), pn);
            event.stonecutting(f(1,'createdieselgenerators:burner',p), pn);

            // Where to put these?
            event.stonecutting(f(1,'create_new_age:basic_motor_extension',p), pn);
            event.stonecutting(f(1,'create_new_age:heater',p), pn);
            event.stonecutting(f(1,'create_new_age_accumulators:lithium_ion_accumulator',p), pn);
            event.stonecutting(f(1,'create_new_age_accumulators:nickel_cadmium_accumulator',p), pn);
        }


        if (p === 'diamond') {
            // Diamond pack
            event.stonecutting(f(1,'create_new_age:reinforced_motor',p), pn);
            event.stonecutting(f(1,'create_new_age:reinforced_energiser',p), pn); // 4 diamonds, 2 gold
            event.stonecutting(f(1,'create_new_age:advanced_motor_extension',p), pn);
        }

        if (p === 'redstone') {
            // Redstone
            event.stonecutting(f(4,'create:redstone_contact',p), pn); // 1 Redstone
            event.stonecutting(f(4,'create:powered_latch',p), pn); // 3 redstone
            event.stonecutting(f(4,'create:powered_toggle_latch',p), pn);  // 1 redstone

            event.stonecutting(f(4,'projectred_integration:or_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:nor_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:not_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:and_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:nand_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:xor_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:xnor_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:buffer_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:multiplexer_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:pulse_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:repeater_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:randomizer_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:sr_latch_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:toggle_latch_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:transparent_latch_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:light_sensor_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:rain_sensor_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:timer_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:sequencer_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:counter_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:stacking_latch_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:segment_display_gate',p), pn);
            event.stonecutting(f(4,'projectred_integration:dec_randomizer_gate',p), pn);
            event.stonecutting(f(4,'projectred_fabrication:ic_blueprint',p), pn);
            event.stonecutting(f(4,'projectred_fabrication:packaging_table',p), pn);
            event.stonecutting(f(4,'projectred_fabrication:plotting_table',p), pn);
            event.stonecutting(f(4,'projectred_fabrication:lithography_table',p), pn);
            event.stonecutting(f(4,'projectred_transmission:red_alloy_wire',p), pn);
            event.stonecutting(f(4,'projectred_transmission:white_insulated_wire',p), pn);
            event.stonecutting(f(4,'projectred_transmission:light_blue_insulated_wire',p), pn);
            event.stonecutting(f(4,'projectred_transmission:yellow_insulated_wire',p), pn);
            event.stonecutting(f(4,'projectred_transmission:lime_insulated_wire',p), pn);
            event.stonecutting(f(4,'projectred_transmission:gray_insulated_wire',p), pn);
            event.stonecutting(f(4,'projectred_transmission:blue_insulated_wire',p), pn);

            event.stonecutting(f(16,'minecraft:redstone_torch',p), pn);
            event.stonecutting(f(4,'minecraft:repeater',p), pn);
            event.stonecutting(f(4,'minecraft:comparator',p), pn);
            event.stonecutting(f(1,'redstonepen:control_box',p), pn);
            event.stonecutting(f(4,'redstonepen:relay',p), pn);
            event.stonecutting(f(4,'minecraft:redstone_lamp',p), pn);
        }


        if (p === 'kitchen') {
            // Redstone
            event.stonecutting(f(1,'cookingforblockheads:toaster',p), pn);
            event.stonecutting(f(1,'cookingforblockheads:milk_jar',p), pn);
            event.stonecutting(f(1,'cookingforblockheads:spice_rack',p), pn);
            event.stonecutting(f(8,'cookingforblockheads:tool_rack',p), pn);
            event.stonecutting(f(8,'cookingforblockheads:fruit_basket',p), pn);
            event.stonecutting(f(1,'cookingforblockheads:cooking_table',p), pn);
            event.stonecutting(f(1,'cookingforblockheads:fridge',p), pn);
            event.stonecutting(f(1,'cookingforblockheads:sink',p), pn);
            event.stonecutting(f(4,'cookingforblockheads:counter',p), pn);
            event.stonecutting(f(4,'cookingforblockheads:cabinet',p), pn);
            event.stonecutting(f(4,'cookingforblockheads:corner',p), pn);
            event.stonecutting(f(4,'cookingforblockheads:hanging_corner',p), pn);
            event.stonecutting(f(8,'cookingforblockheads:white_kitchen_floor',p), pn);
            event.stonecutting(f(1,'cookingforblockheads:oven',p), pn);
            event.stonecutting(f(1,'cookingforblockheads:preservation_chamber',p), pn);
            event.stonecutting(f(1,'cookingforblockheads:heating_unit',p), pn);
            event.stonecutting(f(1,'cookingforblockheads:ice_unit',p), pn);
            event.stonecutting(f(1,'farmersdelight:stove',p), pn);
            event.stonecutting(f(1,'farmersdelight:cooking_pot',p), pn);
            event.stonecutting(f(1,'farmersdelight:skillet',p), pn);
            event.stonecutting(f(2,'farmersdelight:cutting_board',p), pn);
        }
    }

    // TODO Builders Unipack
    // All building materials
});

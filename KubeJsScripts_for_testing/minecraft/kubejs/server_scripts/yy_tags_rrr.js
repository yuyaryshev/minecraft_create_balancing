ServerEvents.tags('item', event => {
    event.add('yyitems:rrr', 'yyitems:redstone_unipack');
    
    // All redstone blocks should be here
	// To select redstone blocks use '#rrr' in JEI 
    event.add('yyitems:rrr', 'minecraft:redstone');
    event.add('yyitems:rrr', 'minecraft:redstone_torch');
    event.add('yyitems:rrr', 'minecraft:repeater');
    event.add('yyitems:rrr', 'minecraft:comparator');
    event.add('yyitems:rrr', 'minecraft:redstone_lamp');
    event.add('yyitems:rrr', 'create:redstone_contact');
    event.add('yyitems:rrr', 'create:powered_latch');
    event.add('yyitems:rrr', 'create:powered_toggle_latch');
    event.add('yyitems:rrr', 'projectred_integration:or_gate');
    event.add('yyitems:rrr', 'projectred_integration:nand_gate');
    event.add('yyitems:rrr', 'projectred_transmission:red_alloy_wire');
    event.add('yyitems:rrr', 'projectred_transmission:white_insulated_wire');
    event.add('yyitems:rrr', 'projectred_transmission:blue_insulated_wire');
    event.add('yyitems:rrr', 'create:analog_lever');
    event.add('yyitems:rrr', 'create:stock_ticker');
    event.add('yyitems:rrr', 'create_mobile_packages:portable_stock_ticker');
    event.add('yyitems:rrr', 'create:stockpile_switch');
    event.add('yyitems:rrr', 'create:content_observer');
    event.add('yyitems:rrr', 'botania:mana_detector');
    event.add('yyitems:rrr', 'botania:red_string');
    event.add('yyitems:rrr', 'botania:red_string_comparator');
    event.add('yyitems:rrr', 'botania:red_string_container');
    event.add('yyitems:rrr', 'botania:red_string_dispenser');
    event.add('yyitems:rrr', 'botania:red_string_fertilizer');
    event.add('yyitems:rrr', 'botania:red_string_interceptor');
    event.add('yyitems:rrr', 'botania:red_string_relay');
    event.add('yyitems:rrr', 'botania:mana_fluxfield');
    event.add('yyitems:rrr', 'botania:redstone_spreader');

    event.add('yyitems:rrr', 'adminshop:adv_detector');
    event.add('yyitems:rrr', 'aquaculture:redstone_hook');
    event.add('yyitems:rrr', 'bobberdetector:bobber_detector');
    event.add('yyitems:rrr', 'create:mysterious_cuckoo_clock');
    event.add('yyitems:rrr', 'create:pulse_extender');
    event.add('yyitems:rrr', 'create:pulse_repeater');
    event.add('yyitems:rrr', 'create:pulse_timer');
    event.add('yyitems:rrr', 'create:redstone_link');
    event.add('yyitems:rrr', 'create:redstone_requester');
    event.add('yyitems:rrr', 'create_connected:redstone_link_wildcard');
    event.add('yyitems:rrr', 'create_new_age:overcharged_diamond_wire');
    event.add('yyitems:rrr', 'create_new_age:overcharged_iron_wire');
    event.add('yyitems:rrr', 'create_new_age:redstone_magnet');
    event.add('yyitems:rrr', 'createbigcannons:spring_wire');
    event.add('yyitems:rrr', 'createmechanicalcompanion:optical_sensor');
    event.add('yyitems:rrr', 'createmetallurgy:tungsten_wire');
    event.add('yyitems:rrr', 'createmetallurgy:tungsten_wire_spool');
    event.add('yyitems:rrr', 'extra_gauges:comparator_gauge');
    event.add('yyitems:rrr', 'extra_gauges:logic_gauge');
    event.add('yyitems:rrr', 'gateways:gate_pearl');
    event.add('yyitems:rrr', 'minecraft:calibrated_sculk_sensor');
    event.add('yyitems:rrr', 'minecraft:daylight_detector');
    event.add('yyitems:rrr', 'minecraft:detector_rail');
    event.add('yyitems:rrr', 'minecraft:redstone_ore');
    event.add('yyitems:rrr', 'minecraft:sculk_sensor');
    event.add('yyitems:rrr', 'minecraft:tripwire_hook');
    event.add('yyitems:rrr', 'redstonepen:basic_lever');
    event.add('yyitems:rrr', 'redstonepen:bridge_relay');
    event.add('yyitems:rrr', 'redstonepen:control_box');
    event.add('yyitems:rrr', 'redstonepen:inverted_relay');
    event.add('yyitems:rrr', 'redstonepen:pen');
    event.add('yyitems:rrr', 'redstonepen:pulse_relay');
    event.add('yyitems:rrr', 'redstonepen:quill');
    event.add('yyitems:rrr', 'redstonepen:relay');
    event.add('yyitems:rrr', 'redstonepen:track');
    event.add('yyitems:rrr', 'storagedrawers:redstone_upgrade');
    event.add('yyitems:rrr', 'supplementaries:iron_gate');
    event.add('yyitems:rrr', 'supplementaries:redstone_illuminator');
    event.add('yyitems:rrr', 'supplementaries:sconce_lever');
    event.add('yyitems:rrr', 'toms_storage:ts.adv_wireless_terminal');
    event.add('yyitems:rrr', 'toms_storage:ts.inventory_cable');
    event.add('yyitems:rrr', 'toms_storage:ts.inventory_cable_connector');
    event.add('yyitems:rrr', 'toms_storage:ts.inventory_cable_connector_filtered');

});


/*
I've came up with an idea that it would be great to see only usefull items in JET.
...But what is useful? I think there should be some categories that I want to see.

Please help me populating this lists


ServerEvents.tags('item', event => {
    // All non decorative, create (and accompanied mods) here
    // Also should include all basic automation blocks from minecraft (piston, dispenset, etc)
    event.add('yyitems:ccc','create:gearshift');
    event.add('yyitems:ccc','create:encased_chain_drive');

    // All non decorative, 'mainline' botania blocks and items
    event.add('yyitems:bbb','botania:mana_pool');

    // All non redstone blocks should be here
    event.add('yyitems:rrr','minecraft:redstone');

    // Variations. All variations except for the wood or color variation of an item should have this tag.
    // This way one can use '-#vvv' in JEI to get rid of all variations in search result (while keeping the first one)
    event.add('yyitems:vvv', 'minecraft:spruce_log');

    // All foods and foods only. Not ingredients, not kitchen tools.
    event.add('yyitems:fff','minecraft:bread');

    // Armors
    //event.add('yyitems:aaa', 'minecraft:bread');

    // Weapons
    //event.add('yyitems:www', 'minecraft:bread');

    // Decoratives
    //event.add('yyitems:ddd', 'minecraft:bread');

});
// Other ids go here in comments, I'll decide what to do with them later.


// Get only ids that you find in my other script below, then put that ids to correct categories.
// If an item doesn't have any good category to go to - just skip it and put into list "others"
// Please note that you should use exactly this syntax event.add('tag', 'item_id'); - because kubejs doesn't support arrays in any of these parameters.
*/
ServerEvents.tags('item', event => {
    // All non decorative, 'mainline' botania blocks and items
    // To select botania use '#bbb' in JEI 
    event.add('yyitems:bbb', 'botania:mana_pool');
    event.add('yyitems:bbb', 'botania:mana_spreader');
    event.add('yyitems:bbb', 'botania:runic_altar');
    event.add('yyitems:bbb', 'botania:apothecary_default');
    event.add('yyitems:bbb', 'botania:terrasteel_agglo_tablet');
    event.add('yyitems:bbb', 'botania:agricarnation');
    event.add('yyitems:bbb', 'botania:agricarnation_chibi');
    event.add('yyitems:bbb', 'botania:bellows');
    event.add('yyitems:bbb', 'botania:bellethorn');
    event.add('yyitems:bbb', 'botania:bellethorn_chibi');
    event.add('yyitems:bbb', 'botania:bergamute');
    event.add('yyitems:bbb', 'botania:brewery');
    event.add('yyitems:bbb', 'botania:bubbell');
    event.add('yyitems:bbb', 'botania:bubbell_chibi');
    event.add('yyitems:bbb', 'botania:clayconia');
    event.add('yyitems:bbb', 'botania:clayconia_chibi');
    event.add('yyitems:bbb', 'botania:conjuration_catalyst');
    event.add('yyitems:bbb', 'botania:corporea_funnel');
    event.add('yyitems:bbb', 'botania:corporea_index');
    event.add('yyitems:bbb', 'botania:corporea_interceptor');
    event.add('yyitems:bbb', 'botania:corporea_retainer');
    event.add('yyitems:bbb', 'botania:crafty_crate');
    event.add('yyitems:bbb', 'botania:dandelifeon');
    event.add('yyitems:bbb', 'botania:daffomill');
    event.add('yyitems:bbb', 'botania:endoflame');
    event.add('yyitems:bbb', 'botania:entropinnyum');
    event.add('yyitems:bbb', 'botania:exoflame');
    event.add('yyitems:bbb', 'botania:hopperhock');
    event.add('yyitems:bbb', 'botania:hopperhock_chibi');
    event.add('yyitems:bbb', 'botania:jaded_amaranthus');
    event.add('yyitems:bbb', 'botania:kekimurus');
    event.add('yyitems:bbb', 'botania:loonium');
    event.add('yyitems:bbb', 'botania:marimorphosis');
    event.add('yyitems:bbb', 'botania:marimorphosis_chibi');
    event.add('yyitems:bbb', 'botania:munchdew');
    event.add('yyitems:bbb', 'botania:narslimmus');
    event.add('yyitems:bbb', 'botania:orechid');
    event.add('yyitems:bbb', 'botania:orechid_ignem');
    event.add('yyitems:bbb', 'botania:pollidisiac');
    event.add('yyitems:bbb', 'botania:rosa_arcana');
    event.add('yyitems:bbb', 'botania:solegnolia');
    event.add('yyitems:bbb', 'botania:solegnolia_chibi');
    event.add('yyitems:bbb', 'botania:spectranthemum');
    event.add('yyitems:bbb', 'botania:spectrolus');
    event.add('yyitems:bbb', 'botania:thermalily');
    event.add('yyitems:bbb', 'botania:vinculotus');
    event.add('yyitems:bbb', 'botania:alchemy_catalyst');
    event.add('yyitems:bbb', 'botania:auto_crafting_halo');
    event.add('yyitems:bbb', 'botania:avatar');
    event.add('yyitems:bbb', 'botania:corporea_spark');
    event.add('yyitems:bbb', 'botania:corporea_spark_master');
    event.add('yyitems:bbb', 'botania:corporea_spark_creative');
    event.add('yyitems:bbb', 'botania:elven_spreader');
    event.add('yyitems:bbb', 'botania:gaia_spreader');
    event.add('yyitems:bbb', 'botania:mana_distributor');
    event.add('yyitems:bbb', 'botania:mana_pylon');
    event.add('yyitems:bbb', 'botania:mana_void');
    event.add('yyitems:bbb', 'botania:terra_plate');
    event.add('yyitems:bbb', 'botania:mana_mirror');
    event.add('yyitems:bbb', 'botania:lexicon');
    
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
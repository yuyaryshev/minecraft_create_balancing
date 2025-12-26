// yy_replace_iron_with_andesite.js
// Converts iron ingredients in selected recipes to andesite equivalents

let woodTypes = ["acacia", "birch", "crimson", "dark_oak", "jungle", "oak", "spruce", "warped"];

ServerEvents.recipes(event => {	
    event.smelting(`create:andesite_alloy`,`yyitems:raw_andesite_alloy_powder`);
	
	event.shaped("flopper:flopper", [
            'SBS',
            ' S ',
            '   '
        ],
        {
            S:'yyitems:andesite_sheet',
            B:'copper_bucket_mod:copper_bucket'
        }
    );
	
	event.shaped("flopper:flopper", [
            'SBS',
            ' S ',
            '   '
        ],
        {
            S:'yyitems:andesite_sheet',
            B:'ceramics:empty_clay_bucket'
        }
    );
	
	event.shaped("flopper:flopper", [
            'SBS',
            ' S ',
            '   '
        ],
        {
            S:'yyitems:andesite_sheet',
            B:'woodenbucket:wooden_bucket'
        }
    );
	
	event.recipes.create.compacting(['minecraft:andesite'], [Fluid.water(100), 'minecraft:cobblestone']);
	event.recipes.create.mixing(['minecraft:dirt'], [Fluid.water(200), 'minecraft:gravel']);
	event.recipes.create.mixing(['minecraft:clay_ball','minecraft:clay_ball','minecraft:clay_ball','minecraft:clay_ball'], [Fluid.water(200), 'minecraft:dirt']);

	
	event.remove({ output: 'create_new_age:thorium'});
	event.recipes.create.mixing(['create_new_age:radioactive_thorium','create_new_age:thorium'], 
		['create_new_age:radioactive_thorium','minecraft:cobblestone',Fluid.water(1000)]);
	
	event.replaceOutput(
		{ 
			output: 'create_new_age:radioactive_thorium'
		},
		'minecraft:iron_nugget',
		'yyitems:andesite_nugget',
	);
	
	
	event.replaceInput({ mod:'create', id: /goggles/ }, "create:golden_sheet", "create:copper_sheet");
    event.replaceInput({ mod:'create', id: /wrench/ }, "create:golden_sheet", "create:copper_sheet");
    event.replaceInput({ output: 'create_refilling_boxes:andesite_refilling_box' }, "create:golden_sheet", "yyitems:andesite_sheet");

    event.replaceInput({ output: 'toms_storage:ts.storage_terminal' }, "minecraft:glowstone", "yyitems:andesite_sheet");
    event.replaceInput({ output: 'toms_storage:ts.storage_terminal' }, "minecraft:comparator", "create:andesite_alloy");
    event.replaceInput({ output: 'toms_storage:ts.wireless_terminal' },"minecraft:glowstone", "yyitems:andesite_sheet");
    event.replaceInput({ output: 'toms_storage:ts.wireless_terminal' },"minecraft:comparator", "create:andesite_alloy");
    event.replaceInput({ output: 'toms_storage:ts.wireless_terminal' },"minecraft:ender_pearl", "yyitems:andesite_sheet");
    //event.replaceInput({ output: 'toms_storage:ts.crafting_terminal' }, "minecraft:diamond", "#minecraft:planks");
    event.replaceInput({ output: 'create_new_age:basic_motor' }, "minecraft:iron_nugget", "yyitems:andesite_nugget");
    event.replaceInput({ output: 'minecraft:stonecutter' }, "minecraft:iron_ingot", "yyitems:andesite_sheet");

    // Cheaper wood automation
    event.replaceInput({ id: "create:crafting/kinetics/brass_hand" }, "create:brass_sheet", "create:copper_sheet");
    event.replaceInput({ id: "create:crafting/kinetics/brass_hand" }, "create:electron_tube", "create:cogwheel");

    event.replaceInput({ output: "cookingforblockheads:toaster" }, "minecraft:iron_trapdoor", "yyitems:andesite_sheet");
    event.remove({ output: "cookingforblockheads:fridge" });
    event.shaped("cookingforblockheads:fridge", [
            'CAA',
            ' AA',
            ' AA'
        ],
        {
            A:'yyitems:andesite_sheet',
            C:'minecraft:chest'
        }
    );



    event.blasting("minecraft:coal", "minecraft:charcoal");
	
    event.recipes.create.pressing('2x create:belt_connector',"minecraft:dried_kelp_block");
    
	woodTypes.map((woodType) =>
        event.custom({
            type: "create:cutting",
            ingredients: [
                {
                    item: `minecraft:${woodType}_planks`,
                },
            ],
            results: [
                {
                    item: `minecraft:${woodType}_button`,
                    count: 2,
                },
            ],
            processingTime: 100,
        }),
    );
});

LootJS.modifiers((event) => {
    event
        .addBlockLootModifier(`minecraft:coal_ore`)
        .addLoot("yyitems:raw_andesite_alloy_powder");

    event
        .addBlockLootModifier(`minecraft:deepslate_coal_ore`)
        .addLoot("yyitems:raw_andesite_alloy_powder");

    event
        .addBlockLootModifier(`deeperdarker:gloomslate_coal_ore`)
        .addLoot("yyitems:raw_andesite_alloy_powder");

    event
        .addBlockLootModifier(`undergarden:depthrock_coal_ore`)
        .addLoot("yyitems:raw_andesite_alloy_powder");

    event
        .addBlockLootModifier(`deeperdarker:sculk_stone_coal_ore`)
        .addLoot("yyitems:raw_andesite_alloy_powder");

    event
        .addBlockLootModifier(`undergarden:shiverstone_coal_ore`)
        .addLoot("yyitems:raw_andesite_alloy_powder");
});


// yy_replace_iron_with_andesite.js
// Converts iron ingredients in selected recipes to andesite equivalents

ServerEvents.recipes(event => {	
	event.replaceOutput(
		{ 
			output: 'minecraft:crafting_table'
		},
		'minecraft:crafting_table',
		'yy_mechanical_workbench:mechanical_workbench',
	);
});



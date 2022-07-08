import {getDictionaries, refreshDictionaries, searchAllDictionaries} from "../dictionaries.js";
import {validateAllKubeJsScripts} from "../validate_kubejs_scripts.js";

//refreshDictionaries();
validateAllKubeJsScripts();
// console.table(searchAllDictionaries('belt','create'));
// 'minecraft:dried_kelp_block'
console.table(searchAllDictionaries('occultism','silver'));
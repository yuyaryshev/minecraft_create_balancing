## Goal
Build an offline Node.js runner for KubeJS scripts that:
- Loads a snapshot of Minecraft runtime data from logs (step 1).
- Executes KubeJS scripts offline against that snapshot (step 2).
- Reports errors with file/line when:
  - an event handler does not make any changes, or
  - a referenced item/recipe id does not exist in the snapshot.

## Initial Findings (KubeJS sources)
- Globals are added via `BindingRegistry` during `KubeJSContext` init. See `KubeJSCodeForReference/KubeJS-main/src/main/java/dev/latvian/mods/kubejs/plugin/builtin/BuiltinKubeJSPlugin.java`.
- Event groups (e.g. `ServerEvents`) are exposed as `EventGroupWrapper`, which returns a function-like `EventHandler` per event name. Event registration happens by calling the handler as a function (`ServerEvents.recipes(...)`).
- `EventHandler.call(...)` registers listeners during script loading; it captures source file/line via `Context.getSourcePositionFromStack(...)`.
- Local scripts use `ServerEvents.recipes`, `ServerEvents.tags('item', ...)`, `LootJS.modifiers`, and a few `PlayerEvents`/`ItemEvents` handlers. Common recipe APIs include `event.remove`, `event.replaceInput`, `event.replaceOutput`, `event.shaped`, `event.shapeless`, `event.smelting`, `event.blasting`, `event.custom`, `event.forEachRecipe`, and `event.recipes.<mod>.<type>()` with chainers like `.heated()` and `.processingTime()`.
- Item helpers seen: `Item.of(id, countOrNbt).withChance(p)`; fluid helper: `Fluid.water(amount)`.

## Plan
1) Inventory the KubeJS APIs used by local scripts and map to minimal offline shims.
2) Define snapshot JSON format (items, tags, recipes, recipe types, etc.) and log extraction flow.
3) Implement offline runner core:
   - load snapshot + metadata
   - set up globals and event registration
   - execute scripts in a VM with source file names
4) Implement error collection rules (no-op event handlers, missing IDs) with filename/line.
5) Validate with sample scripts and document how to update snapshots.

## Progress Notes
- Implemented snapshot loader with log markers and cache metadata.
- Implemented offline runner shims for ServerEvents recipes/tags, LootJS modifiers, Item.of, and Fluid.water.
- Added validation for missing item/tag/recipe ids and no-op events.
- Test attempt: `npm run build:ts` failed due to missing npm-prefix.js in Volta install (see CLI output).
- Added KubeJS dump script at `G:\G_minecraft\minecraft\minecraft_prism_launcher_ely_by\instances\yy_modpack_1_20_forge\minecraft\kubejs\server_scripts\offline_dump.js` to emit snapshot JSON into logs.
- Snapshot extractor can now fall back to cached snapshot if the log file is missing (supports offline-only runs).
- Tag validation is skipped when no tag data is present; error list now de-duplicates identical findings.
- Test run (filtered to `yy_replace_iron_with_andesite.js`) executes without script errors; remaining errors are `missing_recipe`/`missing_item` for ids not found in the snapshot (likely genuine invalid ids or recipe-vs-item mix-ups in the script).
- Full test run shows missing shims for `event.stonecutting(...)` and `ItemFilter` used in LootJS modifiers; many missing item ids in tag scripts look like actual missing content in the snapshot/modpack.
- Implemented shims for `event.stonecutting`, `ItemFilter`, `LootJS` modifier chaining helpers, and added common globals (Utils, Platform, ID, JsonIO/JsonUtils, StringUtils, Java, KMath).
- Full test run now completes without `script_error`; remaining errors are missing items/recipes/blocks (likely real data gaps vs snapshot).

## Open Questions
- Where exactly in logs the runtime snapshot JSON is dumped (format + marker)?
- Which registries/tags are required for validation in your scripts (items, tags, recipe ids, recipe types)?

## Proposed Snapshot Shape (draft)
```json
{
  "meta": {
    "logPath": "C:/.../logs/latest.log",
    "logSize": 123456,
    "logMtimeMs": 1700000000000,
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "items": ["minecraft:stone", "..."],
  "tags": { "item": { "forge:ingots/iron": ["minecraft:iron_ingot"] } },
  "recipeTypes": ["minecraft:smelting", "create:mixing"],
  "recipes": [
    { "id": "minecraft:iron_ingot", "type": "minecraft:smelting", "outputs": ["minecraft:iron_ingot"] }
  ],
  "fluids": ["minecraft:water"],
  "blocks": ["minecraft:stone"]
}
```
Notes:
- `recipes[].outputs` is needed for filters like `{ output: "id" }`.
- Only include registries your scripts reference; missing lists will skip validation.

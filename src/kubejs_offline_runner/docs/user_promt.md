(initial promt - already implemented)
Please help me with the following task:
I want to make an offline nodejs runner for kubejs scripts, to be able to test scripts fast and efficiently.

How should it has just 2 steps basically:
1) First step is execution of special dumping_script using minecraft kubejs. This script should dump all the data from minecraft in runtime so then next step will have actual recipes, item ids, recipe types etc... All this should be saved to log as single JSON data object
2) Second step - writing and testing kubejs scripts offline (i.e. without running minecraft).
Every time a programmer wants to test his kubejs scripts - he just run this step (2). If he installed some other mods - he have to run step from (1).

Here, we first check that minecraft's log file is old, this means that there was no fresh runs of minecraft after last time this utility was started. If log is new, we start with extracting data from logs: that JSON that we saved on step (1).
We then re-save this JSON togather with metadata of log file - it's size and last changed timestamp.

This way should create a snapshot of all objects inside game with which KubeJS can work.

Now to the runner: we should find and run all kubejs scripts, provide this scripts with the same data which was in runtime and then check for errors.

What is considered an error?
- When there is a portion of js script that triggers any event.METHOD of kubejs, but doesn't change anything - this is an error.
- When there is an item id or a recipe id that is not found in game - it's an error too.

All this errors should be logged into an array and then printed to console, togather with script's filename and line number.

But the difference it all makes is that I can start this runner in nodejs debugger and see all intermediate values there.

Now, I've already started creating this runner under 
src\kubejs_offline_runner

I've also downloaded and provide you with KubeJs sources:
KubeJSCodeForReference

And some mine kubejs scripts that you can try this runner on:
KubeJsScripts_for_testing

The key problem I struggle with is that we have to investigate (inside kubejs sources) on how kubejs creates all thouse internal objects and functions that it passes to kubejs scripts. And then they have to be recreated and repopulated inside kubejs_offline_runner.
I need you help with this very task.


---
(new promt - this is what need to be done now)
Now I need you to create an express + react (vite + ariakit + vanilla css) for kubejs_offline_runner that does the following: it should accept requests and send client mostly static html page: with itemIds, tags, recipes including inputs and outputs of them, blocks, and all the rest from dump and UI that has search for itemId, tags,recipes, etc. When user enters an search query it should find by partial match to id or name of that item using 'match-sorter' package. There should also be checkboxes to include ingredients (search for recipe by it's ingredient) same for output. Then it displays first 3 matches and total count of recipes, itemids, blocks, tags, etc. All this search should happen without involving backend - all the data should be stored on client side (because this is single user app, there is no need to overcomplicate it). Next thing, below that search should be errors that are found by kubejs_offline_runner - this data should be sent from server to client.  Server should implement the following endpoints: GET errors - should return error list, GET errors_wait - long poll for 5 seconds, returns timestamp when last change occured - this allows client side to update only when changes really take place. Simmilar endpoints should exist for retriving new dump, POST endpoints should exist to implement commands simmilar to cli variants. There should be buttons for them on UI. Server side should call existing runner code to find errors and store that errors into runtime array, then - return them on GET request.  Server side should also watch for changes of kubejs scripts and for minecraft instance logs.
The last thing that this app should be capable of is selecting location of minecraft instance that is being watched. This location and location of dumped item ids, recipes, itemids, blocks, etc, - should be stored into settings file. I hope that this project at some point will be distributed as an npm package and should have the following capabilities:
- From command line
	- `select` - Select instance of minecraft it runs on
	- `install_dump_script` - Write dump script to selected instance and tell user that he should now run minecraft instance
	- `extract_dump` Read log file and extract last dump from it.
		- When start parse log and should store internally timestamp of when log file was created and last timestamp record it read from it. Store it to some internal file.
		- Always returns after attempt to read the script.
		- Always checks for kube js errors - related to dump_script and users errors too. User's kubejs errors - just save them, but for now they have no use, - they might be used later for some new features.
		- The command should read new messages from log and detect if `/reload` was or wasn't called by user.
		- If dump was taken and no errors on dump_script side then this command should store new dump. If there are errors - it should report them to command line togather with information when last time it attempted but failed to dump.
	- `check` - should try to run kubejs scripts offline, supplying them with data from dump. Should save errors internally and also display them to console.
	- `watch` - should start back-end - front-end server that i've described above.

I've also decided to move project to separate git repo, it's already initialized with vite template here (new project location): 
D:\b\Mine\GIT_Work\minecraft\kubejs_offline_runner

Old project location:
D:\b\Mine\GIT_Work\minecraft\minecraft_create_balancing\src\kubejs_offline_runner

Please help me migrating project to this new location. Note that babel's watch and typescript compilation script shoud be moved there too. Note that old project only had backend part, new one will have backend and front end.

---

I expect that you plan, do, and test this task. Please help me.

This promt is also saved there inside docs kubejs_offline_runner/docs/user_promt.md, so you don't have to hold it inside context entirely - just save a not for yourself to review it when you plan next steps.

This is quite a complex task so please create kubejs_offline_runner/docs folder and write a more condensed version of this to plan.md there with your thoughts and tasks/plans what is to be done. Then update it while you progress.

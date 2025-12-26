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

---

Now, I've already started creating this runner under 
src\kubejs_offline_runner

I've also downloaded and provide you with KubeJs sources:
KubeJSCodeForReference

And some mine kubejs scripts that you can try this runner on:
KubeJsScripts_for_testing

The key problem I struggle with is that we have to investigate (inside kubejs sources) on how kubejs creates all thouse internal objects and functions that it passes to kubejs scripts. And then they have to be recreated and repopulated inside kubejs_offline_runner.
I need you help with this very task.

This is quite a complex task so please create kubejs_offline_runner/docs folder and write plan.md there with your thoughts and plans and update it while you progress.

I expect that you plan, do, and test this task. Please help me.

This promt is also saved there inside docs kubejs_offline_runner/docs/user_promt.md, so you don't have to hold it inside context entirely - just save a not for yourself to review it when you plan next steps.
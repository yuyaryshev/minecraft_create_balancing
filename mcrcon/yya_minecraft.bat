@echo off
@cls

set host=194.61.1.164
set port=14001

@set /p passwd="Enter password for Yya Minecraft: "
@if "%passwd%"=="" set passwd=

@echo.
mcrcon.exe -t -H %host% -P %port% -p %passwd%
@echo.

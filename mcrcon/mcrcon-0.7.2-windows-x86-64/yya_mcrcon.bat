@set host=194.61.1.164
@set port=14001
@set /p passwd="Connecting to Minecraft %host%:%port% Enter password: "
mcrcon.exe -t -H %host% -P %port% -p %passwd%

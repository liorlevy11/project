@echo off
setlocal

REM Set the path to JMeter executable
set JMETER_PATH=%~dp0..\bin\apache-jmeter-5.6.3\bin\jmeter.bat

REM Set the path to your JMX test plan directory
set TEST_PLAN_DIR=%~dp0..\testplans

REM Set the name of your JMX test plan file
set TEST_PLAN_FILE=Test_Plan_Average_Capacity_Test.jmx

REM Construct the full path to the test plan file
set TEST_PLAN=%TEST_PLAN_DIR%\%TEST_PLAN_FILE%

REM Set the path to your CSV data file
set DATA_FILE=%~dp0..\dependencies\users.csv

REM Set the path to your directory of executable files
set EXEC_DIR=%~dp0..\dependencies\exe_files

REM Create a results directory if it doesn't exist
if not exist "%~dp0..\results" mkdir "%~dp0..\results"

REM Set the path to the results file
set RESULTS_FILE=%~dp0..\results\results.jtl

REM Run JMeter with the specified test plan, data file, and executable files
%JMETER_PATH% -n -t %TEST_PLAN% -l %RESULTS_FILE% -Jdata_file=%DATA_FILE% -Jexec_dir=%EXEC_DIR%

endlocal


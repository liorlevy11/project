# JMeter Test Automation

## Overview

This directory contains all necessary files to run JMeter tests on any Windows machine without additional setup.

## Directory Structure

my-jmeter-tests/
├── bin/
│   └── jmeter 
├── testplans/
│   ├── testplan1.jmx
│   ├── testplan2.jmx
│   └── testplan3.jmx
├── results/
├── dependencies/
│   ├── dict_of_exe_files/
│   │   └── your_executable1.exe
│   │   └── your_executable2.exe
│   └── your_csv_file.csv
├── scripts/
│   └── run_tests.bat
└── README.md

## run the tests:
user can run the Jmeter.bat file, inside the Jmeter app, and choose which test to run with the comfortable GUI of the app.

Or: only on windows:
	go to scripts directory on cmd and run the command: run_tests.bat

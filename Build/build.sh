#!/bin/sh

jake 'build[1,Core]' 			-t &&
jake 'build[2,CoreExtra]' 		-t &&
jake 'build[4,Node]' 			-t &&
jake 'build[8,NodeExtra]' 		-t &&
jake 'build[g,SimpleDOM]' 		-t &&
jake 'build[10,LocalStorage]' 	-t &&
jake 'build[20,Cookies]' 		-t &&
jake 'build[40,CSV.Parser]' 	-t &&
jake 'build[80,JSON.Parser]' 	-t &&
jake 'build[g0,HashRouter]' 	-t &&
jake 'build[100,AutoFix]' 		-t &&
jake 'build[200,Tooltip]' 		-t &&
jake 'build[400,WaitForMe]' 	-t 

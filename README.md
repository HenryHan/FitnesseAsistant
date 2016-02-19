## Synopsis
Scenario Finder for Fitnesse is a chrome extension help those who write Fitnesse tests find the scenarios with hash parameters, and connect expressions quickly with parameters provided.

## Motivation
It is not easy to search for required scenarios(functions) in Fitnesse like other IDE as it is of wiki-style. This tool helps to collect the comment for each scenario, which includes parameter descriptions and examples.

## Installation
We'll use the tool in chrome developer mode instead of publishing it in Chrome web store. Here are the steps to start with it:
1. download the package from github and unzip it.
2. go to Chrome Options->More Tools->Extensions
3. click "Load unpacked extension..."
4. choose the target folder of the unzipped files and click OK

Now you can see an icon on the top right of Chrome. 
Comment tables are required in scenario library before you can search the usage of the scenario using this tool. This is the template of the comment table:
|comment: parameters for !style_blue['''<Scenario Name>''']|
|'''Name'''|'''Mandatory'''|'''Type'''|'''Example'''|'''Remark'''|
|!style_blue[parameter1]|yes|string|"a"|additional information|
|!style_blue[parameter2]|yes|string|"b"|other possible values: "c", "d" or "e"|
|!style_blue[parameter3]|no|array|"aaa","bbb"||

When you are browsing or editing a test in Fitnesse, you can click the icon of the extension, and a right sidebar appears, where you can find the scenario name and its parameters.
Fill in the parameters and click GenerateAndCopy, you'll get a combined string of the expressions for Fitnesse.



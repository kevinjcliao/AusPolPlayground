"use strict";
var request = require('request');
var readline = require('readline');
// Import from other files
var keys_lib = require('./keys');
var keys = new keys_lib.keys();
var TVFY_KEY = keys.getTheyVoteForYou();
var url = 'https://theyvoteforyou.org.au/api/v1/people.json?key=' + TVFY_KEY;
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function getMemberUrl(id) {
    return "https://theyvoteforyou.org.au/api/v1/people/" + id + ".json?key=" + TVFY_KEY;
}
function getYesOrNo(answer) {
    if (answer == "y") {
        request(url, listMembersAndSearch);
    }
    else if (answer == "n") {
        process.exit();
    }
    else {
        rl.question("Please enter 'y' or 'n'. Would you like to search again? (y/n)", getYesOrNo);
    }
}
function getListOfMembers(body) {
    function getName(member) {
        var first_name = member["latest_member"]["name"]["first"];
        var last_name = member["latest_member"]["name"]["last"];
        return first_name + " " + last_name;
    }
    function getId(member) {
        return member["id"];
    }
    function getParty(member) {
        return member["latest_member"]["party"];
    }
    function getIdentity(member) {
        return getId(member) + ": " + getName(member) + "--" + getParty(member);
    }
    var obj_body = JSON.parse(body);
    var names = obj_body.map(getIdentity);
    console.log("List of All");
    console.log(names);
}
function listMembersAndSearch(error, response, body) {
    if (error) {
        return console.log("Error: ", error);
    }
    getListOfMembers(body);
    rl.question("Enter the ID of a member to find more information about: ", findMember);
}
function findMember(id) {
    function parseMemberInformation(error, response, body) {
        if (error) {
            return console.log("Error: ", error);
        }
        var obj_body = JSON.parse(body);
        var parsed_info = "The member you found is: ";
        var first_name = obj_body["latest_member"]["name"]["first"];
        var last_name = obj_body["latest_member"]["name"]["last"];
        parsed_info = parsed_info + first_name + " " + last_name + "\n";
        console.log(parsed_info);
        rl.question("Would you like to search again? (y/n)", getYesOrNo);
        request(url, listMembersAndSearch);
    }
    console.log("Searching for member by id: " + id);
    var member_search_url = getMemberUrl(id);
    request(member_search_url, parseMemberInformation);
}
request(url, listMembersAndSearch);

const request = require('request');
const readline = require('readline');


// Import from other files
import keys_lib = require('./keys');

let keys = new keys_lib.keys();

const TVFY_KEY = keys.getTheyVoteForYou();

const url: string = 'https://theyvoteforyou.org.au/api/v1/people.json?key=' + TVFY_KEY;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout 
});

function getMemberUrl(id: string) {
    return "https://theyvoteforyou.org.au/api/v1/people/" + id + ".json?key=" + TVFY_KEY;
}

function getYesOrNo(answer: string) {
    if (answer=="y") {
        request(url, listMembersAndSearch);
    } else if (answer=="n") {
        process.exit();
    } else {
        rl.question("Please enter 'y' or 'n'. Would you like to search again? (y/n)", getYesOrNo);
    }
}

function getListOfMembers(body: string) {
    function getName(member): string {
        let first_name: string = member["latest_member"]["name"]["first"];
        let last_name: string = member["latest_member"]["name"]["last"];
        return first_name + " " + last_name;
    }

     function getId(member): string {
        return member["id"];
    }

    function getParty(member): string {
        return member["latest_member"]["party"];
    }

    function getIdentity(member): string {
        return getId(member) + ": " + getName(member) + "--" + getParty(member);
    }

    let obj_body = JSON.parse(body);

    const names = obj_body.map(getIdentity);
    console.log("List of All")
    console.log(names);

}

function listMembersAndSearch(error: any, response: Object, body: string) {
        if(error) {
        return console.log("Error: ", error);
    }

    getListOfMembers(body);

    rl.question("Enter the ID of a member to find more information about: ",
        findMember);
}



function findMember(id: string) {
    function parseMemberInformation(error: any, response: Object, body: string){
        if(error) {
            return console.log("Error: ", error);
        }
        const obj_body: Object = JSON.parse(body); 
        let parsed_info: string = "The member you found is: ";
        const first_name: string = obj_body["latest_member"]["name"]["first"];
        const last_name: string = obj_body["latest_member"]["name"]["last"];
        parsed_info = parsed_info + first_name + " " + last_name + "\n";
        console.log(parsed_info);
        
        rl.question("Would you like to search again? (y/n)", getYesOrNo);
        request(url, listMembersAndSearch);
    }
    
    console.log("Searching for member by id: " + id);
    const member_search_url = getMemberUrl(id);
    request(member_search_url, parseMemberInformation);
}

request(url, listMembersAndSearch);


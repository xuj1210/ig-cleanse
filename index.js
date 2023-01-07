// separate file drops for followers and following list
// display diff between lists where each item is a link to the profile (optional add pfp of person)
// add steps describing how to do it (ex. only do it on computer, downloading)s

const listDisplay = document.getElementById("display-list");

const followersInput = document.getElementById("followers-input");
followersInput.addEventListener("change", handleFiles, false);

const followingInput = document.getElementById("following-input");
followingInput.addEventListener("change", handleFiles, false);

let MASTER_LISTS = {};

function handleFiles() {
    const followers = followersInput.files[0];
    const following = followingInput.files[0];

    if (followers && following) {
        followersInput.removeEventListener("change", handleFiles, false);
        followingInput.removeEventListener("change", handleFiles, false);
        const followers = followersInput.files[0];
        const following = followingInput.files[0];
        readFile(followers);
        readFile(following);
    } else {
        console.log("Missing a file");
    }
}

function readFile(file) {
    const reader = new FileReader();
    reader.onload = handleJSON;
    reader.readAsText(file);
}

function handleJSON(event) {
    const str = event.target.result;
    const data = JSON.parse(str);
    for (const prop in data) MASTER_LISTS[prop] = cleanList(data[prop]);
    if (MASTER_LISTS.relationships_followers && MASTER_LISTS.relationships_following) {
        MASTER_LISTS.relationships_followers = new Set(MASTER_LISTS.relationships_followers);
        console.log('WE READY', MASTER_LISTS);
        let diff = MASTER_LISTS.relationships_following.filter(x => !MASTER_LISTS.relationships_followers.has(x))
        for (const name of diff) {
            listDisplay.append(usernameToLI(name));
        }
    }
}

function usernameToLI(username) {
    const user = String(username);
    let ret = document.createElement("li");
    ret.innerHTML = `<a target="_blank" href="https://instagram.com/${user}">${user}</a>`;
    console.log(ret);
    return ret;
}

function cleanList(list) {
    return list.map(val => {
        return val.string_list_data[0].value;
    });
}

const http = require('https');
const fs = require('fs');


// Download File From url
const download = function (url, name) {

    console.log("\x1b[36m", "Downloading " + name + ".zip ...", "\x1b[0m");

    let file = fs.createWriteStream(name + '.zip');
    let request = http.get(url, function (response) {

        response.pipe(file);
        response.on('end', () => {
            console.log("\x1b[32m", "Download of " + name + ".zip finished!", "\x1b[0m")
        });

    }).on('error', function (e) {

        console.log("\x1b[31m", "Got error: " + e.message, "\x1b[0m");

    });
};
// Add Pack (downloading pack from mediafire)
exports.addPack = function (name) {

    let patt = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/);

    if (patt.test(name)) {

        download(name, "external")

    } else http.get("https://download1350.mediafire.com/q7aa9e774jug/oyrbdi6fbpqo1bl/mcscri%27%2B%27pt+packages.json", (res) => {

        res.setEncoding('utf8');
        res.on('data', function (chunk) {

            let packs = JSON.parse(chunk);
            let obj = packs.find(obj => obj.name === name.toLowerCase());

            if (obj && obj.url) {
                console.log(obj.url.slice(0, 17));
                if (obj.url.slice(0, 17) === "https://github.com" || obj.url.slice(0, 16) === "http://github.com") downloadFromRedirectLink(obj.url, obj.name);

                else download(obj.url, obj.name)

            } else {

                let packStr = "";
                packs.forEach((e, i) => {

                    packStr += e.name;
                    if (i !== packs.length - 1) packStr += ", "

                });

                console.log("\x1b[31m", "Your pack was not found! Please use one of these: ", "\x1b[0m");
                console.log("\x1b[36m", packStr, "\x1b[0m")

            }
        });

    }).on('error', function (e) {

        console.log("\x1b[31m", "Got error: " + e.message, "\x1b[0m");

    });
};

// Download File From Redirected-Url (in this programm mostly github.com)
function downloadFromRedirectLink(url, file) {

    http.get(url, function (res) {

        if (res.statusCode !== 302) {  // No redirect

            console.log("error: no redirect found");
            return;

        }

        download(res.headers.location, file);

    }).on('error', function (e) {

        console.log("\x1b[31m", "Got error: " + e.message, "\x1b[0m");

    });
}

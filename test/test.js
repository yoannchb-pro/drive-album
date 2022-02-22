
const GetGoogleDrive = require('../drive-album');
const fs = require('fs');

async function test(){
    const drive = await GetGoogleDrive("1UJ4PiRfyhPelXacznccRoGBPXLDEDvCb", true);
    fs.writeFileSync("test.json", JSON.stringify(drive, undefined, 4));
}

test();
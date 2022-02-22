const got = require("got");

async function GetGoogleDrive(url = "", browse){
    if(!url.includes('http')) {
        url = "https://drive.google.com/drive/folders/" + url + "?usp=sharing"
    }

    const req = await got(url);
    const text = req.body;

    const drive = [];

    const regex = new RegExp(/\["([\d\w-]+?)",\["[\d\w-]+?"\],"(.+?)","(.+?)"/gi);

    let res;
    while((res = regex.exec(text)) != null){
        const isFolder = res[3] == "application/vnd.google-apps.folder";
        const type = isFolder ? "folder" : "image";
        if(!drive.find(e => e.id == res[1]) && (res[3].includes("folder") || res[3].includes("image"))) drive.push({
            id: res[1],
            name: res[2],
            realType: res[3],
            type: type,
            url: isFolder ? `https://drive.google.com/drive/folders/${res[1]}` : `https://lh3.google.com/u/0/d/${res[1]}`
        })
    };

    //inspect all directory
    if(browse){
        let folders = drive.filter(e => e.type == "folder");
        while(folders && folders.length > 0){
            let content = [];
            for(const folder of folders){
                const folderDrive = await GetGoogleDrive(folder.id);
                folder.content = folderDrive;
                content = content.concat(folderDrive);
            }
            folders = content.filter(e => e.type == "folder")
        }
    }

    return drive;
};

module.exports = GetGoogleDrive;
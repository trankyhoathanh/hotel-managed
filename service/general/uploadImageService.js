const isBase64 = require('is-base64')
const util = require('util')
const fs  = require('fs')

function randomString(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getBase64Image(imgData) {
    return imgData.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
}

async function saveImageUpload(data)
{
    if (data.image && isBase64(data.image, { mime: true }))
    {
        let type = data.image.match(/^data:image\/(png|jpeg);base64,/)[1]
        let ext = ''
        switch(type) {
            case "png"  : ext = ".png"
                break
            case "jpeg" : ext = ".jpg"
                break
            default     : ext = ".thanh_file"
                break
        }
        let filename = `${randomString(10)}${ext}`
        let savedFilename = `${global.dirname}/upload/${filename}`

        let fs_writeFile = util.promisify(fs.writeFile)

        await fs_writeFile(savedFilename, getBase64Image(data.image), 'base64')

        data.image = filename
        return data.image
    } else {
        return data.image
    }
}

module.exports = {
    saveImageUpload
}
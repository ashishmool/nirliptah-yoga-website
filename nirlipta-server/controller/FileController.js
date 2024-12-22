const File = require("../models/File");


const uploadFile=async (req, res)=>{

    //Logic to save name in table
    const file = new File({file: req.file.originalname})
    await file.save()

    res.json(req.file)
}

const multipleFile=async (req, res)=>{

    req.files.forEach(async element => {
        const file = new File({file: element.originalname})
        await file.save()
        res.json(req.files)
    })


}


module.exports={
    uploadFile, multipleFile
}
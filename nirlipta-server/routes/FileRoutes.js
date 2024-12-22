const express=require("express")
const router = express.Router()
const multer = require("multer")

const {
    uploadFile, multipleFile
} = require("../controller/FileController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'D:/nirlipta-yoga/nirlipta-server/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage })

router.post("/upload",upload.single("file"),uploadFile)
router.post("/uploads",upload.array("files"),multipleFile)


module.exports=router
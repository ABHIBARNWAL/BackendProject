import multer from "multer";

const storage=multer.diskStorage({
    //where we want to store on local storage
    destination:function(req,file,cb){
        cb(null,"./public/temp")
    },
    //what will be my file name of the stored file
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})
export const upload=multer({
    storage,
})
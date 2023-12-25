import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
          
cloudinary.config({ 
  cloud_name: "dngr0r7nc", 
  api_key: "728185478794986", 
  api_secret: "GfgJTiFOV9VAzQEQCB9VqpvoGCw"
});

const uploadFile= async (localPath)=>{
    try {
        // If filepath is emptyt string
        if(!localPath)return null;
        //Upload file on cloudinary
        const res= await cloudinary.uploader.upload(localPath,{
            resource_type:"auto"
        });
        console.log("res: ",res);
        // fs.unlinkSync(localPath)
        return res;
        
    } catch (error) {
        // remove the locally saved temporary file as the upload
        // console.log("FIle not Uploaded Successfully")
        fs.unlinkSync(localPath)
        return null;
    }
}
export {uploadFile}
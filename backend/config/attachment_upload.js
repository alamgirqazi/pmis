// Node js file upload using Multer
const multer = require('multer');
var mkdirp = require('mkdirp');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path =   `uploads/attachments/${req.params._id}`;
    mkdirp(path, err =>{
      if(err){
        console.log('err',err);
        cb(err, path)
      }
    })

      
    
    cb(null,path)
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
});
const attachmentupload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      // only pdf files accepted
    //   if (!file.originalname.match(/\.csv$/)) {
    //     return cb(new Error('Only csv files are allowed!'), false);
    //   }
    //   else{
      cb(null, true);
    //  }
     }
    //  ,
    // limits: { fileSize: maxSize }
  });

  module.exports = attachmentupload;
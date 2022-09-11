// const path = require("path");
// const fs = require("fs");

// module.exports = function setPicturePath(instance, value, field) {
//     instance.setDataValue("picturePath", value);

//     if (value) {
//         const filePath = path.resolve("uploads", value);
//         let file;
//         try {
//             file = fs.readFileSync(filePath);
//         }
//         catch(error) {
//             console.log('setter picturePath imageFromPost', error);
//         }

//         if (file) {
//             instance.setDataValue(field, file);
//             fs.rmSync(filePath);

//             const dirPath = path.resolve("uploads", path.dirname(value));
//             if (fs.existsSync(dirPath) && fs.readdirSync(dirPath).length === 0) {
//                 fs.rmdirSync(dirPath);
//             }
//         }
//     }
// }
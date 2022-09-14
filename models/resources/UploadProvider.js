const { BaseProvider } = require('@adminjs/upload');
const fs = require("fs");
const { move } = require("fs-extra");
const path = require("path");

// class UploadProvider extends BaseProvider {
//     constructor() {
//         super('uploads');
//     }

//     async upload(file, key) {
//         const filePath = process.platform === "win32" ? this.path(key) : this.path(key).slice(1); 
//         await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
//         await move(file.path, filePath, { overwrite: true });
//     }

//     delete(key, bucket) {
//     }

//     path(key, bucket) {
//         return process.platform === "win32"
//         ? `${path.join(bucket || this.bucket, key)}`
//         : `/${path.join(bucket || this.bucket, key)}`;
//     }
// }

module.exports = class UploadProvider extends BaseProvider {
    constructor() {
        super('uploads');
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
    }
    
    async upload(file, key) {
        // console.log('upload');
        const filePath = process.platform === "win32" ? this.path(key) : this.path(key).slice(1);
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        await move(file.path, filePath, { overwrite: true });
    }
    
    async delete(key, bucket) {
        // console.log('delete');
        // await fs.promises.unlink(process.platform === "win32" ? this.path(key, bucket) : this.path(key, bucket).slice(1));

        let filePath = process.platform === "win32" ? this.path(key, bucket) : this.path(key, bucket).slice(1);
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }
    }
    
    path(key, bucket) {
        // console.log('path');
        return process.platform === "win32"
            ? `${path.join(bucket || this.bucket, key)}`
            : `/${path.join(bucket || this.bucket, key)}`;
    }
}


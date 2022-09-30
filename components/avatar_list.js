import React from 'react';
import { Buffer } from "buffer";

const Avatar = (props) => {
    let src = "/avatar.png";
    if (props.record.params.profilePicture) {
        src = 'data:image/png;base64,' + Buffer.from(props.record.params.profilePicture, "binary").toString("base64");
    }
    else if (props.record.params.image) {
        src = 'data:image/png;base64,' + Buffer.from(props.record.params.image, "binary").toString("base64");
    }

    return (
        React.createElement("div", {
            style: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "40px",
                height: "40px",
                overflow: "hidden"
            }
        },
            React.createElement("img", {
                src: src,
                alt: "avatar",
                style: {
                    width: "auto",
                    height: "100%"
                }
            })
        )
    );
}

export default Avatar;
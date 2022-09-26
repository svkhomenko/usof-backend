import React from 'react';
import { Buffer } from "buffer";
import { ValueGroup } from '@adminjs/design-system';

const Avatar = (props) => {
    let src = "/avatar.png";
    if (props.record.params.profilePicture) {
        src = 'data:image/png;base64,' + Buffer.from(props.record.params.profilePicture, "binary").toString("base64");
    }
    else if (props.record.params.image) {
        src = 'data:image/png;base64,' + Buffer.from(props.record.params.image, "binary").toString("base64");
    }

    return (
        React.createElement(ValueGroup, {
            "label": "Profile Picture",
            "value": React.createElement("div", {
                style: {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "50px",
                    height: "50px",
                    overflow: "hidden"
                }
                }, React.createElement("img", {
                    src: src,
                    alt: "avatar",
                    style: {
                        width: "auto",
                        height: "100%"
                    }
                })
            )
        }, null
    )
    );
}

export default Avatar;


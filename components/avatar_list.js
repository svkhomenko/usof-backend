import React from 'react';

const Avatar = (props) => {
    console.log("props", props);
    let src = "/avatar.png";
    if (props.record.params.profilePicture) {
        src = 'data:image/png;base64,' + props.record.params.profilePicture;
    }
    else if (props.record.params.image) {
        src = 'data:image/png;base64,' + props.record.params.image;
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
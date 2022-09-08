import React from 'react';

const Avatar = (props) => {
    console.log("props", props);
    let src = "/avatar.png";
    if (props.record.params.profilePicture) {
        // src = 'data:image/png;base64,' + Buffer.from(props.record.params.profilePicture, "binary").toString("base64");
        src = 'data:imagSe/png;base64,' + props.record.params.profilePicture;
    }

    return (
        React.createElement("section", { className: "box__Box-sc-17sbq3p-0 lhGKq adminjs_Box" },
            React.createElement("label", {
                className: "label__Label-sc-o90s7d-0 hdiVPQ adminjs_Label"
            }, "Profile Picture"),
            React.createElement("div", {
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
        )
    );
}

export default Avatar;
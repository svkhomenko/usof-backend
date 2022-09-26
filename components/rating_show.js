import React, { useState, useEffect } from 'react';
import { ValueGroup } from '@adminjs/design-system';

const Rating = (props) => {
    const [rating, setRating] = useState("d");

    useEffect(() => {
        if (props.record.params.id) {
            fetch(`http://localhost:3000/api/users/${props.record.params.id}/rating`)
                .then(res => res.json())
                .then((result) => {
                    console.log('id', props.record.params);
                    console.log('result', result);
                    setRating(result.rating);
                },
                (error) => {
                    console.log('id', props.record.params);
                    console.log('error', error);
                });
        }
    });

    return (
        React.createElement(ValueGroup, {
            "label": "Rating"
        },  React.createElement("div", null, rating))
    );
}

export default Rating;


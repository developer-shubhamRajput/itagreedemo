import React from 'react';
import { Widget } from '@typeform/embed-react';

const MyTypeform = () => {
    return (
        <div>
            <h1>Fill out this Form</h1>
            <Widget id="ArgmisBU" style={{ width: '100%', height: '500px' }} className="my-form" />
        </div>
    );
};

export default MyTypeform;

import React from 'react';

const Button = () => {

    const buttons = [
        "C", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "/", "=", "*", "DEL", "%", ".", "0", "-", "+"
    ];

    return (
        <>
            {buttons.map((btn, idx) => (
                <Button key={idx} className="button">
                    {btn}
                </Button>
            ))}
        </>
    );
};

export default Button;

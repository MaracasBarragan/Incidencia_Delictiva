import React from 'react';
import logo from './../assets/header.png';

const Header = ({ height }) => {
    return (
        <div className="w-full fixed top-0 z-50" style={{ backgroundColor: '#3F4A53', height }}>
            <div className="flex justify-center items-center border-b shadow-md h-full">
                <img 
                    src={logo} 
                    className="transition-all mx-20"
                    style={{ height: '100%' }}
                    alt="Header Logo" 
                />
            </div>
        </div>
    );
};

export default Header;

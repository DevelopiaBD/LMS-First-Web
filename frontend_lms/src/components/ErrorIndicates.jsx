import React from 'react';

const ErrorIndicates = () => (
    <div style={{
        padding: '2rem',
        background: '#ffeaea',
        color: '#ca0025ff',
        width:"100%",
        height:"100%",
        position:"fixed",
        top:"0",
        left:"0",
        display:"grid",
        placeItems:"center",
        alignContent:"center",
        gap:"5px",
        paddingTop:"100px",
        fontFamily: 'Arial, sans-serif'
    }}>
        <h2>Something went wrong</h2>
        <p>It seems there is a network problem.</p>
        <p>Please try again later.</p>
    </div>
);

export default ErrorIndicates;
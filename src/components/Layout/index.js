import React from 'react';
import SEO from '../SEO'
import Header from '../Header'


const Layout = ({ children }) => {
    return (
        <>
           
            <SEO title='demo title' />
            <Header />
            <main>{children}</main>
        
        </>
    )
}

export default Layout;
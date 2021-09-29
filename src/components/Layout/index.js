import React from 'react';
import SEO from '../SEO'
import Header from '../Header'
import Container from '@mui/material/Container';


const Layout = ({ children }) => {
    return (
        <>
           
            <SEO title='demo title' />
            <Header />
           
            <Container >
                <main>{children}</main>

            </Container>
        </>
    )
}

export default Layout;
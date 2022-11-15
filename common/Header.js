import { Avatar, Divider, IconButton, Input, InputAdornment, Menu, MenuItem, Typography } from '@material-ui/core';
import React, { Component, Fragment } from 'react';
import './Header.css';
import SearchIcon from '@material-ui/icons/Search';

class Header extends Component {
    constructor() {
        super();
        this.state = {
            openMenu: false,
            anchorEl: null,
            searchText: ""
        }
    }

    // On clicking the 'Image Viewer' logo. Redirect to Home.
    logoClickHandler = () => {
        this.props.history.push('/home');
    }

    // On clicking the profile picture.
    profileClickHandler = (e) => {
        this.setState({'openMenu': !this.state.openMenu, 'anchorEl': e.currentTarget});
    }

    // On selecting 'My account' in the menu. Redirect to profile.
    myAccountClickHandler = () => {
        this.props.history.push('/profile');
    }

    // On selecting 'Logout' in the menu. Remove access token and Redirect to login.
    logoutClickHandler = () => {
        sessionStorage.removeItem('access-token');
        this.props.history.push('/');
    }

    // Closes the Menu.
    menuCloseHandler = () => {
        this.setState({'openMenu': !this.state.openMenu, 'anchorEl': null});
    }

    // The function to set a new state for input.
    handleChange = e => {
        this.props.handleChange(e);
    };

    render() {
        return (
            <div className="header">
                {
                    this.props.loggedIn === true ?
                        //If user is logged in show Profile Picture on Header. Shows Search bar only in case of Home page.
                        <Fragment>
                            <div>
                                <header className='logo' onClick={this.logoClickHandler}>Image Viewer</header>
                            </div>
                            <div className='header-right-section'>
                                {
                                    this.props.showSearch ? // This prop would be passed from Home.js for enabling Search bar.
                                        <Input className='search' type='search' placeholder='Search...' p={5} onChange={(e) => this.handleChange(e)} disableUnderline
                                            startAdornment={
                                                <InputAdornment position="start"><SearchIcon /></InputAdornment>
                                            } />
                                        : null
                                }
                                <IconButton id='profile-icon' onClick={this.profileClickHandler}>
                                    <Avatar variant="circle" alt="profile_picture" style={{border: '2px solid whitesmoke'}} src={this.props.dpUrl}/>
                                </IconButton>
                                <div>
                                    <Menu open={this.state.openMenu} onClose={this.menuCloseHandler}
                                        anchorEl={this.state.anchorEl} getContentAnchorEl={null}
                                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} keepMounted>
                                        {
                                            this.props.showMyAccount ? // This prop would be passed from Home.js for enabling My Account option.
                                                <MenuItem onClick={this.myAccountClickHandler}>
                                                    <Typography>My Account</Typography>
                                                    <Divider variant="middle" />
                                                </MenuItem> 
                                                : null
                                        }
                                        {
                                            this.props.showMyAccount ?
                                                <Divider variant="middle" /> : null
                                        }
                                        <MenuItem onClick={this.logoutClickHandler}><Typography>Logout</Typography></MenuItem>
                                    </Menu>
                                </div>
                            </div>
                        </Fragment>

                        :
                        //If user is not logged in, show only the logo
                        <div>
                            <header className='logo'>Image Viewer</header>
                        </div>
                }

            </div>
        )
    }
}

export default Header;
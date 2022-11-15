import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Header from '../../common/Header';
import './Profile.css';
import {
    Avatar,
    Container,
    Fab,
    Typography,
    Grid,
    Modal,
    FormControl,
    InputLabel,
    Input,
    Button,
    FormHelperText,
    Card,
    CardMedia,
    Divider,
    CardActions,
    IconButton,
    TextField
} from '@material-ui/core/';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';
import { properties } from '../../Config';

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            userImages: [],
            username: properties.username, // Reading hard-coded username from config file.
            fullName: properties.fullName, // Reading hard-coded name from config file.
            url: properties.dpUrl, // Reading hard-coded profile picture URL from config file.
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            numPosts: Math.round(Math.random() * 100),
            followedBy: Math.round(Math.random() * 100),
            following: Math.round(Math.random() * 100),
            nameEditModalOpen: false,
            nameEditModalClose: true,
            nameRequiredLabel: "hide",
            imageDetailsModalOpen: false,
            imageDetailsModalClose: true,
            imageSelected: null,
            indexOfImageSelected: null
        }
    }

    editNameFieldChangeHandler = (e) => {
        if (e.target.value === '') {
            this.setState({newFullName: e.target.value})
        } else {
            this.setState({newFullName: e.target.value})
        }
    }

    editNameUpdateButtonHandler = () => {
        if (this.state.newFullName == null || this.state.newFullName.trim() === "") {
            this.setState({
                nameRequiredLabel: "show"
            })
        } else {
            this.setState({
                fullName: this.state.newFullName,
                newFullName: '',
                nameRequiredLabel: "hide"
            })

            this.closeEditNameModalHandler();
        }

    }

    // Set Flag to Open Name edit modal.
    openEditNameModalHandler = () => {
        this.setState({nameEditModalOpen: true, nameEditModalClose: false})
    }

    // Set Flag to Close Name edit modal.
    closeEditNameModalHandler = () => {
        this.setState({nameEditModalOpen: false, nameEditModalClose: true})
    }

    // On clicking any image, set selected image and index and call open modal handler.
    imageForDetailsClickHandler = (image, index) => {
        this.setState({imageSelected: image, indexOfImageSelected: index})
        this.openImageDetailsModalHandler()
    }

    // Set Flag to Open Image details modal.
    openImageDetailsModalHandler = () => {
        this.setState({imageDetailsModalOpen: true, imageDetailsModalClose: false})
    }

    // Set Flag to Close Image details modal.
    closeImageDetailsModalHandler = () => {
        this.setState({imageDetailsModalOpen: false, imageDetailsModalClose: true})
    }

    // On clicking like button. Setting like for the logged in user.
    likeHandler = (index) => {
        let likedImages = this.state.userImages;
        likedImages[index].liked = !likedImages[index].liked;
        this.setState({'userImages': likedImages})
    }

    // On clicking Add button. Adding newly added comment for the corresponding image.
    addCommentHandler = () => {
        let index = this.state.indexOfImageSelected;
        var textbox = document.getElementById("add-user-comment");
        if (textbox.value == null || textbox.value.trim() === "") {
            return;
        }
        let userImagesTemp = this.state.userImages;
        let c = userImagesTemp[index].comments;
        if (c == null) {
            c = textbox.value;
        } else {
            c = c.push([textbox.value]);
        }
        this.setState({
            userImages: userImagesTemp,
        })
        textbox.value = '';
    }

    // Hook that gets invoked right after a React component has been mounted aka after the first render() lifecycle.
    // Using PROMISE to first get the list of posts and then to download the corresponding images.
    async componentDidMount() {
        let getUserImages = this.props.baseUrl + "me/media?fields=id,caption&access_token=" + sessionStorage.getItem("access-token");
        let getPostDetails = this.props.baseUrl + "$postId?fields=id,media_type,media_url,username,timestamp&access_token=" + sessionStorage.getItem("access-token");

        let response = await fetch(getUserImages);
        let posts = await response.json();
        posts = posts.data;

        for (let i = 0; i < posts.length; i++) {
            response = await fetch(getPostDetails.replace('$postId', posts[i].id));
            let details = await response.json();
            posts[i].url = details.media_url;
            posts[i].username = details.username;
            posts[i].timestamp = details.timestamp;
            posts[i].comments = []; // For adding new comments.
            posts[i].tags = "#upgrad #upgradproject #reactjs"; // Reading hard-coded hashtags from config file.
            posts[i].likes = Math.round(Math.random() * 100);
            posts[i].liked = false; // Setting liked status for the current user.
        }
        this.setState({ userImages: posts });
    }

    render() {
        // Redirect to login page if not logged in.
        if (this.state.loggedIn === false) return <Redirect to="/" />
        else
            return (
                <div>
                    <Header {...this.props} loggedIn={true} showMyAccount={false} dpUrl={this.state.url} />
                    <Container>
                        <div style={{ height: 32 }}></div>
                        <Grid container spacing={3} justify="flex-start">
                            <Grid item xs={2} />
                            <Grid item xs={2} style={{ paddingTop: 25 }}>
                                <Avatar alt='profile_pic' id="dp" variant="circle" src={this.state.url} style={{ marginTop: 10 }} />
                            </Grid>

                            {/* User info section. */}
                            <Grid item xs={5} id='info-container'>
                                <Typography variant="h4" component="h1" style={{ paddingBottom: 15 }}>
                                    {this.state.username}
                                </Typography>
                                <Grid container spacing={3} justify="center" style={{ paddingBottom: 15 }}>
                                    <Grid item xs={4}>
                                        Posts:&nbsp;{this.state.numPosts}
                                    </Grid>
                                    <Grid item xs={4}>
                                        Follows:&nbsp;{this.state.following}
                                    </Grid>
                                    <Grid item xs={4}>
                                        Followed By:&nbsp;{this.state.followedBy}
                                    </Grid>
                                </Grid>
                                <Typography variant="h6" component="h2" style={{ marginTop: 5 }}>
                                    {this.state.fullName}
                                    <Fab color="secondary" id="edit-name" aria-label="edit" onClick={this.openEditNameModalHandler}>
                                        <EditIcon fontSize="small" />
                                    </Fab>
                                </Typography>

                                {/* Name Edit Modal. */}
                                <Modal open={this.state.nameEditModalOpen} onClose={this.closeEditNameModalHandler} >
                                    <div className="edit-modal" >
                                        <Typography variant="h5" style={{ paddingBottom: 15 }}>
                                            Edit
                                        </Typography>
                                        <FormControl required>
                                            <InputLabel htmlFor="fullName">Full Name</InputLabel>
                                            <Input id="fullName" type="text" onChange={this.editNameFieldChangeHandler} />
                                            <FormHelperText>
                                                <span className={this.state.nameRequiredLabel} style={{ color: "red" }}>required</span>
                                            </FormHelperText>
                                        </FormControl>
                                        <div style={{ marginTop: 25 }}>
                                            <Button variant="contained" color="primary"
                                                onClick={this.editNameUpdateButtonHandler}>UPDATE</Button>
                                        </div>
                                    </div>
                                </Modal>

                            </Grid>
                            <Grid item xs={4} />
                        </Grid>
                    </Container>

                    {/* Display image section. */}
                    <Container>

                        {/* Displaying clickable images on a grid. */}
                        <Grid container spacing={0} direction="row" alignItems="center">
                            {this.state.userImages &&
                                this.state.userImages.map((details, index) => (
                                    <Grid item xs={4} key={details.id} onClick={() => this.imageForDetailsClickHandler(details, index)} className="image-on-grid" >
                                        <Card variant="outlined">
                                            <CardMedia style={{ height: 0, paddingTop: '100%' }}
                                                image={details.url} />
                                        </Card>
                                    </Grid>
                                ))}
                        </Grid>

                        {/* Image Details Modal for the selected image. */}
                        <Modal open={this.state.imageDetailsModalOpen} onClose={this.closeImageDetailsModalHandler}>
                        <div className="selected-image-modal">
                            <Grid container spacing={2} direction="row" justify="center" alignItems='flex-start'>

                                {/* Image on Modal. */}
                                <Grid item xs={6}>
                                    {this.state.imageSelected ? (
                                        <img alt={this.state.indexOfImageSelected} src={this.state.imageSelected.url}
                                             style={{height: "100%",width: "100%"}}/>
                                    ) : null}
                                </Grid>

                                {/* Roght section of the Modal. */}
                                <Grid item xs={6}>
                                    {this.state.imageSelected ? (
                                            <div className='right-section'>
                                                <div>

                                                    {/* User Details. */}
                                                    <Grid className="user-detail-section" container spacing={1}
                                                          direction="row" style={{marginBottom:5}}>
                                                        <Grid item xs={2} >
                                                            <Avatar id='modal-profile-pic'
                                                                    alt={this.state.fullName}
                                                                    src={this.state.url}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={10}>
                                                            <Typography style={{paddingTop: 20, paddingLeft: 0}}>
                                                                {this.state.imageSelected.username}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Divider className='divider' variant="fullWidth"/>

                                                    {/* Caption and Hashtags. */}
                                                    <Typography style={{marginTop:5}}>
                                                        {this.state.imageSelected.caption != null ? this.state.imageSelected.caption.split("\n")[0] : null}
                                                    </Typography>
                                                    <Typography>
                                                        <div className='tags'> {this.state.imageSelected.tags} </div>
                                                    </Typography>

                                                    {/* Display comments section. */}
                                                    <Typography component="div" className="comment-section">
                                                        {
                                                            this.state.userImages[this.state.indexOfImageSelected].comments &&
                                                            this.state.userImages[this.state.indexOfImageSelected].comments.length > 0 &&
                                                            this.state.userImages[this.state.indexOfImageSelected].comments.map(comment => {
                                                                return (
                                                                    <p style={{fontSize: 16}} key={comment}>
                                                                    <b>{this.state.username}:</b> {comment}
                                                                    </p>
                                                                );
                                                        })}
                                                    </Typography>
                                                </div>

                                                {/* Like and Add Comment section. */}
                                                <div className='lower-section'>

                                                    {/* Like Image section. */}
                                                    <CardActions disableSpacing>
                                                        <IconButton onClick={() => this.likeHandler(this.state.indexOfImageSelected)} edge='start'>
                                                            {this.state.imageSelected.liked ?
                                                                <FavoriteIcon style={{color: 'red'}}/>
                                                                :
                                                                <FavoriteBorderIcon/>}
                                                        </IconButton>
                                                        <span>{this.state.imageSelected.liked ? this.state.imageSelected.likes + 1 : this.state.imageSelected.likes} likes</span>
                                                    </CardActions>
                                                    
                                                    {/* Add Comment section. */}
                                                    <Grid className="comment-add-section" container spacing={3}
                                                          alignItems='flex-end'>
                                                        <Grid item xs={10}>
                                                            <TextField id="add-user-comment" label="Add a comment" fullWidth={true}/>
                                                        </Grid>
                                                        <Grid item xs={2} className="add-button">
                                                            <Button variant="contained" id="add-comments-button" color="primary" 
                                                                onClick={() => this.addCommentHandler()} >Add</Button>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </div>
                                    ) : null}
                                </Grid>
                            </Grid>
                        </div>
                    </Modal>
                    </Container>
                </div>
            )
    }
}

export default Profile;
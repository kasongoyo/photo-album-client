import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, message } from 'antd';
import Header from '../components/header';
import PhotoForm from '../components/photo-form';
import ImgCard from '../components/img-card';
import { createAlbum, addPhotos, findAlbums, findPhotos, searchAlbums } from '../API';
import './Home.css';


class Home extends Component {
    state = {
        formVisible: false,
        q: '',
        submitting: false,
        albums: {}
    }

    componentDidMount() {
        this.loadAlbums();
    }

    loadAlbums = () => {
        const albums = {};
        findAlbums()
            .then(docs => {
                docs.forEach(doc => {
                    albums[doc.id] = doc;
                });
                const albumsPromises = docs
                    .map(album => findPhotos({ album: album.id }));
                return Promise.all(albumsPromises);
            })
            .then(result => {
                const albumWithPhotos = {};
                result.forEach(photos => {
                    if (photos.length) {
                        const albumId = photos[0].album;
                        albumWithPhotos[albumId] = { ...albums[albumId], photos };
                    }
                });
                this.setState({ albums: albumWithPhotos });
            });
    }

    handleCreateAlbumClick = () => {
        this.setState({ formVisible: true });
    }

    onClose = () => {
        this.setState({ formVisible: false });
    }

    handleValueChange = (event) => {
        const q = event.target.value;
        this.setState({ q: event.target.value });
        setTimeout(() => {
            // Timeout allow time for user to type before actual filtering started
            // it just serve to reduce number of unnecessary request to the server
            if (q) {
                const albums = {};
                searchAlbums({ q })
                    .then(docs => {
                        docs.forEach(doc => {
                            albums[doc.id] = doc;
                        });
                        const albumsPromises = docs
                            .map(album => findPhotos({ album: album.id }));
                        return Promise.all(albumsPromises);
                    })
                    .then(result => {
                        const albumWithPhotos = {};
                        result.forEach(photos => {
                            if (photos.length) {
                                const albumId = photos[0].album;
                                albumWithPhotos[albumId] = { ...albums[albumId], photos };
                            }
                        });
                        this.setState({ albums: albumWithPhotos });
                    });
            } else {
                // query is empty
                this.loadAlbums();
            }
        }, 500);
    }

    handleSubmit = (data) => {
        const { title, desc, photos } = data;
        this.setState({ submitting: true });
        createAlbum({ title, description: desc })
            .then(result => {
                const { id } = result;
                const payload = photos.map(photo => ({ uri: photo, album: id }));
                return addPhotos(payload);
            })
            .then(() => {
                this.setState({ submitting: false, formVisible: false, title: '', photos: [] });
                message.success('Album has been successfully created');
                this.loadAlbums();
            })
            .catch(() => {
                this.setState({ submitting: false, formVisible: false, title: '', photos: [] });
                message.error('album creation failed');
            });
    }

    render() {
        const { albums, formVisible, submitting, q } = this.state;

        return (
            <section>
                <Header />
                <section className='Home-content'>
                    <h3>Discover Amazing Albums</h3>
                    <div className='Home-actions'>
                        <Input placeholder='Search Albums using keywords...' value={q} onChange={this.handleValueChange} />
                        &nbsp;&nbsp;
                        <Button icon="plus" onClick={this.handleCreateAlbumClick}>Create New Album</Button>
                    </div>
                    <div className='Home-albums'>
                        {
                            Object.keys(albums).length ? Object.keys(albums)
                                .map(key => (
                                    <Link key={key} to={`albums/${albums[key].id}`} title='Click to view this album'>
                                        <ImgCard src={albums[key].photos[0].uri} title={albums[key].title} />
                                    </Link>)) : ''
                        }
                    </div>
                    <PhotoForm
                        title='New Album'
                        visible={formVisible}
                        submitting={submitting}
                        onSubmit={this.handleSubmit}
                        onClose={this.onClose}
                    />
                </section>

            </section>
        )
    }
}

export default Home;
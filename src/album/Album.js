import React, { Component, Fragment } from 'react';
import { Input, Button, message } from 'antd';
import Header from '../components/header';
import ImgCard from '../components/img-card';
import PhotoForm from '../components/photo-form';
import { addPhotos, findAlbumById, findPhotos, searchPhotos } from '../API';
import './Album.css';

class Album extends Component {
    state = { photos: [], title: '', q: '', formVisible: false, submitting: false };

    componentDidMount() {
        const { albumId } = this.props.match.params;
        const loadingAlbum = findAlbumById(albumId).then(album => {
            this.setState({ title: album.title })
        });
        const loadPhotos = findPhotos({ album: albumId })
            .then(photos => {
                this.setState({ photos });
            });

        Promise
            .all([loadingAlbum, loadPhotos]);
    }

    handleImageUpload = images => {
        this.setState({ photos: images });
    }

    handleAddPhotoClick = () => {
        this.setState({ formVisible: true });
    }

    onClose = () => {
        this.setState({ formVisible: false });
    }

    handleValueChange = (event) => {
        const q = event.target.value;
        this.setState({ q: event.target.value });
        setTimeout(() => {
            // Timeout allow time for user to type before actual filtering
            // starts just to reduce number of unnecessary request to the server
            if (q) {
                searchPhotos({ q })
                    .then(photos => this.setState({ photos }))
            } else {
                // query is empty
                const { albumId } = this.props.match.params;
                findPhotos({ album: albumId })
                    .then(photos => {
                        this.setState({ photos });
                    });
            }
        }, 500);
    }

    handleSubmit = (data) => {
        const { albumId } = this.props.match.params;
        const photos = data.photos.map(photo => ({
            uri: photo,
            description: data.desc, album: albumId
        }));
        this.setState({ submitting: true });
        addPhotos(photos)
            .then(() => {
                this.setState({ submitting: false, formVisible: false, });
                message.success('Picture added successfully');
                findPhotos({ album: albumId })
                    .then(photos => {
                        this.setState({ photos });
                    });
            })
            .catch(() => {
                this.setState({ submitting: false, formVisible: false, });
                message.error(' add picture fails');
            });
    }

    render() {
        const { title, photos, formVisible, submitting, q } = this.state;
        return (
            <section>
                <Header />
                <section className='Album'>
                    <h2 className='Album-header'>{title} Album </h2>
                    <div className='Album-filter'>
                        <Input placeholder='Search photos using keywords...' value={q} onChange={this.handleValueChange} />
                        &nbsp;&nbsp;
                        <Button icon="plus" onClick={this.handleAddPhotoClick}>Add photo</Button>
                    </div>
                    <div className='Album-pictures'>
                        <Fragment>
                            {
                                photos.map(photo => <ImgCard key={photo.id} desc={photo.description} src={photo.uri} />)
                            }
                        </Fragment>
                    </div>
                </section>
                <PhotoForm
                    title='New Photo'
                    visible={formVisible}
                    submitting={submitting}
                    onSubmit={this.handleSubmit}
                    onClose={this.onClose}
                    hideTitleField
                />
            </section >
        )
    }
}

export default Album;
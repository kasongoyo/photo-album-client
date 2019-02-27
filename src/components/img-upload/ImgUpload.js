import React, { Component } from 'react';
import { Upload, Icon, Modal} from 'antd';
import PropTypes from 'prop-types';


class ImgUpload extends Component {
    state = {
        images: [],
        previewVisible: false,
        previewImage: '',
    }

    static propTypes = {
        // default images is available
        images: PropTypes.array,
        // Called everytime a new photo is uploaded
        onImageUpload: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const { images } = this.props;
        if (images) {
            this.setState({ images });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.images !== this.props.images) {
            this.setState({ images: nextProps.images });
        }
    }

    uploadImage = ({ file, filename, onError, onProgress, onSuccess }) => {

        let reader = new FileReader();

        reader.onloadend = () => {
            this.setState(state => ({
                images: [...state.images, {
                    ...file,
                    // url: reader.result.split(',')[1]
                    url: reader.result
                }]
            }));
            this.props.onImageUpload(this.state.images);
            onSuccess(reader.result, file);
        }
        reader.onprogress = onProgress;
        reader.onerror = onError;

        reader.readAsDataURL(file)
    }

    handleDismissPreview = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    render() {
        const { images, previewImage, previewVisible } = this.state;

        return (
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                defaultFileList={images}
                showUploadList={true}
                customRequest={this.uploadImage}
                onPreview={this.handlePreview}
            >
                <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">Upload</div>
                </div>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleDismissPreview}>
                    <img alt="Vendor visual" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Upload>
        )

    }
}

export default ImgUpload;
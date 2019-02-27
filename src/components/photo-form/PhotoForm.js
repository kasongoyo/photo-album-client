import React, { Component } from 'react';
import { Input, Button, Drawer, Form } from 'antd';
import PropTypes from 'prop-types';
import ImgUpload from '../img-upload';

const { TextArea } = Input;
const FormItem = Form.Item;

class PhotoForm extends Component {
    state = {
        formVisible: false,
        form: {
            values: {
                photos: [],
                title: '',
                desc: ''
            },
            errors: {
                title: '',
                desc: '',
                photo: ''
            }
        },
    }

    static propTypes = {
        // control drawer visibility
        visible: PropTypes.bool.isRequired,
        // function called on submitting this form
        onSubmit: PropTypes.func.isRequired,
        // function called to close the drawer
        onClose: PropTypes.func.isRequired,
        // Form title
        title: PropTypes.string,
        // submitting state status
        submitting: PropTypes.bool,
        // Hide form title field(applicable when this form is used in photo context)
        hideTitleField: PropTypes.bool
    }


    onClose = () => {
        this.setState({ formVisible: false });
    }

    handleValueChange = (event) => {
        const { name, value } = event.target;
        this.setState(state => ({
            form: {
                values: { ...state.form.values, [name]: value },
                errors: {  ...state.form.errors, [name]: '' }
            }
        }));
    }

    handleImageUpload = (images) => {
        const photos = images.map(img => img.url);
        this.setState(state => ({
            form: {
                errors: { ...state.form.errors, photo: '', },
                values: { ...state.form.values, photos: photos }
            }
        }));
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { form } = this.state;
        const { hideTitleField } = this.props;
        if (hideTitleField && (!form.values.desc || !form.values.photos.length)) {
            this.setState(state => ({
                form: {
                    errors: {
                        desc: !form.values.desc ? 'Description is required' : '',
                        photo: !form.values.photos.length ? 'Photo is required' : ''
                    },
                    values: { ...state.form.values }
                }
            }));
            return;
        }
        if (!hideTitleField && (!form.values.title || !form.values.desc || !form.values.photos.length)) {
            this.setState(state => ({
                form: {
                    errors: {
                        title: !form.values.title ? 'Title is required' : '',
                        desc: !form.values.desc ? 'Description is required' : '',
                        photo: !form.values.photos.length ? 'Photo is required' : ''
                    },
                    values: { ...state.form.values }
                }
            }));
            return;
        }
        this.props.onSubmit(this.state.form.values);
    }

    render() {
        const { form } = this.state;
        const { visible, onClose, title, submitting, hideTitleField } = this.props;

        return (
            <Drawer
                title={title}
                placement="right"
                closable={true}
                maskClosable={false}
                width='50%'
                onClose={onClose}
                visible={visible}
            >
                <Form layout='vertical' onSubmit={this.handleSubmit}>
                    {
                        !hideTitleField ? <FormItem label='Title' help={form.errors.title || ''} validateStatus={form.errors.title ? 'error' : ''}>
                            <Input placeholder='Title' name='title' value={form.values.title} onChange={this.handleValueChange} />
                        </FormItem> : null
                    }
                    <FormItem label='Description' help={form.errors.desc || ''} validateStatus={form.errors.desc ? 'error' : ''}>
                        <TextArea placeholder='Description' name='desc' value={form.values.desc} onChange={this.handleValueChange} />
                    </FormItem>
                    <FormItem label='Photos' help={form.errors.photo || ''} validateStatus={form.errors.photo ? 'error' : ''}>
                        <ImgUpload onImageUpload={this.handleImageUpload} />
                    </FormItem>
                    <FormItem>
                        <Button type='primary' htmlType='submit' loading={submitting}>Submit</Button>
                    </FormItem>
                </Form>
            </Drawer>
        )
    }
}

export default PhotoForm;
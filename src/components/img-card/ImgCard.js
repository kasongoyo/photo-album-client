import React from 'react';
import PropTypes from 'prop-types';
import './ImgCard.css';

const ImgCard = ({ style, src, title, desc }) => (
    <figure className='ImgCard' style={style}>
        <div className='ImgCard-img-wrapper'>
            <div className='ImgCard-img' data-testid="image" style={{ backgroundImage: `url(${src})` }}></div>
            <div className='ImgCard-mask'>
                <h3 className='ImgCard-title'>{title}</h3>
            </div>
        </div>
        <figcaption>{desc}</figcaption>
    </figure>

);

ImgCard.propTypes = {
    style: PropTypes.object,
    src: PropTypes.string.isRequired,
    title: PropTypes.string,
    desc: PropTypes.string
}

export default ImgCard;
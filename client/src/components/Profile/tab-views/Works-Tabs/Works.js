import React from 'react';
import { SearchServices } from '../../../../services';
import './works.scss';

const Works = () => {
    return (
        <div className="works-tab">
            <div className="works-tab-tri-buttons-container">
                <button className="bsc-button transparent works-tab-tri-button">Books</button>
                <button className="bsc-button transparent works-tab-tri-button">Issues</button>
                <button className="bsc-button transparent works-tab-tri-button">Accredited</button>
            </div>
            <div className="filtered-results">Works</div>
        </div>
    );
}

export default Works;
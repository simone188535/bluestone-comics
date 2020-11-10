import React, { useEffect } from 'react';

const ProgressBar = ({ uploadPercentage, className }) => {

    const providedClassNames = className ? className : '';
    
    useEffect(() => {
        const completedProgressEl = document.getElementsByClassName('progress')[0];
        completedProgressEl.style.width = `${uploadPercentage}%`;
      }, [uploadPercentage]);

    return (
        <>
            <div className={`progress-bar ${providedClassNames}`}>
                <div className="progress"></div>
                <div className="progress-label">
                    {`${uploadPercentage}%`}
                </div>
            </div>
        </>
    );
}

export default ProgressBar;
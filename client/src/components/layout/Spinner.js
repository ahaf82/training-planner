import React, { Fragment } from 'react';
import spinner from './spinner.gif';

export default () => (
    <Fragment>
        <div class="preloader-wrapper big active">
            <div class="spinner-layer spinner-rainbow">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div><div class="gap-patch">
                    <div class="circle"></div>
                </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>
        </div>
    </Fragment>
); 

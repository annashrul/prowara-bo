import React,{Component} from 'react';
import Skeleton from 'react-loading-skeleton';

class Info extends Component{
    render(){
        return (
            <div id="head_order" className="col-md-3">
                <small><Skeleton width={70}/></small>
                 <p className="h5">
                    <Skeleton width={80}/>
                </p>
                <small><Skeleton width={80}/></small>
                <p><span><Skeleton width={50}/></span></p>
                <small><Skeleton width={80}/></small>
                <p>
                    <span><Skeleton width={80}/></span><br/>
                    <span><Skeleton width={80}/></span><br/>
                    <span><Skeleton width={80}/></span><br/>
                    <span><Skeleton width={80}/></span><br/>
                </p>
                <hr />
                <Skeleton width={50}/>
            </div>
        )
    }
}

export default (Info);

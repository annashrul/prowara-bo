import React,{Component} from 'react';
import Skeleton from 'react-loading-skeleton';

class SkeletonList extends Component{
    // constructor(props){
    //     super(props);
       
    // }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        return (
            <tr>
                <td style={columnStyle}>{/* Example split danger button */}
                    <div className="btn-brand">
                        <Skeleton width={69} height={34} />
                    </div>
                </td>
                <td style={columnStyle}>{/* Example split danger button */}
                    <Skeleton width={60} height={60} />
                </td>
                <td style={columnStyle}><Skeleton width={100}/></td>
                <td style={columnStyle}><Skeleton width={100}/></td>
                <td style={columnStyle}><Skeleton width={20}/> <Skeleton width={70}/></td>
                <td style={columnStyle}><Skeleton width={39} height={21} /></td>
                <td style={columnStyle}><Skeleton width={110}/></td>
            </tr>
        )
    }
}

export default (SkeletonList);
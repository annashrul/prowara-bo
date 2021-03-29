import React,{Component} from 'react';
import {connect} from "react-redux";
import {fetchKarir} from 'redux/actions/setting/general.action'
import KarirModal from '../../../modals/setting/karir.modal'
import {ModalToggle, ModalType} from "redux/actions/modal.action";

class Index extends Component{
    constructor(props){
        super(props);
        this.state={
            datum:[]
        };
        this.handleChange = this.handleChange.bind(this)
        this.handleEnterSubmit = this.handleEnterSubmit.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
    }

    componentDidMount(){
        this.props.dispatch(fetchKarir());
    }

    static getDerivedStateFromProps(props, state) {
        if(props.karir!==undefined && props.karir.length!==0){
            if (props.karir !== state.prevkarirProps) {
                let data = state 
                data=Object.assign({}, data, {
                    prevkarirProps: props.karir,
                });
                props.karir.map(i=>{
                    data=Object.assign({}, data, {
                        [i.membership+'|karir']: i.karir,
                        [i.membership+'|flush_in']: i.flush_in
                    });
                })
                return data;
            }
        }

    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }
    handleEdit(e,i){
        e.preventDefault()
        this.setState({
            datum:i
        })
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("karirModal"));
    }

    handleEnterSubmit = (event, id, title) => {
        const key_data = event.target.name;
        const data = {
            [key_data.split('|')[1]]: event.target.value,
        }
        // this.props.dispatch(updatekarir(data, id,title))
    }


    render(){
        const headStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};

        return(
            <div className="card">
                <div className="card-body">
                   
                        <div className="row">
                            <div className='col-md-8 offset-md-2 col-sm-12'>
                                <div style={{overflowX: "auto",zoom:"80%"}}>
                                    <table className="table table-hover">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" style={headStyle}>#</th>
                                            <th className="text-black" style={headStyle}>Title</th>
                                            <th className="text-black" style={headStyle}>Deskripsi</th>
                                            <th className="text-black" style={headStyle}>Reward Kiri</th>
                                            <th className="text-black" style={headStyle}>Reward Kanan</th>
                                            <th className="text-black" style={headStyle}>Aksi</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.props.karir.length>0?
                                                    this.props.karir.map(i=>(
                                                        <tr>
                                                            <td style={headStyle}><img src={i.badge} width="50px"/></td>
                                                            <td style={headStyle}>{i.title}</td>
                                                            <td style={headStyle}>{i.deskripsi}</td>
                                                            <td style={headStyle}>{i.left_point}</td>
                                                            <td style={headStyle}>{i.right_point}</td>
                                                            <td style={headStyle}><button className="btn btn-info" onClick={event=>this.handleEdit(event,i)}>Edit</button></td>
                                                        </tr>
                                                        
                                                        
                                                        ))
                                                        :''
                                                    } 
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                 </div>
                <KarirModal data={this.state.datum}/>
            </div>


        );
    }
}
const mapStateToProps = (state) => {
    return {
        isLoading: state.generalReducer.isLoading,
        isOpen:state.modalReducer,
        karir:state.generalReducer.karir,
    }
}


export default connect(mapStateToProps)(Index);
import React,{Component} from 'react';
class Filter extends Component{
    constructor(props){
        super(props);
       this.state={
           search:''
       }
       this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount(){
        this.setState({
            search: localStorage.getItem('search_tenant')
        })
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render(){
        return (
            <div className={this.props.title==='Semua'?"col-md-2 offset-md-1":"col-md-2"}>
                {/* <a href={null} onClick={(e)=>false}> */}
                <a href='#' onClick={(e)=>this.props.handleClickStatus(e,this.props.title)}>
                <div className={this.props.color===undefined?"box-content bg-danger text-white":"box-content text-white "+this.props.color} style={{textAlign: 'center',padding:'15px'}}>
                    {this.props.icon}
                    <br />
                    <p className="text text-white" style={{fontSize: '1.2em'}}>{this.props.title}</p>
                    <h2 className="counter text-white" id="semua">{this.props.counter}</h2>
                </div>
                </a>
            </div>
        )
    }
}

export default (Filter);
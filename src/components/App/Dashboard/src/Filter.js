import React, {Component} from 'react'
import Select from 'react-select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {rangeDate} from "helper";

class Charts extends Component {
    render(){
        return(
            <div className="row">
                <div className="col-md-2 col-sm-2 col-lg-3">
                    <div className="form-group">
                        <DateRangePicker
                            autoUpdateInput={true} showDropdowns={true} style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onApply={this.props.handleEvent}>
                            <input type="text" readOnly={true} className="form-control" value={`${this.props.startDate} to ${this.props.endDate}`}/>
                        </DateRangePicker>

                        {/*<DateRangePicker autoUpdateInput={true} showDropdowns={true} style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onApply={this.props.handleEvent}>*/}
                            {/*<input type="text" className="form-control" name="date_product" value={`${this.props.startDate} to ${this.props.endDate}`} style={{padding: '9px',fontWeight:'bolder'}}/>*/}
                        {/*</DateRangePicker>*/}
                    </div>
                </div>
            </div>
        )
    }
}

export default Charts;
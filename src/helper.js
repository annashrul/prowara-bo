import React,{Component} from "react";
import Pagination from "react-js-pagination";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import Swal from "sweetalert2";
import ProfileImage from "assets/profile.png";
import NoData from "assets/nodata.png";
import Yes from "assets/status-Y.png";
import No from "assets/status-T.png";
import {CopyToClipboard} from "react-copy-to-clipboard";
import dollarY from 'assets/status/dollar_y.svg'
import dollar from 'assets/status/dollar.svg'
import dollarWhite from 'assets/status/dollar_white.svg'
import pack_deliveryY from 'assets/status/pack_delivery_y.svg'
import pack_deliveryWhite from 'assets/status/pack_delivery_y_white.svg'
import pack_delivery from 'assets/status/pack_delivery_y_non.svg'
import pack_deliveredY from 'assets/status/pack_delivered_y.svg'
import pack_deliveredWhite from 'assets/status/pack_delivered_y_white.svg'
import pack_delivered from 'assets/status/pack_delivered_y_non.svg'
import truckY from 'assets/status/truck_y.svg'
import truckWhite from 'assets/status/truck_y_white.svg'
import truck from 'assets/status/truck_y_non.svg'
import confirmY from 'assets/status/confirmation.svg'
import confirmWhite from 'assets/status/confirmation_white.svg'
import confirm from 'assets/status/confirmation_non.svg'
import XLSX from 'xlsx'
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';
export const statusOrder = (type, status, iswhite = false) => {
    if (type === 'dollar') {
        return (!iswhite ? (status ? dollarY : dollar) : dollarWhite)
    } else if (type === 'packing') {
        return (!iswhite ? (status ? pack_deliveryY : pack_delivery) : pack_deliveryWhite)
    } else if (type === 'delivered') {
        return (!iswhite ? (status ? pack_deliveredY : pack_delivered) : pack_deliveredWhite)
    } else if (type === 'truck') {
        return (!iswhite ? (status ? truckY : truck) : truckWhite)
    } else if (type === 'confirm') {
        return (!iswhite ? (status ? confirmY : confirm) : confirmWhite)
    }
}

export const toExcel=(title='',periode='',head=[],content=[],foot=[])=>{
    let header = [
        [title],
        [`PERIODE : ${periode}`],
        [''],
        head
    ];
    let footer = foot;
    let raw = content;
    let body = header.concat(raw);
    let data = footer===undefined||footer===[]?body:body.concat(footer);
    console.log(`=========================> ${data} <==========================`);
    let ws = XLSX.utils.json_to_sheet(data, {skipHeader:true});
    let merge = [
        {s: {r:0, c:0},e: {r:0, c:head.length}},
        {s: {r:1, c:0},e: {r:1, c:head.length}},
    ];
    if(!ws['!merges']) ws['!merges'] = [];
    ws['!merges'] = merge;
    ws['!ref'] = XLSX.utils.encode_range({
        s: { c: 0, r: 0 },
        e: { c: head.length, r:data.length}
    });
    ws["A1"].s = {
        alignment: {
            vertical: 'center',
        }
    };

    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, title);
    let exportFileName = `${title.replaceAll(" ","_")}_${moment(new Date()).format('YYYYMMDDHHMMss')}.xlsx`;
    XLSX.writeFile(wb, exportFileName, {type:'file', bookType:"xlsx"});
    return;
}

export const isEmpty = (col)=>{
    return `${col} cannot be null`;
}

export const isFloatFix = (num)=>{
    return parseFloat(num).toFixed(8);
}
export const isFloat = (num)=>{
    return parseFloat(num);
}

export const noImage = ()=>{
    return ProfileImage;
}
export const copyTxt = (txt)=>{
    return <CopyToClipboard text={txt} style={{cursor:"copy"}}
         onCopy={()=>ToastQ.fire({icon:'success',title:`${txt} has been copied.`})}>
        <span><i className="fa fa-copy" style={{color:"green"}}/> {txt} </span>
    </CopyToClipboard>
}
export const noData = ()=>{
    return NoData;
}
export const validateEmail=(email)=>{
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
export const toCurrency = (angka) => {
    let numbers=0;
    if(angka===null) return 0;
    else if(angka===0) return 0;
    else if (parseInt(angka) === 0) return 0;
    if(parseFloat(angka)<0){
        numbers = angka.toString().replace('-', '');

    }else{
        numbers=angka;

    }
    var number_string = (numbers===''||numbers===undefined)? String(0.0) : numbers.toString().replace(/,|\D/g,''),
        split = number_string.split('.'),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan koma jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
        var separator = sisa ? ',' : '';
        rupiah += separator + ribuan.join(',');
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    rupiah = (parseFloat(angka) < 0) ? "-" + rupiah.replace(/^0+/, ''):rupiah.replace(/^0+/, '');
    return rupiah;
}
export const stringifyFormData = (fd) => {
    const data = {};
    for (let key of fd.keys()) {
        data[key] = fd.get(key);
    }
    return data;
}
export const addFooters = doc => {
    var width   = doc.internal.pageSize.getWidth();
    var height  = doc.internal.pageSize.getHeight();
    doc.page=1;
    // const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(7);
    doc.text(width-40, height - 30, 'Page - ' + doc.page);
    doc.page ++;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    return doc;
}
export const rplcSpace = (val){
    return val.replace(" ","_");
}
export const rmComma = (angka) => {
    let numbers=0;
    if(parseFloat(angka)<0){
        numbers = angka.toString().replace('-', '');
    }else{
        numbers=angka;
    }
    var number_string = (numbers===''||numbers===undefined)? String(0.0) : numbers.toString().replace(/,|\D/g,''),
        split = number_string.split('.'),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        rupiah += ribuan.join('');
    }

    rupiah = split[1] !== undefined ? rupiah + '' + split[1] : rupiah;
    rupiah = (parseFloat(angka) < 0) ? "-" + rupiah.replace(/^0+/, ''):rupiah.replace(/^0+/, '');
    return parseInt(rupiah,10);
}
export const toPersen= (val1,val2) => {
    let con =  (parseFloat(val1)/parseInt(val2,10))*100;
    return con.toFixed(2);
}
export const ToastQ = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }

})
export const statusQ = (txt) => {
    if(txt === 1){
        return <img src={Yes} style={{height:"20px",width:"20px"}} alt=""/>
    }else{
        return <img src={No} style={{height:"20px",width:"20px"}} alt=""/>
    }

};
export const getMargin = (hrg_jual,hrg_beli) => {
    return (((parseInt(hrg_jual,10)-parseInt(hrg_beli,10))/parseInt(hrg_beli,10))*100).toFixed(2);
};
export const kassa = (param='')=>{
    let data=[];
    if(param==='semua'){
        data.push({value: "",label: "Semua Kassa"})
    }
    data.push(
        {value: "A",label: "A"},{value: "B",label: "B"},{value: "C",label: "C"},{value: "D",label: "D"},{value: "E",label: "E"},{value: "F",label: "F"},{value: "G",label: "G"},{value: "H",label: "H"},
        {value: "I",label: "I"},{value: "J",label: "J"},{value: "K",label: "K"},{value: "L",label: "L"},{value: "M",label: "M"},{value: "N",label: "N"},{value: "O",label: "O"},{value: "P",label: "P"},
        {value: "Q",label: "Q"},{value: "R",label: "R"},{value: "S",label: "S"},{value: "T",label: "T"},{value: "U",label: "U"},{value: "V",label: "V"},{value: "W",label: "W"},{value: "X",label: "X"},
        {value: "Y",label: "Y"},{value: "Z",label: "Z"}
    );
    return data;
};
export const lengthBrg = (str)=>{
    let txt = str.length>15?`${str.substr(0,15)} ...`:str;
    return txt.toLowerCase();
}
export const CapitalizeEachWord=(str)=>{
    let splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}
export const rmHtml = (str)=>{
    let stripedHtml =str.replace(/<[^>]+>/g, '');
    return stripedHtml;
}
var date = new Date();
date.setDate(date.getDate());
export const rangeDate = {
    'Hari Ini'          : [moment(),moment()],
    'Kemarin'           : [date.setDate(date.getDate()-1), date.setDate(date.getDate())],
    '7 Hari Terakhir'   : [moment().subtract(6, 'days'), moment()],
    '30 Hari Terakhir'  : [moment().subtract(29, 'days'), moment()],
    'Minggu Ini'        : [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
    'Minggu Lalu'       : [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek')],
    'Bulan Ini'         : [moment().startOf('month'), moment().endOf('month')],
    'Bulan Lalu'        : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Tahun Ini'         : [moment().startOf('year'), moment().endOf('year')],
    'Tahun Lalu'        : [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
};

class Paginationq extends Component{
    // constructor(props){
    //     super(props);
    // }
    render(){
        return (
            <Pagination
                activePage={parseInt(this.props.current_page,10)}
                itemsCountPerPage={parseInt(this.props.per_page,10)}
                totalItemsCount={parseInt(this.props.total,10)}
                pageRangeDisplayed={5}
                onChange={this.props.callback}
                itemClass="page-item"
                linkClass="page-link"
                activeClass="page-item active"
                disabledClass="page-item disabled"
                prevPageText='prev'
                nextPageText='next'
                firstPageText='first'
                lastPageText='last'
            />
        )
    }
}


export default connect()(Paginationq)

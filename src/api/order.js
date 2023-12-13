import axios from "axios";

export function getProductList(params){
    return axios({
        method:"post"
        ,url: process.env.REACT_APP_ORDER_API_URL + '/product'
        ,data:params
        ,timeout : 10000
    })
}
export function registerOrder(params){
    return axios({
        method:"post"
        ,url: process.env.REACT_APP_ORDER_API_URL + '/order/register'
        ,data:params
        ,timeout : 10000
    })
}

export function generationBill(params){
    return axios({
        method:"post"
        ,url: process.env.REACT_APP_BILL_API_URL + "/payment/bill/init"
        ,data:params
        ,timeout : 10000
    })
}
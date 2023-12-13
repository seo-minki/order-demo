import StoreInformation from "../components/StoreInformation";
import ProductInformation from "../components/ProductInformation";

import "../css/order_list.css"
const OrderList = () => {
    return (
        <div className="">
            <div className="">
                <StoreInformation></StoreInformation>
                <div className="item_wrapper">
                    <div className="max_width640">
                        <ProductInformation></ProductInformation>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderList;
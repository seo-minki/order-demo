import {useState, useEffect} from "react";
import imageUrl from "../images/coffee.jpeg";
import {registerOrder, generationBill} from "../api/order";
import {QRCodeSVG} from 'qrcode.react';

const ProductOptionsPopup = (props) => {
    const [productItem, setProductItem] = useState({
        price: null,
        seq: null
    });
    const [optionList, setOptionList] = useState([]);
    const [memo, setMemo] = useState("");
    const [totalQuantity, setTotalQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [billURL, setBillURL] = useState("");

    const merchantCode = window.sessionStorage.getItem("merchantCode");
    const platform = isMobile() ? "MO" : "PC";
    function isMobile() {
        const varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기
        return varUA.indexOf('android') > -1 || varUA.indexOf("iphone") > -1 || varUA.indexOf("ipad") > -1 || varUA.indexOf("ipod") > -1;
    }

    const productItemList = () => {
        return props.product.productItemList.map((productItem, index) => {
            return (
                <label htmlFor={productItem.name} key={index}
                       className={'divide_into_' + props.product.productItemList.length}
                       onClick={() => selectProductItemHandler(productItem)}>
                    <div>
                        {productItem.name}
                    </div>
                    <p>{productItem.price}원</p>
                    <input type={"radio"} name="productItem" id={productItem.name} value={productItem.seq}/>
                </label>
            )
        })
    }

    const optionGroupList = () => {
        const optionGroup = props.product.optionGroupList.filter(option => option.optionGroup.type !== "MEMO");
        return optionGroup.map((option, optionGroupKey) => {
            return (
                <div key={optionGroupKey}>
                    <p className="options_title">{option.optionGroup.name}{option.optionGroup.type === "ESSENTIAL" ? "(필수 옵션)" : ""}</p>
                    <div className="options">
                        <div
                            className={option.optionGroup.type !== "ESSENTIAL" ? ' divide_into_' + (option.optionList.length + 1) : ""}
                            style={option.optionGroup.type !== "ESSENTIAL" ? {margin: '3px'} : {}}>
                            {option.optionGroup.type !== "ESSENTIAL" &&
                                <label htmlFor={option.optionGroup.name + "선택안함"}
                                       onClick={() => selectOptionsHandler(option.optionGroup, undefined)}
                                       className={"not_select"}>
                                    <div>
                                        선택안함
                                    </div>
                                    <p>0원</p>
                                    <input type={"radio"} name={option.optionGroup.name}
                                           id={option.optionGroup.name + "선택안함"} value={0}
                                           onClick={(event) => event.stopPropagation()}/>
                                </label>
                            }
                        </div>
                        {optionSelectList(option.optionGroup, option.optionList)}
                    </div>
                </div>
            )
        })
    }

    const optionSelectList = (optionGroup, list) => {
        return list.map((optionInfo, optionKey) => {
            return (
                <label htmlFor={optionInfo.name} key={optionKey}
                       className={optionGroup.type === "ESSENTIAL" ? 'divide_into_' + list.length : 'divide_into_' + (list.length + 1)}
                       onClick={() => selectOptionsHandler(optionGroup, optionInfo)}>
                    <div>
                        {optionInfo.name}
                    </div>
                    <p>{optionInfo.price}원</p>
                    <input type={"radio"} name={optionGroup.name} id={optionInfo.name} value={optionInfo.seq}
                           onClick={(event) => event.stopPropagation()}/>
                </label>
            )
        })
    }

    // 상품 사이즈 선택
    const selectProductItemHandler = (val) => {
        setProductItem({price: val.price, seq: val.seq});
    }
    // 상품 옵션 선택
    const selectOptionsHandler = (groupInfo, val) => {
        const optionValue = val ? val : {price: 0, seq: 0}

        let selectedOptionList = optionList;

        const option = {
            optionGroupSeq: groupInfo.seq,
            optionSeq: optionValue.seq,
            memo: null,
            quantity: 1,
            price: optionValue.price
        }

        const targetIndex = selectedOptionList.findIndex(selectedOption => selectedOption.optionGroupSeq === option.optionGroupSeq);

        if (targetIndex > -1) {
            selectedOptionList[targetIndex] = option;
        } else {
            selectedOptionList.push(option);
        }

        setOptionList(selectedOptionList);

        handleTotalPrice();
    }

    // 토탈 금액 핸들러
    const handleTotalPrice = () => {
        const productItemPrice = productItem.price;
        const optionPrice = optionList.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.price;
        }, 0);

        setTotalPrice((productItemPrice + optionPrice) * totalQuantity);
    }
    useEffect(() => {
        handleTotalPrice();
    }, [productItem, totalQuantity]);


    const handelMemo = (e) => {
        setMemo(e.target.value);
    }

    const totalQuantityHandler = (type) => {
        if (type === "plus") {
            setTotalQuantity(totalQuantity + 1);
        } else if (type === "minus") {
            if (totalQuantity === 1) return;
            setTotalQuantity(totalQuantity - 1);
        }
    }

    const disableButton = () => {
        return !productItem.seq
    }

    // 주문하기
    async function order() {
        try {
            const orderParameters = {
                merchantCode: merchantCode,
                tableName: null,
                productList: [
                    {
                        productSeq: props.product.product.seq,
                        productItemSeq: productItem.seq,
                        quantity: totalQuantity,
                        optionList: optionList
                    }
                ]
            }

            const order = await registerOrder(orderParameters);

            billInit(order.data.info.orderId)

        } catch (e) {
            alert(e);
        }
    }

    async function billInit(orderId) {
        try {
            const init = await generationBill({
                billType: "order",
                merchantCode: merchantCode,
                orderId: orderId,
                platform: platform
            })

            if(platform === "MO"){
                openPage(init.data.info.billURL)
                return;
            }

            billUrlHandler(init.data.info.billURL);
        } catch (e) {
            console.error(e);
        }
    }

    const billUrlHandler = (billUrl) => {
        setBillURL(process.env.REACT_APP_BILL_FRONT_URL + billUrl);
    }

    const openPage = (url) => {
        window.location.href = process.env.REACT_APP_BILL_FRONT_URL + url;
    }

    function saveSession() {
        const product = props.product;
        let data = [{
            productSeq: product.product.seq,
            sizeSeq: productItem.seq,
        }];

        let sessionStorage = JSON.parse(window.sessionStorage.getItem("cart"));
        if (sessionStorage) {
            data = [...sessionStorage, ...data];
        }

        window.sessionStorage.setItem("cart", JSON.stringify(data));
        closePopup();
    }

    function closePopup() {
        props.closeOptionsPopup();
    }

    return (
        <div className="product_options_popup">
            <div className="product_options_popup_wrapper">
                <div className="product_options_popup_inner_wrapper">
                    <div className="product_options_popup_header">
                        <h3>상품</h3>
                        <button onClick={closePopup}>닫기</button>
                    </div>
                    {!billURL ?
                        <div className="product_options">
                            <div className="product_image" style={{backgroundImage: `url(${imageUrl})`}}></div>
                            <p className="options_title">사이즈 선택(필수 옵션)</p>
                            <div className="options">
                                {productItemList()}
                            </div>
                            {optionGroupList()}
                            <p className="options_title">요청사항</p>
                            <textarea maxLength={30} value={memo} onChange={handelMemo}></textarea>

                            <div className="order_button_wrap">
                                <div className="quantity_button_wrap">
                                    <button onClick={() => totalQuantityHandler("minus")}>-</button>
                                    <span>{totalQuantity}</span>
                                    <button onClick={() => totalQuantityHandler("plus")}>+</button>
                                </div>
                                <p>₩{totalPrice}</p>
                                <div className="button_wrap">
                                    {/*<button disabled={disableButton()} onClick={() => saveSession()}>담기</button>*/}
                                    <button disabled={disableButton()} onClick={() => order()}>주문하기</button>
                                </div>

                            </div>
                        </div> :
                        <div className="qr_code_wrap">
                            <QRCodeSVG value={billURL} width={300} height={300}></QRCodeSVG>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
export default ProductOptionsPopup;
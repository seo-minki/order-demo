import React, {useState, useEffect} from "react";
import ProductList from "./ProductList";
import ProductOptionsPopup from "./ProductOptionsPopup";
import {getProductList} from "../api/order";

const ProductInformation = () => {
    const [categoryIndex, setCategoryIndex] = useState(0);
    const [productList, setProductList] = useState([]);
    const [productDetail, setProductDetail] = useState({});
    const [product, setProduct] = useState({});

    const merchantCode = window.sessionStorage.getItem("merchantCode");

    async function getProduct(){
        try {
            const list = await getProductList({
                merchantCode: merchantCode
            })
            await setProductList(list.data.info.categoryList);

        }  catch (e) {
            console.error(e);
        }
    }


    const handleCategory = (key, info) => {
        handleCategoryIndex(key);
        handleProductDetail(info);
    }
    const handleCategoryIndex = (key) => {
        setCategoryIndex(key);
    }

    const handleProductDetail = (info) => {
        setProductDetail(info);
    }

    const categoryList = productList.map((item, key) => {
        return(
            <div className={"category_name " + (categoryIndex === key ? "active" : "")} key={key} onClick={() => handleCategory(key, item.productList)}>{item.category.categoryName}</div>
        )
    })

    const selectProduct = info => {
        document.body.style.overflowY = "hidden";
        setProduct(info);
    }
    // 옵션 팝업 닫기
    const closeOptionsPopup =() =>{
        document.body.style.overflowY = "auto";
        setProduct({});
    }

    useEffect(() =>{
        getProduct();
    }, []);

    useEffect(() => {
        if(productList.length > 1){
            handleCategory(0, productList[0].productList);
        }
    }, [productList]);



    return (
        <div className="product_list_wrap">
            <h2>상품 정보</h2>
            <div className="category_list">
                {productList.length > 0 && categoryList}
            </div>
            <div className="product_list">
                <ProductList productList={productDetail} selectProduct={selectProduct}></ProductList>
            </div>
            {product.hasOwnProperty("product") && <ProductOptionsPopup product={product} closeOptionsPopup={closeOptionsPopup}></ProductOptionsPopup>}
        </div>
    )
}

export default ProductInformation;
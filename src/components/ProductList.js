const ProductList = (props) => {
    const productList = props.productList;

    const selectProduct = (info) => {
        props.selectProduct(info);
    }

    const render = () =>{
        if(productList.length > 0){
            return productList.map((productInfo, index) => {
                return (
                    <div className="product" key={index} onClick={() =>selectProduct(productInfo)}>
                        <img src={require("../images/coffee.jpeg")} alt="상품 이미지"/>
                        <h3>{productInfo.product.name}</h3>
                        <p>{productInfo.productItemList[0].price}원</p>
                    </div>
                )
            });

        } else{
            return (
                <div>메뉴가 준비중입니다.</div>
            )
        }
    }
    return (
        render()
    )
}

export default ProductList;
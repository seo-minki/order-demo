
const StoreInformation = () => {
    const storeName = () => {
        let name = "MINT CAFE";
        let storeLogo = require("../images/img_logo_p._bk.png")
        return (
            <h2 className="store_name">
                <div className="store_logo">
                    <span style={{backgroundImage : `url(${storeLogo}`}}></span>
                </div>
                {name}
            </h2>
        )
    }

    const storeImage = () => {
        let imageUrl = require("../images/paymint_img.png");
        return (
            <div style={{backgroundImage : `url(${imageUrl})`}} className="store_image"/>
        )
    }

    const storeIntroduction = () => {
        let introduction =  "페이민트는 고객과 매장의 가치 교환, 거래의 확대를 목표로 합니다.\n" +
            "우리는 안전하고 즐거운 거래를 위한 모든 새로운 아이디어와 기술을 사랑하며 교환을 통한\n" +
            "고객과 매장의 구체적인 가치 증진에 역량을 집중합니다. 그래서 우리는 겉모양만 다른 것을 만들지 않습니다.\n" +
            "다가온 세상을 책임질 근본적으로 새로운 것을 만듭니다."
        return (
            <p className="store_introduction">{introduction}</p>
        )
    }

    return(
        <div className="store_wrapper">
            {storeImage()}
            {storeName()}
            {storeIntroduction()}
        </div>
    )
}

export default StoreInformation
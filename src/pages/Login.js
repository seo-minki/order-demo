import {useState} from "react";
import {useNavigate} from "react-router-dom";
import "../css/login.css";
const Login = () => {

    const [merchantCode, setMerchantCode] = useState("MERAB5C3A5B58E211EE842D1C872C5802CD");

    const inputHandler = (e) => {
        setMerchantCode(e.target.value);
    }

    const disabledButton = () => {
        return !merchantCode || merchantCode.length < 10;
    }

    const navigate = useNavigate();

    const goPage = (path) => {
        navigate(path);
    }

    const saveMerchantCode = () => {
        window.sessionStorage.setItem("merchantCode", merchantCode);
        goPage("/" + merchantCode);
    }

    return (
        <div className="login_wrap">
            <div>
                <h2>사업장 코드 입력</h2>
                <div className="merchant_code_input">
                    <input type={"text"} onChange={inputHandler} value={merchantCode}/>
                </div>


                <button disabled={disabledButton()} onClick={() => saveMerchantCode()}>시작하기</button>
            </div>

        </div>
    )
}

export default Login;
import {useNavigate} from "react-router-dom";
import '../css/header.css';
const Header = () => {
    const navigate = useNavigate();
    const goPage = (path) => {
        navigate(path);
    }

    return (
        <header>
            <h1><img src={require("../images/img_34_character.png")} alt={"icon"}/>주문선생</h1>
            <ul>
                <li onClick={() => goPage("/")}>주문하기</li>
                {/*<li onClick={() => goPage("/cart")}>장바구니<span>0</span></li>*/}
            </ul>

        </header>
    )
}

export default Header;
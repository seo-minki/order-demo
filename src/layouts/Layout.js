import Header from "./Header.js";
import {Routes, Route} from "react-router-dom";
import Login from "../pages/Login";
import OrderList from "../pages/OrderList";
const Layout = () => {
    return(
        <div className={"main_wrapper"}>
            <Header></Header>
            <div className={"contents_wrapper"}>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/:merchantCode" element={<OrderList />}></Route>
                </Routes>
            </div>
        </div>
    )
};

export default Layout;
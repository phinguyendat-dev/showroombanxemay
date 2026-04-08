import React, { Component } from "react";
import { Link } from "react-router-dom";
import MyContext from "../contexts/MyContext";
class Inform extends Component {
  static contextType = MyContext;
  render() {
    const cartCount = this.context.mycart.reduce((s, i) => s + (i.quantity || 0), 0);
    return (
      <div className="header-top">
        <div className="header-top-inner">
          {this.context.token === "" ? (
            <div className="header-auth-links">
              <Link to="/login" className="header-link">Đăng nhập</Link>
              <span className="header-dot" aria-hidden="true" />
              <Link to="/signup" className="header-link">Đăng ký</Link>
              <span className="header-dot" aria-hidden="true" />
              <Link to="/active" className="header-link">Kích hoạt</Link>
            </div>
          ) : (
            <div className="header-user-row">
              <span className="header-greeting">
                Xin chào, <strong>{this.context.customer.name}</strong>
              </span>
              <div className="header-user-links">
                <Link to="/home" className="header-link" onClick={() => this.lnkLogoutClick()}>
                  Đăng xuất
                </Link>
                <Link to="/myprofile" className="header-link">Tài khoản</Link>
                <Link to="/myorders" className="header-link header-link-orders">
                  Đơn hàng
                </Link>
              </div>
            </div>
          )}
          <Link to="/mycart" className="header-cart-link">
            <span className="header-cart-icon" aria-hidden="true">🛒</span>
            <span className="header-cart-text">Giỏ hàng</span>
            <span className="header-cart-badge">{cartCount}</span>
          </Link>
        </div>
      </div>
    );
  }
  lnkLogoutClick() {
    this.context.setToken("");
    this.context.setCustomer(null);
    this.context.setMycart([]);
  }
}

export default Inform;



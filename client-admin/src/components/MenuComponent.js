import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import { Link, NavLink } from "react-router-dom";

class Menu extends Component {
  static contextType = MyContext;

  navClass = ({ isActive }) => (isActive ? "active-admin-nav" : undefined);

  render() {
    return (
      <header className="site-header">
        <div className="header-top">
          <div className="header-top-inner">
            <div className="header-user-row">
              <span className="header-greeting">
                Quản trị viên: <strong>{this.context.username}</strong>
              </span>
              <div className="header-user-links">
                <Link
                  to="/admin/home"
                  className="header-link"
                  onClick={() => this.lnkLogoutClick()}
                >
                  Đăng xuất
                </Link>
              </div>
            </div>
            <span className="header-admin-chip">Admin panel</span>
          </div>
        </div>

        <div className="header-nav">
          <div className="header-nav-brand">
            <Link to="/admin/home" className="header-logo">
              <span className="header-logo-icon" aria-hidden="true">
                🏍️
              </span>
              <span className="header-logo-text">Moto Shop Admin</span>
            </Link>
          </div>
          <nav className="header-nav-menu" aria-label="Menu quản trị">
            <span className="header-nav-label">Điều hướng</span>
            <ul className="nav-menu-list">
              <li>
                <NavLink to="/admin/home" end className={this.navClass}>
                  Trang chủ
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/category" className={this.navClass}>
                  Danh mục
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/product" className={this.navClass}>
                  Xe máy
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/order" className={this.navClass}>
                  Đơn hàng
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/customer" className={this.navClass}>
                  Khách hàng
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }

  lnkLogoutClick() {
    this.context.setToken("");
    this.context.setUsername("");
  }
}

export default Menu;

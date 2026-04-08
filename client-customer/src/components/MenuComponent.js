import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from '../utils/withRouter';
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtKeyword: "",
    };
  }

  render() {
    const cates = this.state.categories.map((item) => {
      return (
        <li key={item._id}>
          <Link to={"/product/category/" + item._id}>{item.name}</Link>
        </li>
      );
    });

    return (
      <div className="header-nav">
        <div className="header-nav-brand">
          <Link to="/home" className="header-logo">
            <span className="header-logo-text">MOTOSHOP</span>
          </Link>
        </div>
        <nav className="header-nav-menu" aria-label="Menu xe">
          <span className="header-nav-label">Menu xe</span>
          <ul className="nav-menu-list">
            <li>
              <Link to="/home">Trang chủ</Link>
            </li>
            {cates}
          </ul>
        </nav>
        <form className="header-search" onSubmit={(e) => this.btnSearchClick(e)}>
          <input
            type="search"
            placeholder="Tìm tên xe, hãng..."
            className="header-search-input"
            value={this.state.txtKeyword}
            onChange={(e) => {
              this.setState({ txtKeyword: e.target.value });
            }}
            aria-label="Từ khóa tìm kiếm"
          />
          <button type="submit" className="header-search-btn">
            Tìm kiếm
          </button>
        </form>
      </div>
    );
  }
  btnSearchClick(e) {
    e.preventDefault();
    const q = (this.state.txtKeyword || "").trim();
    if (!q) return;
    this.props.navigate("/product/search/" + encodeURIComponent(q));
  }
  componentDidMount() {
    this.apiGetCategories();
  }

  // apis
  apiGetCategories() {
    axios.get("/api/customer/categories").then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}
export default withRouter(Menu);


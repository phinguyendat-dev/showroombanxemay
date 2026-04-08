// client-customer/src/components/ProductDetailComponent.js

import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      product: null,
      loading: true,
      txtQuantity: 1,
    };
  }

  isEmptySpec(value) {
    return value == null || String(value).trim() === '';
  }

  renderSpecRow(label, value) {
    const empty = this.isEmptySpec(value);
    return (
      <div className="product-detail-row" key={label}>
        <span className="product-detail-label">{label}</span>
        <span className="product-detail-value">
          {empty ? (
            <span className="product-detail-placeholder">Chưa cập nhật</span>
          ) : (
            value
          )}
        </span>
      </div>
    );
  }

  render() {
    const { product: prod, loading } = this.state;

    if (loading) {
      return (
        <main className="product-detail-page">
          <div className="product-detail-loading" role="status" aria-live="polite">
            <span className="product-detail-loading-pulse" aria-hidden="true" />
            Đang tải thông tin xe…
          </div>
        </main>
      );
    }

    if (!prod) {
      return (
        <main className="product-detail-page">
          <div className="product-detail-empty">
            <p>Không tìm thấy xe hoặc đã bị gỡ khỏi hệ thống.</p>
            <Link to="/home" className="btn-red product-detail-back-btn">
              Về trang chủ
            </Link>
          </div>
        </main>
      );
    }

    const cid = prod.category?._id;
    const cname = prod.category?.name || 'Danh mục';

    let listedDate = null;
    if (prod.cdate != null && prod.cdate !== '') {
      const t = Number(prod.cdate);
      const ms = t < 1e12 ? t * 1000 : t;
      const d = new Date(ms);
      if (!Number.isNaN(d.getTime())) {
        listedDate = d.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      }
    }

    return (
      <main className="product-detail-page">
        <nav className="product-detail-breadcrumb" aria-label="Đường dẫn">
          <Link to="/home">Trang chủ</Link>
          <span className="product-detail-bc-sep" aria-hidden="true">
            /
          </span>
          {cid ? (
            <Link to={`/product/category/${cid}`}>{cname}</Link>
          ) : (
            <span>{cname}</span>
          )}
          <span className="product-detail-bc-sep" aria-hidden="true">
            /
          </span>
          <span className="product-detail-bc-current">{prod.name}</span>
        </nav>

        <header className="product-detail-hero">
          <h1 className="product-detail-hero-title">Chi tiết xe máy</h1>
          <p className="product-detail-hero-sub">
            Thông số kỹ thuật, giá niêm yết và đặt hàng nhanh.
          </p>
        </header>

        <article className="product-detail-card">
          <div className="product-detail-media">
            <div className="product-detail-media-frame">
              <img
                src={'data:image/jpg;base64,' + prod.image}
                alt={prod.name}
                className="product-detail-img"
              />
            </div>
          </div>

          <div className="product-detail-body">
            <div className="product-detail-badges">
              {cid ? (
                <Link
                  to={`/product/category/${cid}`}
                  className="product-detail-cat-badge"
                >
                  {cname}
                </Link>
              ) : (
                <span className="product-detail-cat-badge product-detail-cat-badge-static">
                  {cname}
                </span>
              )}
            </div>

            <h2 className="product-detail-name">
              <span className="product-detail-name-icon" aria-hidden="true">
                🏍️
              </span>
              {prod.name}
            </h2>

            <p className="product-detail-price">
              {prod.price.toLocaleString('vi-VN')}
              <span className="product-detail-price-currency"> VNĐ</span>
            </p>

            <p className="product-detail-id">
              Mã xe{' '}
              <code className="product-detail-id-code" title={prod._id}>
                {prod._id}
              </code>
            </p>

            <section
              className="product-detail-section"
              aria-labelledby="pd-section-info"
            >
              <h3 id="pd-section-info" className="product-detail-section-title">
                Thông tin chung
              </h3>
              <div className="product-detail-rows">
                {this.renderSpecRow('Tên xe', prod.name)}
                {this.renderSpecRow('Danh mục', cname)}
                {listedDate
                  ? this.renderSpecRow('Ngày nhập', listedDate)
                  : null}
              </div>
            </section>

            <section
              className="product-detail-section"
              aria-labelledby="pd-section-spec"
            >
              <h3 id="pd-section-spec" className="product-detail-section-title">
                <span className="product-detail-section-icon" aria-hidden="true">
                  ⚙️
                </span>
                Thông số kỹ thuật
              </h3>
              <div className="product-detail-rows">
                {this.renderSpecRow('Hãng xe', prod.brand)}
                {this.renderSpecRow('Dung tích / phân khối', prod.engine)}
                {this.renderSpecRow('Loại xe', prod.type)}
                {this.renderSpecRow('Màu sắc', prod.color)}
              </div>
            </section>

            <section
              className="product-detail-actions"
              aria-label="Thêm vào giỏ hàng"
            >
              <div className="product-detail-qty">
                <label htmlFor="product-qty-input" className="product-detail-qty-label">
                  Số lượng
                </label>
                <input
                  id="product-qty-input"
                  type="number"
                  className="product-detail-qty-input"
                  min={1}
                  max={99}
                  value={this.state.txtQuantity}
                  onChange={(e) => {
                    let n = parseInt(e.target.value, 10);
                    if (Number.isNaN(n) || n < 1) n = 1;
                    if (n > 99) n = 99;
                    this.setState({ txtQuantity: n });
                  }}
                />
              </div>
              <button
                type="button"
                className="product-detail-add-btn"
                onClick={() => this.btnAdd2CartClick()}
              >
                <span aria-hidden="true">🛒</span>
                Thêm vào giỏ hàng
              </button>
            </section>

            <p className="product-detail-hint">
              Giao xe trong 24h · Hotline{' '}
              <strong className="cart-trust-hotline">1800 1234</strong>
            </p>
          </div>
        </article>
      </main>
    );
  }

  componentDidMount() {
    const id = this.props.params?.id;
    if (id) this.apiGetProduct(id);
    else this.setState({ loading: false, product: null });
  }

  componentDidUpdate(prevProps) {
    const id = this.props.params?.id;
    if (id && id !== prevProps.params?.id) {
      this.apiGetProduct(id);
    }
  }

  apiGetProduct(id) {
    this.setState({ loading: true, product: null });
    axios
      .get('/api/customer/products/' + id)
      .then((res) => {
        this.setState({ product: res.data, loading: false });
      })
      .catch(() => {
        this.setState({ product: null, loading: false });
      });
  }

  btnAdd2CartClick() {
    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity, 10);

    if (!quantity || quantity < 1) {
      alert('Vui lòng nhập số lượng hợp lệ!');
      return;
    }

    const mycart = [...this.context.mycart];
    const index = mycart.findIndex((x) => x.product._id === product._id);

    if (index === -1) {
      mycart.push({ product, quantity });
    } else {
      mycart[index] = {
        ...mycart[index],
        quantity: mycart[index].quantity + quantity,
      };
    }

    this.context.setMycart(mycart);
    alert('Đã thêm xe vào giỏ hàng! ');
  }
}

export default withRouter(ProductDetail);

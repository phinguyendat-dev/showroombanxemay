import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      selectedProduct: null,
      isPanelOpen: false,
      panelEditMode: false
    };
  }

  viewDetail = (item) => {
    this.setState({
      selectedProduct: item,
      isPanelOpen: true,
      panelEditMode: false
    });
  };

  updateProductsFromDetail = (products, noPages, curPage) => {
    this.setState((prev) => {
      const sel = prev.selectedProduct
        ? (products || []).find((p) => p._id === prev.selectedProduct._id)
        : null;
      if (!sel) {
        return {
          products: products || [],
          noPages,
          curPage,
          selectedProduct: null,
          isPanelOpen: false,
          panelEditMode: false
        };
      }
      return {
        products: products || [],
        noPages,
        curPage,
        selectedProduct: sel
      };
    });
  };

  formatCdate(cdate) {
    if (cdate == null || cdate === '') return '—';
    const t = Number(cdate);
    const ms = t < 1e12 ? t * 1000 : t;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('vi-VN');
  }

  render() {
    const prods = this.state.products.map((item) => (
      <div
        key={item._id}
        className="admin-product-card"
        onClick={() => this.viewDetail(item)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.viewDetail(item);
          }
        }}
      >
        <div className="admin-product-card-img-wrap">
          <img
            className="admin-product-card-img"
            src={'data:image/jpg;base64,' + item.image}
            alt={item.name}
          />
        </div>
        <div className="admin-product-card-body">
          <h4 className="admin-product-card-title">{item.name}</h4>
          <p className="admin-product-card-price">
            {(item.price || 0).toLocaleString('vi-VN')} VNĐ
          </p>
          <span className="admin-product-card-badge">
            {item.category?.name || 'Không rõ'}
          </span>
        </div>
      </div>
    ));

    const sp = this.state.selectedProduct;
    const layoutClass =
      'admin-product-layout' + (this.state.isPanelOpen && sp ? ' has-panel' : '');

    return (
      <main className="admin-page admin-product-wrap">
        <div className="admin-product-header">
          <h2 className="admin-product-title">Danh sách xe đang bán</h2>
          <p className="admin-product-sub">
            Tổng cộng: {this.state.products.length} sản phẩm (trang {this.state.curPage}/
            {this.state.noPages || 1})
          </p>
        </div>

        <div className={layoutClass}>
          <div className="admin-product-grid">{prods}</div>

          {this.state.isPanelOpen && sp && (
            <aside className="admin-product-side-panel">
              <div className="admin-product-panel-toolbar">
                <span className="admin-product-panel-toolbar-title">
                  {this.state.panelEditMode ? 'Chỉnh sửa trong CMS' : 'Xem nhanh'}
                </span>
                <button
                  type="button"
                  className="admin-product-panel-close"
                  onClick={() =>
                    this.setState({
                      isPanelOpen: false,
                      panelEditMode: false
                    })
                  }
                  aria-label="Đóng panel"
                >
                  ×
                </button>
              </div>

              {this.state.panelEditMode ? (
                <>
                  <button
                    type="button"
                    className="admin-product-back-preview"
                    onClick={() => this.setState({ panelEditMode: false })}
                  >
                    ← Quay lại xem nhanh
                  </button>
                  <ProductDetail
                    key={sp._id}
                    item={sp}
                    curPage={this.state.curPage}
                    updateProducts={this.updateProductsFromDetail}
                  />
                </>
              ) : (
                <>
                  <img
                    className="admin-product-detail-img"
                    src={'data:image/jpg;base64,' + sp.image}
                    alt={sp.name}
                  />
                  <h3 className="admin-product-detail-title">{sp.name}</h3>
                  <div className="admin-product-detail-price">
                    {(sp.price || 0).toLocaleString('vi-VN')} VNĐ
                  </div>
                  <div className="admin-product-spec-box">
                    <strong>Thông tin</strong>
                    <p>
                      Mẫu <strong>{sp.name}</strong> — danh mục{' '}
                      <strong>{sp.category?.name || '—'}</strong>.
                    </p>
                    <div className="admin-product-spec-grid">
                      <div>
                        <b>Hãng:</b> {sp.brand || '—'}
                      </div>
                      <div>
                        <b>Động cơ:</b> {sp.engine || '—'}
                      </div>
                      <div>
                        <b>Loại:</b> {sp.type || '—'}
                      </div>
                      <div>
                        <b>Màu:</b> {sp.color || '—'}
                      </div>
                      <div>
                        <b>Ngày:</b> {this.formatCdate(sp.cdate)}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="admin-product-cta"
                    onClick={() => this.setState({ panelEditMode: true })}
                  >
                    Chỉnh sửa thông tin (CMS)
                  </button>
                </>
              )}
            </aside>
          )}
        </div>

        <div className="admin-pagination">{this.renderPagination()}</div>
      </main>
    );
  }

  renderPagination() {
    const pages = [];
    for (let i = 1; i <= this.state.noPages; i++) {
      pages.push(
        <button
          key={i}
          type="button"
          className={
            'admin-page-btn' + (i === this.state.curPage ? ' is-current' : '')
          }
          onClick={() => this.apiGetProducts(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  }

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }

  apiGetProducts(page) {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios
      .get('/api/admin/products?page=' + page, config)
      .then((res) => {
        this.setState({
          products: res.data.products || [],
          noPages: res.data.noPages || 0,
          curPage: res.data.curPage || 1
        });
      })
      .catch((err) => console.error('API lỗi:', err));
  }
}

export default Product;

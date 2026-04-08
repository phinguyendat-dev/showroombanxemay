import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: 0,
      txtBrand: '',
      txtEngine: '',
      txtType: '',
      txtColor: '',
      cmbCategory: '',
      imgProduct: ''
    };
  }

  render() {
    const cats = this.state.categories.map((cate) => (
      <option key={cate._id} value={cate._id}>
        {cate.name}
      </option>
    ));

    return (
      <div className="admin-product-form">
        <h3>Thông tin xe (form quản trị)</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="admin-field">
            <label>ID</label>
            <input className="admin-input" value={this.state.txtID} readOnly />
          </div>
          <div className="admin-field">
            <label>Tên xe</label>
            <input
              className="admin-input"
              placeholder="Tên xe"
              value={this.state.txtName}
              onChange={(e) => this.setState({ txtName: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>Giá</label>
            <input
              type="number"
              className="admin-input"
              value={this.state.txtPrice}
              onChange={(e) => this.setState({ txtPrice: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>Hãng</label>
            <input
              className="admin-input"
              placeholder="Hãng"
              value={this.state.txtBrand}
              onChange={(e) => this.setState({ txtBrand: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>Động cơ</label>
            <input
              className="admin-input"
              placeholder="Động cơ"
              value={this.state.txtEngine}
              onChange={(e) => this.setState({ txtEngine: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>Loại</label>
            <input
              className="admin-input"
              placeholder="Loại"
              value={this.state.txtType}
              onChange={(e) => this.setState({ txtType: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>Màu</label>
            <input
              className="admin-input"
              placeholder="Màu"
              value={this.state.txtColor}
              onChange={(e) => this.setState({ txtColor: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>Danh mục</label>
            <select
              className="admin-input"
              value={this.state.cmbCategory}
              onChange={(e) => this.setState({ cmbCategory: e.target.value })}
            >
              <option value="">-- Chọn --</option>
              {cats}
            </select>
          </div>
          <div className="admin-field">
            <label>Ảnh</label>
            <input type="file" className="admin-input" onChange={(e) => this.previewImage(e)} />
          </div>
          {this.state.imgProduct ? (
            <img src={this.state.imgProduct} alt="" style={{ width: '100%', borderRadius: 8, marginBottom: 16 }} />
          ) : null}
          <div className="admin-form-actions">
            <button type="button" className="admin-btn-add" onClick={(e) => this.btnAddClick(e)}>
              Thêm
            </button>
            <button type="button" className="admin-btn-update" onClick={(e) => this.btnUpdateClick(e)}>
              Cập nhật
            </button>
            <button type="button" className="admin-btn-delete" onClick={(e) => this.btnDeleteClick(e)}>
              Xóa
            </button>
          </div>
        </form>
      </div>
    );
  }

  hydrateFromItem(p) {
    if (!p) return;
    this.setState({
      txtID: p._id || '',
      txtName: p.name || '',
      txtPrice: p.price || 0,
      txtBrand: p.brand || '',
      txtEngine: p.engine || '',
      txtType: p.type || '',
      txtColor: p.color || '',
      cmbCategory: p.category?._id || '',
      imgProduct: p.image ? 'data:image/jpg;base64,' + p.image : ''
    });
  }

  componentDidMount() {
    this.apiGetCategories();
    if (this.props.item) {
      this.hydrateFromItem(this.props.item);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item) {
      this.hydrateFromItem(this.props.item);
    }
  }

  previewImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      this.setState({ imgProduct: evt.target.result });
    };
    reader.readAsDataURL(file);
  }

  btnAddClick(e) {
    e.preventDefault();
    const { txtName, txtPrice, cmbCategory, imgProduct } = this.state;
    if (!imgProduct) {
      alert('Chọn ảnh!');
      return;
    }
    const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');
    if (txtName && txtPrice && cmbCategory) {
      const prod = {
        name: txtName,
        price: parseInt(txtPrice, 10) || 0,
        category: cmbCategory,
        image,
        brand: this.state.txtBrand || '',
        engine: this.state.txtEngine || '',
        type: this.state.txtType || '',
        color: this.state.txtColor || ''
      };
      this.apiPostProduct(prod);
    } else {
      alert('Thiếu dữ liệu!');
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtID, txtName, txtPrice, cmbCategory, imgProduct } = this.state;
    if (!txtID) {
      alert('Chọn sản phẩm!');
      return;
    }
    const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');
    const prod = {
      name: txtName,
      price: parseInt(txtPrice, 10) || 0,
      category: cmbCategory,
      image,
      brand: this.state.txtBrand || '',
      engine: this.state.txtEngine || '',
      type: this.state.txtType || '',
      color: this.state.txtColor || ''
    };
    this.apiPutProduct(txtID, prod);
  }

  btnDeleteClick(e) {
    e.preventDefault();
    if (!this.state.txtID) {
      alert('Chọn sản phẩm!');
      return;
    }
    if (window.confirm('Xóa sản phẩm?')) {
      this.apiDeleteProduct(this.state.txtID);
    }
  }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get('/api/admin/categories', config)
      .then((res) => this.setState({ categories: res.data || [] }))
      .catch((err) => console.log(err));
  }

  apiPostProduct(prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .post('/api/admin/products', prod, config)
      .then(() => {
        alert('Thêm OK');
        this.apiGetProducts();
      })
      .catch((err) => console.log(err));
  }

  apiPutProduct(id, prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .put('/api/admin/products/' + id, prod, config)
      .then(() => {
        alert('Cập nhật OK');
        this.apiGetProducts();
      })
      .catch((err) => console.log(err));
  }

  apiDeleteProduct(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .delete('/api/admin/products/' + id, config)
      .then(() => {
        alert('Đã xóa');
        this.apiGetProducts();
      })
      .catch((err) => console.log(err));
  }

  apiGetProducts() {
    if (typeof this.props.updateProducts !== 'function') return;
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get('/api/admin/products?page=' + this.props.curPage, config)
      .then((res) => {
        this.props.updateProducts(
          res.data.products,
          res.data.noPages,
          res.data.curPage
        );
      })
      .catch((err) => console.log(err));
  }
}

export default ProductDetail;

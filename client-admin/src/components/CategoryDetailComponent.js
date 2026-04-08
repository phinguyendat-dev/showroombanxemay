import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';

class CategoryDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: ''
    };
  }

  componentDidUpdate(prevProps) {
    const it = this.props.item;
    if (it !== prevProps.item) {
      if (it) {
        this.setState({ txtID: it._id, txtName: it.name });
      } else {
        this.setState({ txtID: '', txtName: '' });
      }
    }
  }

  render() {
    return (
      <div className="admin-form-panel">
        <h2>Thông tin chi tiết</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="admin-field">
            <label htmlFor="cat-id">Định danh hệ thống (ID)</label>
            <input
              id="cat-id"
              type="text"
              className="admin-input"
              readOnly
              value={this.state.txtID}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="cat-name">Tên dòng xe / loại xe</label>
            <input
              id="cat-name"
              type="text"
              className="admin-input"
              value={this.state.txtName}
              placeholder="Ví dụ: Xe phân khối lớn…"
              onChange={(e) => this.setState({ txtName: e.target.value })}
            />
          </div>
          <div className="admin-form-actions">
            <button type="button" className="admin-btn-add" onClick={(e) => this.btnAddClick(e)}>
               Thêm mới
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

  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    if (name) {
      const config = { headers: { 'x-access-token': this.context.token } };
      axios.post('/api/admin/categories', { name }, config).then((res) => {
        if (res.data) {
          this.apiGetCategories();
          this.setState({ txtID: '', txtName: '' });
        }
      });
    } else {
      alert('Vui lòng nhập tên loại xe!');
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    if (id && name) {
      const config = { headers: { 'x-access-token': this.context.token } };
      axios.put('/api/admin/categories/' + id, { name }, config).then((res) => {
        if (res.data) this.apiGetCategories();
      });
    }
  }

  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('Xóa vĩnh viễn loại xe này?')) {
      const id = this.state.txtID;
      if (id) {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.delete('/api/admin/categories/' + id, config).then((res) => {
          if (res.data) {
            this.apiGetCategories();
            this.setState({ txtID: '', txtName: '' });
          }
        });
      }
    }
  }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      this.props.updateCategories(res.data);
    });
  }
}

export default CategoryDetail;

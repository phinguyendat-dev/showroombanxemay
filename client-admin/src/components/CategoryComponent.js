import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = { categories: [], itemSelected: null };
  }

  render() {
    const cats = this.state.categories.map((item) => {
      const isSelected = this.state.itemSelected?._id === item._id;
      return (
        <tr
          key={item._id}
          onClick={() => this.setState({ itemSelected: item })}
          style={{
            cursor: 'pointer',
            background: isSelected ? 'rgba(192, 57, 43, 0.08)' : undefined
          }}
        >
          <td style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{item._id}</td>
          <td style={{ fontWeight: '700', color: isSelected ? 'var(--color-primary)' : undefined }}>
            {item.name}
          </td>
        </tr>
      );
    });

    return (
      <main className="admin-page">
        <div className="admin-page-hero">
          <h2> Danh mục xe</h2>
          <p>Chọn một dòng để sửa hoặc thêm loại xe mới.</p>
        </div>
        <div className="admin-two-col">
          <div className="admin-panel-card">
            <h3 className="section-title">Danh sách loại xe</h3>
            <div className="admin-table-wrap">
              <table className="datatable">
                <thead>
                  <tr>
                    <th>Mã ID</th>
                    <th>Tên loại xe</th>
                  </tr>
                </thead>
                <tbody>{cats}</tbody>
              </table>
            </div>
          </div>
          <div>
            <CategoryDetail
              item={this.state.itemSelected}
              updateCategories={this.updateCategories}
            />
          </div>
        </div>
      </main>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  updateCategories = (allcats) => {
    this.setState({ categories: allcats });
  };

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      this.setState({ categories: res.data });
    });
  }
}

export default Category;

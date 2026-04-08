import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';

class Home extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      totalProducts: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalRevenue: 0,
      recentOrders: [],
    };
  }

  statusClass(status) {
    if (status === 'APPROVED') return 'badge-approved';
    if (status === 'CANCELED') return 'badge-canceled';
    return 'badge-pending';
  }

  statusLabel(status) {
    if (status === 'APPROVED') return '✅ Đã duyệt';
    if (status === 'CANCELED') return '❌ Đã hủy';
    return '⏳ Chờ duyệt';
  }

  render() {
    const recentOrders = this.state.recentOrders.slice(0, 5).map((item) => (
      <tr key={item._id}>
        <td style={{ fontSize: '11px', color: '#888' }}>{item._id}</td>
        <td>{new Date(item.cdate).toLocaleString('vi-VN')}</td>
        <td style={{ fontWeight: '700' }}>{item.customer?.name || '---'}</td>
        <td>{item.customer?.phone || '---'}</td>
        <td style={{ color: 'var(--color-primary)', fontWeight: '800' }}>
          {item.total.toLocaleString('vi-VN')} VNĐ
        </td>
        <td>
          <span className={`badge ${this.statusClass(item.status)}`}>
            {this.statusLabel(item.status)}
          </span>
        </td>
      </tr>
    ));

    return (
      <main className="admin-page">
        <div className="admin-home-banner">
          <h1> Moto Shop Admin</h1>
          <p>
            Hệ thống quản lý showroom — Chào mừng, <b>{this.context.username}</b>!
          </p>
        </div>

        <h3 className="section-title"> Thống kê tổng quan</h3>
        <div className="admin-stat-grid">
          <div className="admin-stat-card">
            <p style={{ fontSize: '2.25rem', margin: 0 }}></p>
            <p style={{ fontSize: '1.85rem', fontWeight: '800', margin: '10px 0', color: 'var(--color-text)' }}>
              {this.state.totalProducts}
            </p>
            <p style={{ margin: 0, color: 'var(--color-muted)', fontWeight: '600', fontSize: '13px' }}>
              TỔNG SỐ XE
            </p>
          </div>
          <div className="admin-stat-card">
            <p style={{ fontSize: '2.25rem', margin: 0 }}></p>
            <p style={{ fontSize: '1.85rem', fontWeight: '800', margin: '10px 0', color: 'var(--color-text)' }}>
              {this.state.totalOrders}
            </p>
            <p style={{ margin: 0, color: 'var(--color-muted)', fontWeight: '600', fontSize: '13px' }}>
              ĐƠN HÀNG
            </p>
          </div>
          <div className="admin-stat-card admin-stat-card--dark">
            <p style={{ fontSize: '2.25rem', margin: 0 }}>💰</p>
            <p style={{ fontSize: '1.25rem', fontWeight: '800', margin: '14px 0', color: 'var(--color-primary)' }}>
              {this.state.totalRevenue.toLocaleString('vi-VN')}
            </p>
            <p style={{ margin: 0, color: 'var(--color-muted)', fontWeight: '600', fontSize: '13px' }}>
              DOANH THU (VNĐ)
            </p>
          </div>
          <div className="admin-stat-card">
            <p style={{ fontSize: '2.25rem', margin: 0 }}></p>
            <p style={{ fontSize: '1.85rem', fontWeight: '800', margin: '10px 0', color: 'var(--color-text)' }}>
              {this.state.totalCustomers}
            </p>
            <p style={{ margin: 0, color: 'var(--color-muted)', fontWeight: '600', fontSize: '13px' }}>
              KHÁCH HÀNG
            </p>
          </div>
        </div>

        <div className="admin-panel-card">
          <h3 className="section-title"> Giao dịch gần đây</h3>
          {this.state.recentOrders.length > 0 ? (
            <div className="admin-table-wrap">
              <table className="datatable">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Thời gian</th>
                    <th>Khách hàng</th>
                    <th>SĐT</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>{recentOrders}</tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-box">Hiện chưa có phát sinh giao dịch mới.</div>
          )}
        </div>

        <div className="admin-tip-box">
          <h4> Mẹo quản lý nhanh</h4>
          <ul>
            <li><b>Xe máy:</b> Đăng mẫu xe mới, cập nhật giá và phân khối.</li>
            <li><b>Danh mục:</b> Phân loại xe ga, xe số, moto PKL…</li>
            <li><b>Đơn hàng:</b> Duyệt hoặc hủy đơn đặt xe trực tuyến.</li>
          </ul>
        </div>
      </main>
    );
  }

  componentDidMount() {
    this.apiGetStats();
  }

  apiGetStats() {
    const config = { headers: { 'x-access-token': this.context.token } };

    axios.get('/api/admin/products?page=1', config).then((res) => {
      const total = (res.data.noPages || 0) * 4;
      this.setState({ totalProducts: total });
    }).catch((err) => console.log(err));

    axios.get('/api/admin/orders', config).then((res) => {
      const orders = res.data || [];
      const revenue = orders
        .filter((o) => o.status === 'APPROVED')
        .reduce((sum, o) => sum + o.total, 0);

      this.setState({
        totalOrders: orders.length,
        totalRevenue: revenue,
        recentOrders: orders.slice(0, 5),
      });
    }).catch((err) => console.log(err));

    axios.get('/api/admin/customers', config).then((res) => {
      this.setState({ totalCustomers: (res.data || []).length });
    }).catch((err) => console.log(err));
  }
}

export default Home;

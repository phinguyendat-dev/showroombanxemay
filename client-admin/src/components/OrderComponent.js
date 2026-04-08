// client-admin/src/components/OrderComponent.js

import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
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

  typeClass(type) {
    if (type === 'Xe số') return 'badge-type-so';
    if (type === 'Xe ga') return 'badge-type-ga';
    if (type === 'Xe côn tay') return 'badge-type-con';
    if (type === 'Xe điện') return 'badge-type-dien';
    return 'badge-type-default';
  }

  render() {
    const orders = this.state.orders.map((item) => (
      <tr
        key={item._id}
        onClick={() => this.trItemClick(item)}
        style={{
          cursor: 'pointer',
          background: this.state.order?._id === item._id ? '#fff8f0' : undefined
        }}
      >
        <td style={{ fontSize: '12px', color: '#999' }}>{item._id}</td>
        <td>{new Date(item.cdate).toLocaleString('vi-VN')}</td>
        <td style={{ fontWeight: '700' }}>{item.customer?.name || '---'}</td>
        <td>{item.customer?.phone || '---'}</td>
        <td style={{ color: 'var(--color-primary)', fontWeight: '800', textAlign: 'right' }}>
          {item.total.toLocaleString('vi-VN')} VNĐ
        </td>
        <td>
          <span className={`badge ${this.statusClass(item.status)}`}>
            {this.statusLabel(item.status)}
          </span>
        </td>
        <td>
          <div className="btn-admin-group" onClick={(e) => e.stopPropagation()}>
            {item.status === 'PENDING' && (
              <>
                <button
                  type="button"
                  className="btn-admin btn-admin-success"
                  onClick={() => this.lnkApproveClick(item._id)}
                >
                  Duyệt
                </button>
                <button
                  type="button"
                  className="btn-admin btn-admin-danger"
                  onClick={() => this.lnkCancelClick(item._id)}
                >
                  Hủy
                </button>
              </>
            )}
            <button
              type="button"
              className="btn-admin btn-admin-danger"
              style={{ opacity: 0.95 }}
              title="Xoá vĩnh viễn khỏi CSDL"
              onClick={() => this.lnkDeleteClick(item._id)}
            >
              Xoá
            </button>
          </div>
        </td>
      </tr>
    ));

    const items = this.state.order?.items?.map((item, index) => (
      <tr key={item.product._id || index}>
        <td>{index + 1}</td>
        <td style={{ fontSize: '11px', color: '#999' }}>{item.product._id}</td>
        <td style={{ fontWeight: '700' }}>{item.product.name}</td>
        <td>
          <span className="badge badge-brand">{item.product.brand || '---'}</span>
        </td>
        <td>
          <span className={`badge ${this.typeClass(item.product.type)}`}>
            {item.product.type || '---'}
          </span>
        </td>
        <td>
          <img
            src={'data:image/jpg;base64,' + item.product.image}
            width="70"
            height="50"
            alt={item.product.name}
            style={{ borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--color-border)' }}
          />
        </td>
        <td style={{ color: 'var(--color-primary)', textAlign: 'right' }}>
          {item.product.price.toLocaleString('vi-VN')} VNĐ
        </td>
        <td style={{ textAlign: 'center', fontWeight: '700' }}>{item.quantity}</td>
        <td style={{ color: 'var(--color-primary)', fontWeight: '800', textAlign: 'right' }}>
          {(item.product.price * item.quantity).toLocaleString('vi-VN')} VNĐ
        </td>
      </tr>
    )) || [];

    const pending = this.state.orders.filter((o) => o.status === 'PENDING').length;
    const approved = this.state.orders.filter((o) => o.status === 'APPROVED').length;

    return (
      <main className="admin-page">
        <div className="admin-page-hero">
          <h2> Quản lý đơn hàng</h2>
          <p>Duyệt, hủy, xoá đơn hoặc xoá hàng loạt từ một dòng xuống cuối danh sách.</p>
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-admin btn-admin-danger"
            disabled={!this.state.order}
            title="Chọn một dòng trong bảng trước, rồi bấm để xoá dòng đó và mọi dòng phía dưới"
            onClick={() => this.lnkDeleteFromSelectionDownClick()}
          >
            Xoá từ đơn đang chọn xuống cuối
          </button>
          {!this.state.order && (
            <span style={{ color: '#6b7280', fontSize: '13px' }}>— Bấm một dòng để chọn đơn, sau đó dùng nút này</span>
          )}
        </div>

        <div className="admin-stat-row">
          <div className="admin-stat-pill admin-stat-pill--pending">
            Chờ duyệt
            <b>{pending}</b>
          </div>
          <div className="admin-stat-pill admin-stat-pill--ok">
            Đã duyệt
            <b>{approved}</b>
          </div>
          <div className="admin-stat-pill admin-stat-pill--info">
            Tổng đơn
            <b>{this.state.orders.length}</b>
          </div>
        </div>

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
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>{orders}</tbody>
          </table>
        </div>

        {this.state.order && (
          <div className="admin-order-detail">
            <div className="admin-order-detail-head">
              <h3>🧾 Chi tiết #{this.state.order._id}</h3>
              <button
                type="button"
                className="btn-admin-close"
                onClick={() => this.setState({ order: null })}
              >
                Đóng
              </button>
            </div>
            <div className="admin-table-wrap">
              <table className="datatable">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã xe</th>
                    <th>Tên xe</th>
                    <th>Hãng</th>
                    <th>Loại</th>
                    <th>Ảnh</th>
                    <th>Đơn giá</th>
                    <th>SL</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {items}
                  <tr style={{ background: '#fff8f0' }}>
                    <td colSpan="7" style={{ textAlign: 'right', fontWeight: '700' }}>
                      Tổng đơn:
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '800' }}>
                      {this.state.order.items.reduce((s, i) => s + i.quantity, 0)} xe
                    </td>
                    <td style={{ color: 'var(--color-primary)', fontWeight: '800', fontSize: '16px', textAlign: 'right' }}>
                      {this.state.order.total.toLocaleString('vi-VN')} VNĐ
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    );
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  trItemClick(item) {
    this.setState({ order: item });
  }

  lnkApproveClick(id) {
    if (window.confirm('Xác nhận duyệt đơn hàng này?')) {
      this.apiPutOrderStatus(id, 'APPROVED');
    }
  }

  lnkCancelClick(id) {
    if (window.confirm('Xác nhận hủy đơn hàng này?')) {
      this.apiPutOrderStatus(id, 'CANCELED');
    }
  }

  lnkDeleteClick(id) {
    if (
      window.confirm(
        'Xoá vĩnh viễn đơn này khỏi hệ thống? (Khác với "Hủy" — dữ liệu sẽ bị xoá khỏi CSDL, không hoàn tác.)'
      )
    ) {
      this.apiDeleteOrder(id);
    }
  }

  lnkDeleteFromSelectionDownClick() {
    const pivot = this.state.order;
    if (!pivot) return;
    const list = this.state.orders;
    const idx = list.findIndex((o) => o._id === pivot._id);
    if (idx < 0) return;
    const slice = list.slice(idx);
    const ids = slice.map((o) => o._id);
    const n = ids.length;
    if (
      !window.confirm(
        `Sẽ xoá vĩnh viễn ${n} đơn (từ đơn đang chọn xuống hết danh sách hiện tại). Không hoàn tác. Tiếp tục?`
      )
    ) {
      return;
    }
    this.apiBulkDeleteOrders(ids);
  }

  apiDeleteOrder(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .delete('/api/admin/orders/' + id, config)
      .then((res) => {
        if (res.data) {
          alert('Đã xoá đơn hàng.');
          this.apiGetOrders();
          this.setState({ order: null });
        }
      })
      .catch(() => alert('Không xoá được đơn. Thử lại sau.'));
  }

  apiBulkDeleteOrders(ids) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .post('/api/admin/orders/bulk-delete', { ids }, config)
      .then((res) => {
        if (res.data && res.data.success) {
          alert(`Đã xoá ${res.data.deletedCount} đơn hàng.`);
          this.apiGetOrders();
          this.setState({ order: null });
        }
      })
      .catch(() => alert('Không xoá được. Thử lại sau.'));
  }

  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      this.setState({ orders: res.data });
    });
  }

  apiPutOrderStatus(id, status) {
    const body = { status };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/orders/status/' + id, body, config).then((res) => {
      if (res.data) {
        alert(status === 'APPROVED' ? '✅ Đã duyệt đơn hàng!' : '❌ Đã hủy đơn hàng!');
        this.apiGetOrders();
        this.setState({ order: null });
      }
    });
  }
}

export default Order;

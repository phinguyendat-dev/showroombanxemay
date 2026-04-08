import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

// Khôi phục các thành phần cốt lõi của bạn
import Home from './HomeComponent';
import Category from './CategoryComponent';
import Product from './ProductComponent';
import Order from './OrderComponent';
import Customer from './CustomerComponent';
import Menu from './MenuComponent';

class Main extends Component {
  static contextType = MyContext;

  render() {
    // Chỉ thực hiện kiểm tra Token để đảm bảo bảo mật
    if (this.context.token === '') return (<Navigate replace to='/admin/login' />);

    return (
      <div className="body-admin">
        <Menu />
        <Routes>
          <Route path='/admin/home' element={<Home />} />
          <Route path='/admin/category' element={<Category />} />
          <Route path='/admin/product' element={<Product />} />
          <Route path='/admin/order' element={<Order />} />
          <Route path='/admin/customer' element={<Customer />} />
          <Route path='/admin' element={<Navigate replace to='/admin/home' />} />
        </Routes>
      </div>
    );
  }
}

export default Main;
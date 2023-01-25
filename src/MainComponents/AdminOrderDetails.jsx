import React, { useContext, useEffect, useState } from 'react';
import './AdminPortalHome.css';
import Image from '../Assests/landscape.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const AdminPortalOrderDetails = () => {
  const navigation = useNavigate();
  const { dispatch } = useContext(UserContext);
  const [orderList, setOrderList] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URI}/admin/orders/all`, {
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          setOrderList(result.data.orders);
        } else {
          console.log(result.error.message);
        }
      });
  }, [orderList]);

  const handleOrderStatus = (
    orderId,
    paymentMode,
    orderStatus,
    paymentStatus
  ) => {
    fetch(
      `${process.env.REACT_APP_API_URI}/admin/order/${orderId}/status/update`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.token,
        },
        body: JSON.stringify({
          orderStatus,
          paymentMode,
          paymentStatus,
        }),
      }
    )
      .then(res => res.json())
      .then(result => {
        if (result.status == 'success') {
          console.log(result);
          const newData = orderList.filter(item => {
            if (item.orderId == orderId) return result.data.order;
            else return item;
          });
          setOrderList(newData);
          toast.success('Order status updated.');
        } else console.log(result.error);
      })
      .catch(err => console.log(err));
  };

  const handleCancelOrder = orderId => {
    fetch(`${process.env.REACT_APP_API_URI}/admin/order/${orderId}/cancel`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.token,
      },
      body: JSON.stringify({
        cancelled: true,
        orderStatus: 'Cancelled By Admin',
      }),
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        if (result.status == 'success') {
          const newData = orderList.filter(item => {
            if (item.orderId == orderId) return result.data.order;
            else return item;
          });
          setOrderList(newData);
        } else console.log(result.error);
      })
      .catch(err => console.log(err));
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: 'CLEAR' });
    navigation('/');
  };

  return (
    <div>
      <ToastContainer />
      <div className='adminPageNavbar'>
        <div className='adminBrandnameNavbar'>E-com | Admin Page</div>
        <Link to='/Home'>
          <div className='adminNavbarItems'>
            Add Product <div className='adminNavbarItemsUnActiveline'></div>
          </div>
        </Link>
        <Link to='/Products'>
          <div className='adminNavbarItems'>
            Products On Site{' '}
            <div className='adminNavbarItemsUnActiveline'></div>
          </div>
        </Link>
        <div className='adminNavbarItems'>
          Order Details <div className='adminNavbarItemsActiveline'></div>
        </div>
        <div
          className='adminLogoutButton'
          onClick={() => {
            handleLogout();
          }}
        >
          Logout <div className='adminNavbarItemsUnActiveline '></div>
        </div>
        <div className='adminPagemainContainer'>
          <div className='addarticleHeading'>Order Details</div>
          {orderList.map(item => (
            <div className='eachOrderContainer' key={item._id}>
              <div className='orderDetailingContainer'>
                <div className='itemName'>Order Id : #{item._id}</div>
                <ul>
                  {item.cart.map(cartItem => (
                    <li key={cartItem._id} className='listItem'>
                      <div className='itemPrice'>
                        {cartItem.product
                          ? `Item name : ${cartItem.product.name} | Reselled Item id : ${cartItem.product._id} |
                      Quantity : ${cartItem.quantity} | Product Id : #${cartItem.product.productId}`
                          : `Product Deleted |
                      Quantity : ${cartItem.quantity}`}
                      </div>
                    </li>
                  ))}

                  {/* <li>
                  <div className='itemPrice'>
                    Item name : Cotton Tshirt | Reselled Item id : #jac14123 |
                    Quantity : 2 | Product Id : #1234123163
                  </div>
                </li> */}
                  {/* <li>
                    <div className='itemPrice'>
                      Item name : Cotton Tshirt | Reselled Item id : #jac14123 |
                      Quantity : 2 | Product Id : #1234123163
                    </div>
                  </li> */}
                </ul>
                {/* <div className='itemPrice'>Reseller Id : Reseller</div> */}
                <div className='itemPrice'>
                  Payment Status : {item.paymentMode}
                </div>
                <div>Delivery Status : {item.orderStatus}</div>
                <div className='orderStatusInfoContainer'>
                  <input
                    type='radio'
                    id='placed'
                    name={`status ${item._id}`}
                    defaultChecked={item.orderStatus == 'Placed'}
                    onClick={() =>
                      handleOrderStatus(
                        item._id,
                        item.paymentMode,
                        'Placed',
                        item.paymentStatus
                      )
                    }
                    value='placed'
                  />
                  <label for='placed'>Placed</label>
                  <input
                    type='radio'
                    id='shipped'
                    name={`status ${item._id}`}
                    value='shipped'
                    defaultChecked={item.orderStatus == 'Shipped'}
                    onClick={() =>
                      handleOrderStatus(
                        item._id,
                        item.paymentMode,
                        'Shipped',
                        item.paymentStatus
                      )
                    }
                  />
                  <label for='shipped'>Shipped</label>

                  <input
                    type='radio'
                    id='delivered'
                    name={`status ${item._id}`}
                    defaultChecked={item.orderStatus == 'Delivered'}
                    onClick={() =>
                      handleOrderStatus(
                        item._id,
                        item.paymentMode,
                        'Delivered',
                        item.paymentStatus
                      )
                    }
                    value='delivered'
                  />
                  <label for='delivered'>Delivered</label>
                </div>
                <div className='note'>
                  *if status will be changed to delivered resellers wallet will
                  be updated
                </div>
              </div>
              {item.cancelled ? (
                <div className='cancelButton'>Order Cancelled</div>
              ) : (
                <div
                  className='cancelButton'
                  onClick={() => handleCancelOrder(item._id)}
                >
                  Cancel
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPortalOrderDetails;

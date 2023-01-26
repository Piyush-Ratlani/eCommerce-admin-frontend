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
  const [defaultProducts, setDefaultProducts] = useState([]);
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
          setDefaultProducts(result.data.orders);
          // console.log(result.data.orders);
        } else {
          console.log(result.error.message);
        }
      });
  }, []);

  const filterIt = text => {
    if (text == '' || text.trim() == '' || text.trim() == null) {
      setOrderList(defaultProducts);
      return null;
    }
    const lowerText = text.toLowerCase();
    console.log(text);
    const filterItem = defaultProducts.filter(item => {
      const lowerName = item._id.toLowerCase();
      const match = lowerName.match(lowerText);

      if (match != null) {
        return true;
      } else return false;
    });
    setOrderList(filterItem);
  };

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
          <div className='searchbar'>
            <input
              type='text'
              placeholder='Search order by Id'
              onChange={e => filterIt(e.target.value)}
            />
          </div>
          {orderList.map(item => (
            <div className='eachOrderContainer' key={item._id}>
              <div className='orderDetailingContainer'>
                <div className='itemName'>Order Id : {item._id}</div>
                <ul>
                  {item.cart.map(cartItem => (
                    <li key={cartItem._id} className='listItem'>
                      <img
                        src={
                          cartItem?.product?.displayImage[0]?.url
                            ? cartItem?.product?.displayImage[0]?.url
                            : 'https://static.thenounproject.com/png/5191452-200.png'
                        }
                      />
                      <div>
                        {cartItem?.product?.seller?.accountType === 'client' ? (
                          <div className='reselledBatch'>Reselled Product</div>
                        ) : (
                          ''
                        )}
                        {cartItem.product ? (
                          <div className='itemPrice orderDetailEachlist'>
                            <div
                              style={{ marginBottom: '1%' }}
                            >{`Item name : ${cartItem.product.name} | Product Id : #${cartItem.product.productId} | Price : ${cartItem.product.originalPrice} |
                      Quantity : ${cartItem.quantity}`}</div>
                            {cartItem?.product?.seller?.accountType ===
                              'client' && (
                              <div>
                                {`Reselled Item id : ${
                                  cartItem.product._id
                                } | Reseller Name : ${
                                  cartItem.product.seller.displayName
                                } | Reseller ID : ${
                                  cartItem.product.seller._id
                                } | New Price : ${
                                  cartItem.product.newPrice
                                } | Margin : ${
                                  cartItem.product.newPrice -
                                  cartItem.product.originalPrice
                                }`}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>{`Product Deleted |
                          Quantity : ${cartItem.quantity}`}</div>
                        )}
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
                  <b>Total Order Price : {item.price}</b>
                </div>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPortalOrderDetails;

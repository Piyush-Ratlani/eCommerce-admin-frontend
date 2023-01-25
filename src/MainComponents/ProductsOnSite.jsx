import React, { useContext, useEffect, useState } from 'react';
import './AdminPortalHome.css';
import Image from '../Assests/landscape.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const ProductsOnSite = () => {
  const [avilability, setAvilability] = useState(true);
  const { dispatch } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const navigation = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URI}/admin/product/all`, {
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          setProducts(result.data.products);
        } else {
          toast.info(result.error.message);
          console.log(result.error.message);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleAvailability = (prodId, status) => {
    fetch(`${process.env.REACT_APP_API_URI}/admin/product/${prodId}/edit/all`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.token,
      },
      body: JSON.stringify({
        availability: status,
      }),
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          // result.data.adminProduct
          const updatedList = products.map(item => {
            if (item._id == result.data.adminProduct._id)
              return result.data.adminProduct;
            else return item;
          });
          setProducts(updatedList);
          toast.success('Product updated.');
        } else {
          toast.info(result.error.message);
          console.log(result.error);
        }
      })
      .catch(err => console.log(err));
  };

  const handleDeleteProduct = productId => {
    fetch(
      `${process.env.REACT_APP_API_URI}/admin/products/${productId}/delete/all`,
      {
        method: 'delete',
        headers: {
          Authorization: 'Bearer ' + user.token,
        },
      }
    )
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          const newData = products.filter(item => item.productId !== productId);
          setProducts(newData);
          toast.error('Product deleted.');
        }
      })
      .catch(err => {
        toast.info('Internal server error.');
        console.log(err);
      });
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

        <div className='adminNavbarItems'>
          Products On Site <div className='adminNavbarItemsActiveline'></div>
        </div>

        <Link to='/OrderDetail'>
          <div className='adminNavbarItems'>
            Order Details <div className='adminNavbarItemsUnActiveline'></div>
          </div>
        </Link>
        <div
          className='adminLogoutButton'
          onClick={() => {
            handleLogout();
          }}
        >
          Logout <div className='adminNavbarItemsUnActiveline '></div>
        </div>
        <div className='adminPagemainContainer'>
          <div className='addarticleHeading'>Products On Site</div>
          {products.map(item => (
            <div className='eachOrderContainer' key={item._id}>
              <img
                src={item.displayImage[0].url ? item.displayImage[0].url : ''}
                className='productImage'
              />
              <div className='productsOnSiteContainer'>
                <div className='itemName'>Item Id : {item.productId}</div>
                <div className='itemPrice'>Item name : {item.name}</div>

                <div className='itemPrice'>Price : ₹ {item.newPrice}</div>
                <div className='itemPrice orderDetailingDescription'>
                  Item Description : {item.description}
                </div>
                <div className='itemPrice'>Category : {item.category.name}</div>
                <div className='itemPrice bold'>
                  {/* Availability : {avilability ? 'In-Stock' : 'Out of Stock'} */}
                  Availability : {item.availability}
                </div>
                <div className='prductsOnSiteButtonContainer'>
                  {item.availability === 'Out Of Stock' ? (
                    <div
                      className='cancelButton'
                      onClick={() => handleAvailability(item._id, 'Available')}
                    >
                      In Stock
                    </div>
                  ) : (
                    <div
                      className='cancelButton'
                      onClick={() =>
                        handleAvailability(item._id, 'Out Of Stock')
                      }
                    >
                      Out of Stock
                    </div>
                  )}
                  <div
                    className='cancelButton'
                    onClick={() => handleDeleteProduct(item.productId)}
                  >
                    Delete
                  </div>
                  <div
                    className='cancelButton'
                    onClick={() =>
                      navigation('/Home', {
                        state: {
                          isEdit: true,
                          _id: item._id,
                          name: item.name,
                          description: item.description,
                          displayImage: item.displayImage,
                          price: item.newPrice,
                          category: item.category,
                        },
                      })
                    }
                  >
                    Edit
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsOnSite;

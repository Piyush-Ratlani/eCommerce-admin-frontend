import React, { useContext, useEffect, useRef, useState } from 'react';
import './AdminPortalHome.css';
import Image from '../Assests/landscape.jpg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const AdminPortalHome = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const [imagePreviewObj, setimagePreviewObj] = useState({
    imagePreview1: {
      edit: false,
      url: location?.state?.displayImage[0]
        ? location?.state?.displayImage[0].url
        : null,
    },
    imagePreview2: {
      edit: false,
      url: location?.state?.displayImage[1]
        ? location?.state?.displayImage[1].url
        : null,
    },
    imagePreview3: {
      edit: false,
      url: location?.state?.displayImage[2]
        ? location?.state?.displayImage[2].url
        : null,
    },
    imagePreview4: {
      edit: false,
      url: location?.state?.displayImage[3]
        ? location?.state?.displayImage[3].url
        : null,
    },
  });
  const [imagePreview, setImagePreview] = useState(
    location?.state?.displayImage[0]
      ? location?.state?.displayImage[0].url
      : null
  );
  const [imagePreview2, setImagePreview2] = useState(
    location?.state?.displayImage[1]
      ? location?.state?.displayImage[1].url
      : null
  );
  const [imagePreview3, setImagePreview3] = useState(
    location?.state?.displayImage[2]
      ? location?.state?.displayImage[2].url
      : null
  );
  const [imagePreview4, setImagePreview4] = useState(
    location?.state?.displayImage[3]
      ? location?.state?.displayImage[3].url
      : null
  );
  const [categoryType, setCategoryType] = useState(
    location?.state?.category ? location?.state?.category : {}
  );
  const [categoryList, setCategoryList] = useState([]);

  const { dispatch } = useContext(UserContext);
  const navigation = useNavigate();
  // const displayImages = [];

  const [displayImages, setdisplayImages] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URI}/category/all`)
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success')
          setCategoryList(result.data.categories);
        else console.log(result.error);
      })
      .catch(err => console.log(err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: 'CLEAR' });
    navigation('/');
  };

  const handleFileChange = e => {
    const selected = e.target.files[0];
    // console.log(selected);
    let reader = new FileReader();
    reader.onloadend = () => {
      // setImagePreview(reader.result);
      setimagePreviewObj({
        ...imagePreviewObj,
        imagePreview1: {
          edit: true,
          url: reader.result,
        },
      });
      // console.log(reader.result);
    };
    reader.readAsDataURL(selected);
  };
  const handleFileChange2 = e => {
    const selected = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      // setImagePreview2(reader.result);
      setimagePreviewObj({
        ...imagePreviewObj,
        imagePreview2: {
          edit: true,
          url: reader.result,
        },
      });
      // console.log(reader.result);
    };
    reader.readAsDataURL(selected);
  };
  const handleFileChange3 = e => {
    const selected = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      // setImagePreview3(reader.result);
      setimagePreviewObj({
        ...imagePreviewObj,
        imagePreview3: {
          edit: true,
          url: reader.result,
        },
      });
      // console.log(reader.result);
    };
    reader.readAsDataURL(selected);
  };
  const handleFileChange4 = e => {
    const selected = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      // setImagePreview4(reader.result);
      setimagePreviewObj({
        ...imagePreviewObj,
        imagePreview4: {
          edit: true,
          url: reader.result,
        },
      });
      // console.log(reader.result);
    };
    reader.readAsDataURL(selected);
  };

  const handlePostType = item => {
    setCategoryType(item);
  };

  const name = useRef(location?.state?.name ? location.state.name : '');
  const description = useRef(
    location?.state?.description ? location.state.description : ''
  );
  const price = useRef(location?.state?.price ? location.state.price : '');

  const handleAddEditSubmit = async type => {
    console.log('button called', type);
    if (type === 'add') {
      await postImage(type);
      // await addProduct();
      // await postImage(displayImages => addProduct(displayImages));
    } else {
      await postImage(type);
    }
  };

  const postImage = async requestType => {
    const newData2 = [];
    const promises = Object.keys(imagePreviewObj).map(async item => {
      console.log(item);
      if (imagePreviewObj[item].edit) {
        if (imagePreviewObj[item].url) {
          console.log(`${item} image uploading`);
          const data = new FormData();
          data.append('file', imagePreviewObj[item].url.toString());
          data.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET);
          data.append('cloud_name', process.env.REACT_APP_CLOUD_NAME);
          data.append('folder', process.env.REACT_APP_FOLDER);

          await fetch('https://api.cloudinary.com/v1_1/piyush27/image/upload', {
            method: 'post',
            body: data,
          })
            .then(res => res.json())
            .then(data => {
              newData2.push({ url: data.url });
            })
            .catch(err => console.log(err));
        }
      } else {
        if (imagePreviewObj[item].url) {
          newData2.push({ url: imagePreviewObj[item].url });

          // const newData = [
          //   ...displayImages,
          //   { url: imagePreviewObj[item].url },
          // ];
          // setdisplayImages(newData);
          // setdisplayImages([
          //   ...displayImages,
          //   {
          //     url: imagePreviewObj[item].url,
          //   },
          // ]);
        }
        // console.log(displayImages, 'at post image edit false push');
      }
      return Promise.resolve();
    });
    console.log({ newData2 });
    // setdisplayImages(newData2);
    await Promise.all(promises);

    if (requestType === 'add') addProduct(newData2);
    else editProduct(newData2);
  };

  const addProduct = async displayImages => {
    console.log(displayImages, 'before add product');
    fetch(`${process.env.REACT_APP_API_URI}/admin/product/post`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.token,
      },
      body: JSON.stringify({
        name: name.current,
        description: description.current,
        price: price.current,
        seller: user._id,
        displayImage: displayImages,
        category: categoryType._id,
      }),
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          console.log(result);
          navigation('/Products');
        } else {
          toast.error(result.error.message);
          console.log(result.error);
        }
      })
      .catch(err => console.log(err));
  };

  const editProduct = async displayImages => {
    console.log(displayImages, 'before edit product');
    fetch(
      `${process.env.REACT_APP_API_URI}/admin/product/${location.state._id}/edit/all`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.token,
        },
        body: JSON.stringify({
          name: name.current,
          description: description.current,
          price: price.current,
          seller: user._id,
          displayImage: displayImages,
          category: categoryType._id,
        }),
      }
    )
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          console.log(result);
          navigation('/Products');
        } else {
          toast.error(result.error.message);
          console.log(result.error);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <ToastContainer />
      <div className='adminPageNavbar'>
        <div className='adminBrandnameNavbar'>E-com | Admin Page</div>
        <div className='adminNavbarItems'>
          Add Product <div className='adminNavbarItemsActiveline'></div>
        </div>
        <Link to='/Products'>
          <div className='adminNavbarItems'>
            Products On Site{' '}
            <div className='adminNavbarItemsUnActiveline'></div>
          </div>
        </Link>
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
          <div className='addarticleHeading'>Add Product</div>
          <div className='addArticleFeild'>
            <div className='addArticleFeildHeader'>Name</div>
            <div className='addArticleInputContainer'>
              <input
                type='text'
                className='addArticleInput'
                onChange={e => (name.current = e.target.value)}
                defaultValue={location?.state?.name ? location.state.name : ''}
              />
            </div>
          </div>
          <div className='addArticleFeild'>
            <div className='addArticleFeildHeader'>Price</div>
            <div className='addArticleInputContainer'>
              <input
                type='number'
                className='addArticleInput'
                onChange={e => (price.current = e.target.value)}
                defaultValue={
                  location?.state?.price ? location.state.price : ''
                }
              />
            </div>
          </div>
          <div className='addArticleFeild'>
            <div className='addArticleFeildHeader'>Description</div>
            <div className='addArticleInputContainer'>
              <textarea
                type='text'
                className='addArticletextarea'
                onChange={e => (description.current = e.target.value)}
                defaultValue={
                  location?.state?.description ? location.state.description : ''
                }
              />
            </div>
          </div>
          <div className='addArticleFeild'>
            <div className='addArticleFeildHeader'>Image1</div>
            {/* {!imagePreview ? ( */}
            {!imagePreviewObj.imagePreview1.url ? (
              <div className='addArticleImageInputContainer'>
                <label
                  htmlFor='articleImageInput'
                  className='addArticleImageInputLabel'
                >
                  Choose File
                </label>
                <input
                  type='file'
                  accept='image/*'
                  id='articleImageInput'
                  className='addArticleInput addArticleImageInput'
                  onChange={e => handleFileChange(e)}
                />
              </div>
            ) : (
              <>
                <div className='imagePreviewBox'>
                  <img
                    src={imagePreviewObj.imagePreview1.url}
                    alt=''
                    className='imagePreviewImage'
                  />
                  <div
                    className='imagePreviewRemove'
                    onClick={() => {
                      // setImagePreview(null);
                      setimagePreviewObj({
                        ...imagePreviewObj,
                        imagePreview1: { edit: true, url: null },
                      });
                    }}
                  >
                    Remove Image
                  </div>
                </div>
              </>
            )}
          </div>
          <div className='addArticleFeild'>
            <div className='addArticleFeildHeader'>Image2</div>
            {/* {!imagePreview2 ? ( */}
            {!imagePreviewObj.imagePreview2.url ? (
              <div className='addArticleImageInputContainer'>
                <label
                  htmlFor='articleImageInput'
                  className='addArticleImageInputLabel'
                >
                  Choose File
                </label>
                <input
                  type='file'
                  accept='image/*'
                  id='articleImageInput'
                  className='addArticleInput addArticleImageInput'
                  onChange={e => handleFileChange2(e)}
                />
              </div>
            ) : (
              <>
                <div className='imagePreviewBox'>
                  <img
                    src={imagePreviewObj.imagePreview2.url}
                    alt=''
                    className='imagePreviewImage'
                  />
                  <div
                    className='imagePreviewRemove'
                    onClick={() => {
                      // setImagePreview2(null);
                      setimagePreviewObj({
                        ...imagePreviewObj,
                        imagePreview2: {
                          edit: true,
                          url: null,
                        },
                      });
                    }}
                  >
                    Remove Image
                  </div>
                </div>
              </>
            )}
          </div>
          <div className='addArticleFeild'>
            <div className='addArticleFeildHeader'>Image3</div>
            {/* {!imagePreview3 ? ( */}
            {!imagePreviewObj.imagePreview3.url ? (
              <div className='addArticleImageInputContainer'>
                <label
                  htmlFor='articleImageInput'
                  className='addArticleImageInputLabel'
                >
                  Choose File
                </label>
                <input
                  type='file'
                  accept='image/*'
                  id='articleImageInput'
                  className='addArticleInput addArticleImageInput'
                  onChange={e => handleFileChange3(e)}
                />
              </div>
            ) : (
              <>
                <div className='imagePreviewBox'>
                  <img
                    src={imagePreviewObj.imagePreview3.url}
                    alt=''
                    className='imagePreviewImage'
                  />
                  <div
                    className='imagePreviewRemove'
                    onClick={() => {
                      // setImagePreview3(null);
                      setimagePreviewObj({
                        ...imagePreviewObj,
                        imagePreview3: {
                          edit: true,
                          url: null,
                        },
                      });
                    }}
                  >
                    Remove Image
                  </div>
                </div>
              </>
            )}
          </div>
          <div className='addArticleFeild'>
            <div className='addArticleFeildHeader'>Image4</div>
            {/* {!imagePreview4 ? ( */}
            {!imagePreviewObj.imagePreview4.url ? (
              <div className='addArticleImageInputContainer'>
                <label
                  htmlFor='articleImageInput'
                  className='addArticleImageInputLabel'
                >
                  Choose File
                </label>
                <input
                  type='file'
                  accept='image/*'
                  id='articleImageInput'
                  className='addArticleInput addArticleImageInput'
                  onChange={e => handleFileChange4(e)}
                />
              </div>
            ) : (
              <>
                <div className='imagePreviewBox'>
                  <img
                    src={imagePreviewObj.imagePreview4.url}
                    alt=''
                    className='imagePreviewImage'
                  />
                  <div
                    className='imagePreviewRemove'
                    onClick={() => {
                      // setImagePreview4(null);
                      setimagePreviewObj({
                        ...imagePreviewObj,
                        imagePreview4: {
                          edit: true,
                          url: null,
                        },
                      });
                    }}
                  >
                    Remove Image
                  </div>
                </div>
              </>
            )}
          </div>
          <div className='addArticleFeild'>
            <div className='addArticleFeildHeader'>Category</div>
            <div className='addArticleTypeContainer'>
              {categoryList.map(item => (
                <div
                  key={item._id}
                  className={
                    categoryType.name == item.name
                      ? 'addArticleTypeActive'
                      : 'addArticleType'
                  }
                  onClick={() => {
                    categoryType.name != item.name && handlePostType(item);
                  }}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          {location?.state?._id ? (
            <div
              className='addArticleButton'
              onClick={() => handleAddEditSubmit('edit')}
            >
              Edit Product
            </div>
          ) : (
            <div
              className='addArticleButton'
              onClick={() => handleAddEditSubmit('add')}
            >
              Add Product
            </div>
          )}
          {/* <div className='addArticleButton'>Add Product</div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminPortalHome;

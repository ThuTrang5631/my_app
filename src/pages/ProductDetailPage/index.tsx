import { userAPI } from "../../utils/api";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES, URL_PRODUCTS, URL_UPLOADFILE } from "../../utils/constants";
import ModalCustom from "../../components/Modal";
import { VALIDATE } from "../../utils/constants";
import Slider from "react-slick";

const ProductDetail = () => {
  const { id } = useParams();

  const [dataProduct, setDataProduct] = useState<{ [key: string]: any }>({});
  const [editBtn, setEditBtn] = useState(false);
  const [images, setImages] = useState<any[]>([
    "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg",
  ]);
  let [name, setName] = useState<string>("");
  let [price, setPrice] = useState<number>(0);
  let [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [imagesUpdate, setImagesUpdate] = useState<string[]>([]);
  let [linkImageUpdate, setLinkImageUpdate] = useState<string[]>([]);
  const [errorName, setErrorName] = useState<string>("");
  const [errorPrice, setErrorPrice] = useState<string>("");
  const [errorDescription, setErrorDescription] = useState<string>("");

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const getDataProduct = async () => {
    try {
      const res = await userAPI.get(`${URL_PRODUCTS}/${id}`);
      console.log("res", res?.data);
      setDataProduct(res?.data);

      setImages(
        res?.data?.ProductImage?.length === 0
          ? [
              "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg",
            ]
          : res?.data?.ProductImage
      );
    } catch (error) {
      navigate(ROUTES.login);
      console.log(error);
    }
  };

  useEffect(() => {
    getDataProduct();
  }, []);

  const handleChangeImage = async (e: any) => {
    let selectedFile: any = [];
    const targetFiles = e.target.files;
    const targetFilesObject = [...targetFiles];
    targetFilesObject.map((file: Blob | MediaSource) => {
      return selectedFile.push(URL.createObjectURL(file));
    });

    setImages(selectedFile);

    targetFilesObject.map(async (fileUpdate: any) => {
      const dataUploadImage = new FormData();
      dataUploadImage.append("file", fileUpdate);

      try {
        const res = await userAPI.post(URL_UPLOADFILE, dataUploadImage);
        console.log("data upload image", res?.data);
        imagesUpdate.push(res?.data?.url);
      } catch (error) {
        console.log(error);
      }
    });

    setLinkImageUpdate(imagesUpdate);
    setImagesUpdate([]);
  };

  const handleSubmitUpdateForm = async (e: any) => {
    setEditBtn(false);
    e.preventDefault();

    if (name === "") {
      name = dataProduct?.name;
    }

    if (price === 0) {
      price = dataProduct?.price;
    }

    if (description === "") {
      description = dataProduct?.description;
    }

    if (
      linkImageUpdate.length === 0 &&
      images?.[0] !==
        "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
    ) {
      images.map((image) => {
        linkImageUpdate.push(image?.url);
      });
    }

    const dataUpdate = {
      name,
      price,
      description,
      images: linkImageUpdate,
    };

    try {
      const res = await userAPI.put(`/products/${dataProduct?.id}`, dataUpdate);
      console.log("res", res);
      setOpenModal(true);
      getDataProduct();
      setLinkImageUpdate([]);
    } catch (error) {
      // navigate(ROUTES.login);
      console.log(error);
    }

    console.log("data update", dataUpdate);
  };

  const handleClickLogout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate(ROUTES.login);
  };

  const handleChangePrice = (e: any) => {
    if (e.target.value === "") {
      setErrorPrice("Price is required");
    } else if (!VALIDATE.regexPrice.test(e.target.value)) {
      setErrorPrice("Price must be an integer number");
    } else {
      setErrorPrice("");
    }
    setPrice(Number(e.target.value));
  };

  const handleChangeDescription = (e: any) => {
    if (e.target.value === "") {
      setErrorDescription("Description is required");
    } else {
      setErrorDescription("");
    }

    setDescription(e.target.value);
  };

  return (
    <>
      <div className="dashboardpage productdetail app__container">
        <div className="dashboardpage__top">
          <a href={ROUTES.dashboard}>
            <h1 className="dashboard__title">Dashboard</h1>
          </a>
          <button
            onClick={handleClickLogout}
            className="dashboardpage__btnlogout"
          >
            Logout<i className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
        <div className="wrapcontent">
          <div className="productdetail__btnedit">
            {!editBtn && <button onClick={() => setEditBtn(true)}>Edit</button>}
          </div>
          {dataProduct && (
            <form className="productdetail__form" id="form">
              <div className="productdetail__wrapcontent">
                <div className="productdetail__containright">
                  {/* <div className="productdetail__wrapimage">
                    {images.length !== 0 &&
                      images?.map((image, id) => (
                        <img
                          key={id}
                          alt="product"
                          className="productdetail__img"
                          src={
                            image?.url !== undefined
                              ? image?.url?.slice(0, 8) === "https://" ||
                                image?.url?.slice(0, 7) === "http://"
                                ? image?.url
                                : `http://${image?.url}`
                              : image
                          }
                        ></img>
                      ))}
                  </div> */}
                  <Slider {...settings}>
                    {images.length !== 0 &&
                      images?.map((image, id) => (
                        <img
                          key={id}
                          alt="product"
                          className="productdetail__img"
                          src={
                            image?.url !== undefined
                              ? image?.url?.slice(0, 8) === "https://" ||
                                image?.url?.slice(0, 7) === "http://"
                                ? image?.url
                                : `http://${image?.url}`
                              : image
                          }
                        ></img>
                      ))}
                  </Slider>
                  {editBtn && (
                    <div className="productdetail__uploadbtn">
                      <input
                        onChange={handleChangeImage}
                        id="uploadImage"
                        type="file"
                        hidden
                        multiple
                      />
                      <label
                        htmlFor="uploadImage"
                        className="productdetail__btnphoto"
                      >
                        Upload photo
                      </label>
                    </div>
                  )}
                </div>

                <div className="productdetail__content">
                  <div className="productdetail__containdesc">
                    <div className="productdetail__wrapdesc">
                      <p className="productdetail__titledesc">Name</p>
                      {editBtn ? (
                        <div className="productdetail__wrapinput">
                          <input
                            className="productdetail__title"
                            defaultValue={dataProduct?.name}
                            onChange={(e) => {
                              setName(e.target.value);
                            }}
                          />
                          {errorName && <p className="error">{errorName}</p>}
                        </div>
                      ) : (
                        <p className="productdetail__title">
                          {dataProduct?.name}
                        </p>
                      )}
                    </div>
                    <div className="productdetail__wrapdesc">
                      <p className="productdetail__titledesc ">Price</p>
                      {editBtn ? (
                        <div className="productdetail__wrapinput">
                          <input
                            className="productdetail__title"
                            defaultValue={dataProduct?.price}
                            onChange={(e) => {
                              handleChangePrice(e);
                            }}
                          />
                          {errorPrice && <p className="error">{errorPrice}</p>}
                        </div>
                      ) : (
                        <p className="productdetail__title">{`$${dataProduct?.price}`}</p>
                      )}
                    </div>
                    <div className="productdetail__wrapdesc">
                      <p className="productdetail__titledesc ">Description </p>
                      {editBtn ? (
                        <div className="productdetail__wrapinput">
                          <textarea
                            className="productdetail__title"
                            defaultValue={dataProduct?.description}
                            onChange={(e) => handleChangeDescription(e)}
                          />
                          <p className="error">{errorDescription}</p>
                        </div>
                      ) : (
                        <p className="productdetail__title">
                          {dataProduct?.description}
                        </p>
                      )}
                    </div>
                  </div>{" "}
                  {editBtn && (
                    <div className="productdetail__btns">
                      <button
                        className="productdetail__btncancel"
                        onClick={() => setEditBtn(false)}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitUpdateForm}
                        className="productdetail__btnsave"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      <ModalCustom
        openModal={openModal}
        onCancel={() => setOpenModal(false)}
        content="Update successful"
      ></ModalCustom>
    </>
  );
};

export default ProductDetail;

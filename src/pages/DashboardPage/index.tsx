import {
  STORAGE_TOKEN,
  URL_PRODUCTS,
  URL_UPLOADFILE,
  VALIDATE,
} from "../../utils/constants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import ReactPaginate from "react-paginate";
import { Input, Space } from "antd";
import ModalCustom from "../../components/Modal";
import { userAPI } from "../../utils/api";
import { Link } from "react-router-dom";
import detailIcon from "../../assets/detail-icon.png";
import { Modal } from "antd";
import checkIcon from "../../assets/check-icon.png";
import uncheckIcon from "../../assets/uncheck-icon.png";
import { Checkbox } from "antd";
import exportFromJSON from "export-from-json";

const { Search } = Input;

type PaginationProps = {
  totalItem?: any;
  currentPage?: any;
  limit?: any;
};

type SortByItemProps = {
  sortBy?: string;
  sortType?: string;
};

const DashboardPage = () => {
  const [products, setProducts] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({});
  const [openModal, setOpenModal] = useState(false);
  const [active, setActive] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [sortByItem, setSortByItem] = useState<SortByItemProps>({});
  const [page, setPage] = useState(1);
  const [openModalCreateProduct, setOpenModalCreateProduct] = useState(false);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [imagesCreate, setImagesCreate] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [openModalSearch, setOpenModalSearch] = useState(false);
  const [idDelete, setIdDelete] = useState<number>(NaN);
  const [modalSuccessCreate, setModalSuccessCreate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [errorName, setErrorName] = useState<string>("");
  const [errorPrice, setErrorPrice] = useState<string>("");
  const [errorDescription, setErrorDescription] = useState<string>("");

  const [dataExport, setDataExport] = useState<any[]>([]);

  const navigate = useNavigate();
  let token: any;
  if (localStorage.getItem(STORAGE_TOKEN)) {
    token = localStorage.getItem(STORAGE_TOKEN);
  } else if (sessionStorage.getItem(STORAGE_TOKEN)) {
    token = sessionStorage.getItem(STORAGE_TOKEN);
  }

  userAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const totalPage = pagination?.totalItem / pagination?.limit;

  const handleChangePagination = async (data: any) => {
    let currentPage = data.selected + 1;
    setPage(currentPage);
    console.log("curent page", currentPage);
  };

  const onSearch = async (value: string) => {
    setPage(1);
    setSearch(value);
    console.log("search", search);
  };

  const onFilterActive = async (e: any) => {
    setPage(1);
    if (e.target.value === "") {
      setActive(undefined);
    } else {
      setActive(e.target.value);
    }
    console.log("filter", e.target.value);
  };

  const handleSortNameUp = async () => {
    setPage(1);
    setSortByItem({ sortBy: "name", sortType: "asc" });
  };

  const handleSortNameDown = async () => {
    setPage(1);
    setSortByItem({ sortBy: "name", sortType: "desc" });
  };

  const handleSortPriceUp = async () => {
    setPage(1);
    setSortByItem({ sortBy: "price", sortType: "asc" });
  };

  const handleSortPriceDown = async () => {
    setPage(1);
    setSortByItem({ sortBy: "price", sortType: "desc" });
  };

  const handleSortCreateAtUp = async () => {
    setPage(1);
    setSortByItem({ sortBy: "createdAt", sortType: "asc" });
  };

  const handleSortCreateAtDown = async () => {
    setPage(1);
    setSortByItem({ sortBy: "createdAt", sortType: "desc" });
  };

  const handleClickLogout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate(ROUTES.login);
  };

  const handleClickDelete = async () => {
    try {
      const res = await userAPI.delete(`${URL_PRODUCTS}/${idDelete}`);
      console.log("res", res);
      setPage(1);
      setActive("true");
      if (page === 1 && active === "true") {
        getDataFollowCondition();
      }
      setOpenModal(true);
      setModalDelete(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeImage = async (e: any) => {
    let selectedFile: any = [];
    const targetFiles = e.target.files;
    const targetFilesObject = [...targetFiles];
    targetFilesObject.map((file: Blob | MediaSource) => {
      return selectedFile.push(URL.createObjectURL(file));
    });
    setImagePreview(selectedFile);

    targetFilesObject.map(async (fileUpdate: any) => {
      const dataUploadImage = new FormData();
      dataUploadImage.append("file", fileUpdate);

      try {
        const res = await userAPI.post(URL_UPLOADFILE, dataUploadImage);
        imagesCreate.push(res?.data?.url);
      } catch (error) {
        console.log(error);
      }
    });

    setImages(imagesCreate);
    setImagesCreate([]);
  };

  const handleCreateProduct = async () => {
    const data = {
      name,
      price,
      description,
      images,
    };

    console.log("data", data);

    try {
      const res = await userAPI.post(URL_PRODUCTS, data);

      setModalSuccessCreate(true);
      setOpenModalCreateProduct(false);
      setOpenModal(true);
      setImagePreview([]);
      setName("");
      setPrice(NaN);
      setDescription("");
      setImages([]);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataFollowCondition = async () => {
    try {
      const params: {
        [key: string]: number | string | undefined;
      } = {
        page: page,
      };

      if (search) {
        params["searchTerm"] = search;
      }

      if (active) {
        params["active"] = active;
      }

      if (sortByItem.sortBy || sortByItem.sortType) {
        params["sortBy"] = sortByItem.sortBy;
        params["sortType"] = sortByItem.sortType;
      }
      console.log("params", params);

      const res = await userAPI.get(URL_PRODUCTS, {
        params: params,
      });

      if (res?.data?.items?.length === 0) {
        setOpenModalSearch(true);
        setOpenModal(true);
      } else {
        setProducts(res?.data?.items);
        setPagination(res?.data?.pagination);
      }
    } catch (error) {
      navigate(ROUTES.login);
      console.log(error);
    }
  };

  const handleChangeName = (e: any) => {
    if (e.target.value === "") {
      setErrorName("Name is required");
    } else {
      setErrorName("");
    }

    setName(e.target.value);
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

    console.log("check description", Boolean(errorDescription));

    setDescription(e.target.value);
  };

  const exportFileCSV = () => {
    const fileName = "export dashboard";
    const exportType = exportFromJSON.types.csv;

    exportFromJSON({ data: dataExport, fileName, exportType });
  };

  useEffect(() => {
    getDataFollowCondition();
  }, [search, page, sortByItem.sortBy, sortByItem.sortType, active]);

  return (
    <>
      <div className="dashboardpage app__container">
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
          <div className="dashboard__table">
            <div className="dashboardpage__wrapsearchfilter">
              <div className="select-dropdown">
                <select onClick={(e) => onFilterActive(e)}>
                  <option value="">All</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <Space>
                <Search
                  onSearch={onSearch}
                  className="dashdoard__search"
                  placeholder="Enter name..."
                  allowClear
                />
              </Space>
            </div>
            <div className="dashboard__wrapsorcreate">
              <p>List Products</p>
              <div className="dashboard__wrapbtns">
                <div className="dashboard__btncreate">
                  <button
                    disabled={dataExport.length === 0}
                    className="btn__export btn"
                    onClick={exportFileCSV}
                  >
                    <i className="fa-solid fa-download"></i>
                    <span> Download CSV</span>
                  </button>
                </div>
                <div className="dashboard__btncreate">
                  <button
                    className="btn"
                    onClick={() => {
                      setOpenModalCreateProduct(true);
                    }}
                  >
                    <i className="fa-solid fa-plus"></i>
                    <span> Add Product</span>
                  </button>
                </div>
              </div>
            </div>
            {products.length > 0 && (
              <table className="table">
                <thead className="dashboard__tablethead">
                  <tr className="dashboard__tabletr">
                    <th
                      className="dashboard__tabletitle dashboard__check"
                      scope="col"
                    ></th>
                    <th className="dashboard__tabletitle" scope="col">
                      <span>Name</span>
                      <div className="dashboard__wrapsort">
                        <button
                          className="dashboard__btnsort"
                          onClick={handleSortNameUp}
                        >
                          <i className="fa-solid fa-arrow-up"></i>
                        </button>
                        <button
                          className="dashboard__btnsort"
                          onClick={handleSortNameDown}
                        >
                          <i className="fa-solid fa-arrow-down"></i>
                        </button>
                      </div>
                    </th>
                    <th className="dashboard__tabletitle" scope="col">
                      <span>Price</span>
                      <div className="dashboard__wrapsort">
                        <button
                          className="dashboard__btnsort"
                          onClick={handleSortPriceUp}
                        >
                          <i className="fa-solid fa-arrow-up"></i>
                        </button>
                        <button
                          className="dashboard__btnsort"
                          onClick={handleSortPriceDown}
                        >
                          <i className="fa-solid fa-arrow-down"></i>
                        </button>
                      </div>
                    </th>
                    <th className="dashboard__tabletitle" scope="col">
                      Description
                    </th>
                    <th className="dashboard__tabletitle" scope="col">
                      <span>Create At</span>
                      <div className="dashboard__wrapsort">
                        <button
                          className="dashboard__btnsort"
                          onClick={handleSortCreateAtUp}
                        >
                          <i className="fa-solid fa-arrow-up"></i>
                        </button>
                        <button
                          className="dashboard__btnsort"
                          onClick={handleSortCreateAtDown}
                        >
                          <i className="fa-solid fa-arrow-down"></i>
                        </button>
                      </div>
                    </th>
                    <th className="dashboard__tabletitle" scope="col">
                      Active
                    </th>
                    <th className="dashboard__tabletitle" scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item: any) => {
                    return (
                      <tr key={item?.id}>
                        <td>
                          <Checkbox
                            onChange={(e) => {
                              if (e.target.checked) {
                                setDataExport([...dataExport, item]);
                              } else {
                                setDataExport([
                                  ...dataExport.filter(
                                    (value) => value !== item
                                  ),
                                ]);
                              }
                            }}
                          ></Checkbox>
                        </td>
                        <th
                          className="dashboard__content dashboard__name"
                          scope="row"
                        >
                          {item?.name}
                        </th>
                        <td className="dashboard__content">{`$${item?.price}`}</td>
                        <td className="dashboard__content dashboard__desc">
                          {item?.description.length > 100
                            ? `${item?.description?.slice(0, 101)}...`
                            : item?.description}
                        </td>
                        <td className="dashboard__content">
                          {item?.createdAt.slice(0, 10)}
                        </td>
                        <td className="dashboard__content">
                          {item?.active === true ? (
                            <img
                              alt="check active"
                              src={checkIcon}
                              className="icon-check"
                            ></img>
                          ) : (
                            <img
                              src={uncheckIcon}
                              className="icon-uncheck"
                              alt="uncheck inactive"
                            ></img>
                          )}
                        </td>
                        <td className="dashboard__wrapactions">
                          <div className="dashboard__actions">
                            {item?.active === true && (
                              <button
                                onClick={() => {
                                  setIsOpenModalDelete(true);
                                  setIdDelete(item?.id);
                                }}
                                className="dashboard__btndelete"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            )}

                            <Link
                              to={`/detail/${item?.id}`}
                              className="dashboard__btndetail"
                            >
                              <img src={detailIcon} alt="icon detail"></img>
                            </Link>
                            {/* <Checkbox
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setDataExport([...dataExport, item]);
                                } else {
                                  setDataExport([
                                    ...dataExport.filter(
                                      (value) => value !== item
                                    ),
                                  ]);
                                }
                              }}
                            ></Checkbox> */}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <Modal
                  open={isOpenModalDelete}
                  onCancel={() => {
                    setIsOpenModalDelete(false);
                  }}
                  onOk={() => {
                    handleClickDelete();
                    setIsOpenModalDelete(false);
                  }}
                >
                  <p className="dashboard__modaldeletecontent">
                    Do you want to delete this product?
                  </p>
                </Modal>
              </table>
            )}
            <div className="dashboard__pagination">
              {pagination?.totalItem > 12 && (
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  pageCount={totalPage}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handleChangePagination}
                  containerClassName={"pagination justify-content-center"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                  forcePage={page - 1}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <ModalCustom
        openModal={openModal}
        content={
          (openModalSearch && "No products. Look for another product") ||
          (modalSuccessCreate && "Create successful products") ||
          (modalDelete && "Delete successful")
        }
        onCancel={() => {
          setOpenModal(false);
        }}
      ></ModalCustom>

      {openModalCreateProduct && (
        <div className="container-modal">
          <div className="modalcreateproduct">
            <button
              onClick={() => setOpenModalCreateProduct(false)}
              className="modal-btn"
            >
              <i className="fa fa-close"></i>
            </button>
            <h2 className="modalcreateproduct__title">Create Product</h2>
            <div className="modalcreateproduct__wrapinput">
              <div className="modalcreateproduct__input">
                <label>Name</label>
                <Input
                  onChange={(e) => {
                    handleChangeName(e);
                  }}
                  placeholder="Name..."
                  required
                ></Input>
                {errorName && <p className="error">{errorName}</p>}
              </div>
              <div className="modalcreateproduct__input">
                <label>Price</label>
                <Input
                  onChange={(e) => {
                    handleChangePrice(e);
                  }}
                  placeholder="Price..."
                ></Input>
                {errorPrice && <p className="error">{errorPrice}</p>}
              </div>
              <div className="modalcreateproduct__input">
                <label>Description</label>
                <Input.TextArea
                  onChange={(e) => handleChangeDescription(e)}
                  placeholder="Description..."
                ></Input.TextArea>
                {errorDescription && (
                  <p className="error">{errorDescription}</p>
                )}
              </div>
              <div className="modalcreateproduct__input">
                <label>Images</label>
                <div className="modalcreateproduct__uploadbtn">
                  <input
                    onChange={handleChangeImage}
                    id="uploadImage"
                    type="file"
                    hidden
                    multiple
                  />
                  <label htmlFor="uploadImage">Upload photo</label>
                </div>
                <div className="modalcreateproduct__imgpreview">
                  {imagePreview.length !== 0 &&
                    imagePreview.map((image: any) => (
                      <img alt="preview product" key={image} src={image} />
                    ))}
                </div>
              </div>
              <div className="modalcreateproduct__btn">
                <button className="btn" onClick={handleCreateProduct}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardPage;

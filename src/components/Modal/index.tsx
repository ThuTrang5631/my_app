type ModalProps = {
  openModal: any;
  content: string | boolean;
  onCancel: any;
};

const ModalCustom = ({ openModal, content, onCancel }: ModalProps) => {
  return (
    <>
      {openModal && (
        <div onClick={onCancel} className="container-modal">
          <div className="wrap-modal">
            <button onClick={onCancel} className="modal-btn">
              <i className="fa fa-close"></i>
            </button>
            <p className="modal-desc">{content}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalCustom;

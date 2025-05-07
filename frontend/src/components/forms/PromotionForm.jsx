import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTag, faCalendar, faPercent, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
// Chỉ sử dụng Modals.css để tránh xung đột CSS
import "../modals/Modals.css";
import { openModal, closeModal } from "../../utils/modalUtils";

const PromotionForm = ({ promotion, onSubmit, onClose }) => {
  // Lấy ngày hiện tại theo định dạng yyyy-mm-dd
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    promotionCode: "",
    name: "",
    discount: "",
    startDate: todayStr, // Set mặc định là ngày hiện tại
    endDate: "",
    minPrice: "",
  });

  const [errors, setErrors] = useState({});
  const [rules, setRules] = useState({});

  // Xử lý định dạng giá tối thiểu
  const formatMinPrice = (value) => {
    if (!value) return "";
    const number = Number(("" + value).replace(/[^0-9]/g, ""));
    return number ? number.toLocaleString("vn-VN") : "";
  };

  useEffect(() => {
    if (promotion) {
      setFormData({
        promotionCode: promotion.promotionCode || promotion.code || "",
        name: promotion.name || "",
        discount: promotion.discount || "",
        startDate: (promotion.startDate || promotion.start_date || "").slice(0, 10),
        endDate: (promotion.endDate || promotion.end_date || "").slice(0, 10),
        minPrice: promotion.minPrice || promotion.min_price || "",
      });
    }
  }, [promotion]);

  useEffect(() => {
    // Khi form được mở, thêm class 'modal-open' vào body
    openModal();

    // Cleanup effect - khi component bị unmount
    return () => {
      closeModal();
    };
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/rules")
      .then(res => res.json())
      .then(data => setRules(data));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.promotionCode.trim()) newErrors.promotionCode = "Vui lòng nhập mã khuyến mãi";
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên chương trình";
    if (!formData.discount) newErrors.discount = "Vui lòng nhập mức giảm giá";
    if (!formData.startDate) newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    if (!formData.endDate) newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    if (!formData.minPrice) newErrors.minPrice = "Vui lòng nhập giá tối thiểu";

    // Validate discount (between 0 and 100)
    if (formData.discount && (isNaN(formData.discount) || formData.discount < 0 || formData.discount > 100)) {
      newErrors.discount = "Mức giảm giá phải từ 0 đến 100";
    }

    // Validate dates
    const today = new Date();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (formData.startDate && startDate < today.setHours(0, 0, 0, 0)) {
      newErrors.startDate = "Ngày bắt đầu không được nhỏ hơn ngày hiện tại";
    }

    if (formData.endDate && endDate < startDate) {
      newErrors.endDate = "Ngày kết thúc phải lớn hơn ngày bắt đầu";
    }

    // Áp dụng quy định thời gian áp dụng khuyến mãi tối đa
    if (rules.max_promotion_duration && formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > rules.max_promotion_duration) {
        newErrors.endDate = `Thời gian áp dụng khuyến mãi tối đa là ${rules.max_promotion_duration} ngày.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        let response, data;
        if (promotion && promotion.id) {
          // Sửa khuyến mãi
          response = await fetch(`http://localhost:5000/api/promotions/${promotion.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              promotionCode: formData.promotionCode,
              name: formData.name,
              discount: formData.discount,
              startDate: formData.startDate,
              endDate: formData.endDate,
              minPrice: formData.minPrice,
            }),
          });
        } else {
          // Thêm mới khuyến mãi
          response = await fetch("http://localhost:5000/api/promotions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              promotionCode: formData.promotionCode,
              name: formData.name,
              discount: formData.discount,
              startDate: formData.startDate,
              endDate: formData.endDate,
              minPrice: formData.minPrice,
            }),
          });
        }
        data = await response.json();
        if (response.ok) {
          onSubmit(data);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    }
  };

  const modalContent = (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            <FontAwesomeIcon
              icon={faTag}
              style={{
                color: '#095e5a',
                marginRight: '10px'
              }}
            />
            {promotion ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
          </h3>
          <button className="close-button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="account-form">
            <div className="form-group">
              <label htmlFor="promotionCode">
                <FontAwesomeIcon icon={faTag} style={{ marginRight: '8px', opacity: 0.7 }} />
                Mã khuyến mãi
              </label>
              <input
                type="text"
                id="promotionCode"
                name="promotionCode"
                value={formData.promotionCode}
                onChange={handleChange}
                className={errors.promotionCode ? "error" : ""}
                placeholder="Nhập mã khuyến mãi"
              />
              {errors.promotionCode && <div className="error-message">{errors.promotionCode}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="name">
                <FontAwesomeIcon icon={faTag} style={{ marginRight: '8px', opacity: 0.7 }} />
                Tên chương trình
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "error" : ""}
                placeholder="Nhập tên chương trình"
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="discount">
                <FontAwesomeIcon icon={faPercent} style={{ marginRight: '8px', opacity: 0.7 }} />
                Mức giảm giá (%)
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className={errors.discount ? "error" : ""}
                placeholder="Nhập mức giảm giá"
                min="0"
                max="100"
                step="1"
              />
              {errors.discount && <div className="error-message">{errors.discount}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="startDate">
                <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '8px', opacity: 0.7 }} />
                Ngày bắt đầu
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={errors.startDate ? "error" : ""}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.startDate && <div className="error-message">{errors.startDate}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="endDate">
                <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '8px', opacity: 0.7 }} />
                Ngày kết thúc
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={errors.endDate ? "error" : ""}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
              {errors.endDate && <div className="error-message">{errors.endDate}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="minPrice">
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px', opacity: 0.7 }} />
                Giá tối thiểu
              </label>
              <input
                type="text"
                id="minPrice"
                name="minPrice"
                value={formatMinPrice(formData.minPrice)}
                onChange={e => {
                  // Luôn chỉ lấy số, loại bỏ dấu chấm, giới hạn tối đa 9 ký tự số
                  const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 9);
                  setFormData(prev => ({ ...prev, minPrice: raw }));
                  if (errors.minPrice) setErrors(prev => ({ ...prev, minPrice: "" }));
                }}
                className={errors.minPrice ? "error" : ""}
                placeholder="Nhập giá tối thiểu"
                min="0"
                autoComplete="off"
              />
              {errors.minPrice && <div className="error-message">{errors.minPrice}</div>}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={onClose}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="save-button"
              >
                {promotion ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default PromotionForm;
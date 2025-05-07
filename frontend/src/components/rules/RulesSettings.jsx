import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faUndo,
  faBoxOpen,
  faClipboardList,
  faShoppingBasket,
  faPercent
} from "@fortawesome/free-solid-svg-icons";
import "./RulesSettings.css";

const RulesSettings = () => {
  // State để lưu trữ các giá trị quy định
  const [rules, setRules] = useState({
    minImportQuantity: 150,
    minStockBeforeImport: 300,
    minStockAfterSale: 20,
    maxPromotionDuration: 30
  });

  // State để lưu trữ dữ liệu gốc, phục vụ cho việc hủy thay đổi
  const [originalRules, setOriginalRules] = useState({
    minImportQuantity: 150,
    minStockBeforeImport: 300,
    minStockAfterSale: 20,
    maxPromotionDuration: 30
  });

  // State để theo dõi trường nào đã được thay đổi
  const [changedFields, setChangedFields] = useState({});

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rules/rules");
        if (response.ok) {
          const data = await response.json();
          setRules({
            minImportQuantity: data.min_import_quantity,
            minStockBeforeImport: data.min_stock_before_import,
            minStockAfterSale: data.min_stock_after_sale,
            maxPromotionDuration: data.max_promotion_duration,
          });
          setOriginalRules({
            minImportQuantity: data.min_import_quantity,
            minStockBeforeImport: data.min_stock_before_import,
            minStockAfterSale: data.min_stock_after_sale,
            maxPromotionDuration: data.max_promotion_duration,
          });
        } else {
          console.error("Failed to fetch rules:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching rules:", error);
      }
    };

    fetchRules();
  }, []);

  // Xử lý khi giá trị thay đổi
  const handleChange = (field, value) => {
    const numberValue = Number(value);

    // Kiểm tra nếu giá trị không phải là số hoặc là số âm
    if (isNaN(numberValue) || numberValue < 0) {
      return;
    }

    setRules({
      ...rules,
      [field]: numberValue
    });

    // Đánh dấu trường đã thay đổi
    if (originalRules[field] !== numberValue) {
      setChangedFields({
        ...changedFields,
        [field]: true
      });
    } else {
      // Nếu giá trị quay về giống ban đầu, loại bỏ khỏi danh sách các trường đã thay đổi
      const newChangedFields = { ...changedFields };
      delete newChangedFields[field];
      setChangedFields(newChangedFields);
    }
  };

  // Xử lý khi nhấn nút lưu
  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/rules", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          min_import_quantity: rules.minImportQuantity,
          min_stock_before_import: rules.minStockBeforeImport,
          min_stock_after_sale: rules.minStockAfterSale,
          max_promotion_duration: rules.maxPromotionDuration,
        }),
      });

      const data = await response.json();
      console.log("Phản hồi từ API:", data);

      if (response.ok) {
        setOriginalRules({ ...rules });
        setChangedFields({}); // Xóa danh sách các trường đã thay đổi
        alert("Đã lưu thay đổi thành công!");
      } else {
        alert(`Lỗi: ${data.error || "Không thể lưu thay đổi"}`);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Đã xảy ra lỗi khi lưu thay đổi!");
    }
  };

  // Xử lý khi nhấn nút hủy
  const handleCancel = () => {
    setRules({ ...originalRules });
    setChangedFields({}); // Xóa danh sách các trường đã thay đổi
  };

  // Kiểm tra xem có thay đổi nào chưa
  const hasChanges = Object.keys(changedFields).length > 0;

  return (
    <div className="rules-settings">
      <h2 className="rules-title">THAY ĐỔI QUY ĐỊNH</h2>
      <div className="rules-description">
        Điều chỉnh các quy định áp dụng cho cửa hàng
      </div>

      <div className="rules-container">
        <div className="rules-group">
          <div className="rule-item">
            <div className="rule-icon">
              <FontAwesomeIcon icon={faBoxOpen} />
            </div>
            <div className="rule-content">
              <label htmlFor="minImportQuantity" className="rule-label">
                Số lượng nhập tối thiểu
                <span className="rule-hint">(Mỗi lần nhập hàng)</span>
              </label>
              <div className="rule-input-group">
                <input
                  id="minImportQuantity"
                  type="number"
                  min="0"
                  value={rules.minImportQuantity}
                  onChange={(e) => handleChange("minImportQuantity", e.target.value)}
                  className={changedFields.minImportQuantity ? "changed" : ""}
                />
                <span className="input-suffix">sách</span>
              </div>
              <div className="rule-description">
                Quy định số lượng sách ít nhất phải nhập trong mỗi lần nhập hàng
              </div>
            </div>
          </div>

          <div className="rule-item">
            <div className="rule-icon">
              <FontAwesomeIcon icon={faClipboardList} />
            </div>
            <div className="rule-content">
              <label htmlFor="minStockBeforeImport" className="rule-label">
                Lượng tồn tối thiểu trước khi nhập
                <span className="rule-hint">(Để được phép nhập)</span>
              </label>
              <div className="rule-input-group">
                <input
                  id="minStockBeforeImport"
                  type="number"
                  min="0"
                  value={rules.minStockBeforeImport}
                  onChange={(e) => handleChange("minStockBeforeImport", e.target.value)}
                  className={changedFields.minStockBeforeImport ? "changed" : ""}
                />
                <span className="input-suffix">sách</span>
              </div>
              <div className="rule-description">
                Chỉ cho phép nhập sách khi tổng số lượng sách trong kho thấp hơn giá trị này
              </div>
            </div>
          </div>

          <div className="rule-item">
            <div className="rule-icon">
              <FontAwesomeIcon icon={faShoppingBasket} />
            </div>
            <div className="rule-content">
              <label htmlFor="minStockAfterSale" className="rule-label">
                Lượng tồn tối thiểu sau khi bán
                <span className="rule-hint">(Sách còn lại sau khi bán)</span>
              </label>
              <div className="rule-input-group">
                <input
                  id="minStockAfterSale"
                  type="number"
                  min="0"
                  value={rules.minStockAfterSale}
                  onChange={(e) => handleChange("minStockAfterSale", e.target.value)}
                  className={changedFields.minStockAfterSale ? "changed" : ""}
                />
                <span className="input-suffix">sách</span>
              </div>
              <div className="rule-description">
                Số lượng sách tối thiểu còn lại sau khi bán của mỗi đầu sách
              </div>
            </div>
          </div>

          <div className="rule-item">
            <div className="rule-icon">
              <FontAwesomeIcon icon={faPercent} />
            </div>
            <div className="rule-content">
              <label htmlFor="maxPromotionDuration" className="rule-label">
                Thời gian áp dụng khuyến mãi tối đa
                <span className="rule-hint">(Thời lượng tối đa cho một khuyến mãi)</span>
              </label>
              <div className="rule-input-group">
                <input
                  id="maxPromotionDuration"
                  type="number"
                  min="1"
                  value={rules.maxPromotionDuration}
                  onChange={(e) => handleChange("maxPromotionDuration", e.target.value)}
                  className={changedFields.maxPromotionDuration ? "changed" : ""}
                />
                <span className="input-suffix">ngày</span>
              </div>
              <div className="rule-description">
                Thời gian tối đa cho phép áp dụng một chương trình khuyến mãi
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rules-actions">
        <button
          className="cancel-button"
          onClick={handleCancel}
          disabled={!hasChanges}
        >
          <FontAwesomeIcon icon={faUndo} />
          Khôi phục mặc định
        </button>
        <button
          className="save-button"
          onClick={handleSave}
          disabled={!hasChanges}
        >
          <FontAwesomeIcon icon={faSave} />
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default RulesSettings;
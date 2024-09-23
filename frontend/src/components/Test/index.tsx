import React, { useState } from "react";

// Định nghĩa kiểu dữ liệu
interface ProductDetails {
  kg: string[];
  brand: string[];
}

interface SubCategory {
  [subCategory: string]: ProductDetails;
}

interface MenuData {
  [category: string]: SubCategory;
}

const Menu: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [details, setDetails] = useState<ProductDetails | null>(null);

  // Dữ liệu menu
  const data: MenuData = {
    "Thịt": {
      "Thịt bò": {
        kg: ["1kg", "2kg", "5kg"],
        brand: ["Thương hiệu A", "Thương hiệu B"]
      },
      "Thịt gà": {
        kg: ["1kg", "2kg"],
        brand: ["Thương hiệu C", "Thương hiệu D"]
      }
    },
    "Rau củ": {
      "Cà rốt": {
        kg: ["500g", "1kg"],
        brand: ["Thương hiệu X", "Thương hiệu Y"]
      },
      "Bí đỏ": {
        kg: ["1kg", "2kg"],
        brand: ["Thương hiệu Z", "Thương hiệu W"]
      }
    },
    "Hải sản": {
      "Tôm": {
        kg: ["1kg", "2kg"],
        brand: ["Thương hiệu S", "Thương hiệu T"]
      },
      "Cá": {
        kg: ["500g", "1kg"],
        brand: ["Thương hiệu M", "Thương hiệu N"]
      }
    }
  };

  // Hàm chọn danh mục chính (Cấp 1)
  const handleCategorySelect = (category: string) => {
    if (category === selectedCategory) {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setDetails(null);
    } else {
      setSelectedCategory(category);
      setSelectedSubCategory(null);
      setDetails(null);
    }
  };

  // Hàm chọn loại sản phẩm (Cấp 2)
  const handleSubCategorySelect = (subCategory: string) => {
    if (selectedCategory) {
      if (subCategory === selectedSubCategory) {
        setSelectedSubCategory(null);
        setDetails(null);
      } else {
        setSelectedSubCategory(subCategory);
        setDetails(data[selectedCategory][subCategory]);
      }
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Menu Cấp 1 - Chọn danh mục chính */}
      <h2>Danh mục chính:</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {Object.keys(data).map((category) => (
          <li
            key={category}
            onClick={() => handleCategorySelect(category)}
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor: selectedCategory === category ? "#f0f0f0" : "white"
            }}
          >
            {category}
          </li>
        ))}
      </ul>

      {/* Menu Cấp 2 - Hiển thị các loại sản phẩm */}
      {selectedCategory && (
        <>
          <h2>Loại {selectedCategory}:</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {Object.keys(data[selectedCategory]).map((subCategory) => (
              <li
                key={subCategory}
                onClick={() => handleSubCategorySelect(subCategory)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedSubCategory === subCategory ? "#f0f0f0" : "white"
                }}
              >
                {subCategory}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Menu Cấp 3 - Hiển thị chi tiết phân loại */}
      {selectedSubCategory && details && (
        <>
          <h2>Chi tiết {selectedSubCategory}:</h2>
          <div>
            <strong>Khối lượng:</strong>
            <ul>
              {details.kg.map((kg) => (
                <li key={kg}>{kg}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Thương hiệu:</strong>
            <ul>
              {details.brand.map((brand) => (
                <li key={brand}>{brand}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Menu;
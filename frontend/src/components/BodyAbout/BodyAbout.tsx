/* eslint-disable @next/next/no-img-element */

import React from "react";

const Body_AboutUs = () => {
    return (
        <div className="max-w-7xl mx-auto p-6">
            <header className="text-left mb-12">
                <h1 className="text-yellow-500 text-4xl font-bold mb-4">Haven Food</h1>
                <h2 className="text-2xl font-bold">CỬA HÀNG THỰC PHẨM HAVEN</h2>
            </header>

            <section className="mb-8">
                <p className="text-lg leading-relaxed text-gray-700">
                    Chào mừng bạn đến với Cửa hàng Thực Phẩm Haven,
                    địa chỉ tin cậy dành cho những ai yêu thích sự chất lượng và sự an toàn trong từng sản phẩm.
                    Với sứ mệnh mang đến nguồn thực phẩm nhập khẩu đông lạnh cao cấp,
                    Haven tự hào là một trong những thương hiệu hàng đầu trong việc cung cấp thực phẩm sạch,
                    an toàn và đạt tiêu chuẩn quốc tế.

                    Chỉ thông qua kênh trực tuyến, Haven cam kết mang lại sự tiện lợi tối đa,
                    giúp khách hàng dễ dàng tiếp cận với các dòng sản phẩm thực phẩm nhập khẩu đa dạng, từ thịt bò, thịt gà,
                    hải sản đến các nguyên liệu chế biến cao cấp. Tất cả sản phẩm đều được chọn lọc kỹ lưỡng,
                    đảm bảo đáp ứng những tiêu chuẩn khắt khe nhất về chất lượng và an toàn thực phẩm.
                </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="rounded overflow-hidden shadow-sm mb-20">
                    <img src="https://www.elle.vn/wp-content/uploads/2021/07/23/443827/loi-ich-tinh-than-cua-nau-an-1024x576.jpg" alt="" className="w-full h-full " />
                </div>
                <div className="rounded overflow-hidden shadow-sm mt-20">
                    <img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSrCdiCbREakk8wflNlQ34FD7z0rTPbcd5XajlEdLyVA74Dc3c2" alt="" className="w-full h-full " />
                </div>
            </section>

            <section className="mb-8">
                <p className="text-lg leading-relaxed text-gray-700">
                    Haven không chỉ là một cửa hàng thực phẩm trực tuyến, mà còn là người bạn đồng hành đáng tin cậy trên hành trình nâng cao chất lượng bữa ăn và sức khỏe cho bạn cùng gia đình. 
                    
                </p>

                <p className="text-lg leading-relaxed text-gray-700 mt-4">
                Tại Cửa hàng Thực Phẩm Haven, sự hài lòng và sức khỏe của khách hàng luôn là ưu tiên hàng đầu. Để đạt được điều đó,
Haven không ngừng cải tiến, mở rộng danh mục sản phẩm và nâng cao chất lượng dịch vụ nhằm đáp ứng nhu cầu ngày càng đa dạng của khách hàng. 
                </p>
            </section>
            <section
                className="relative w-full h-64 bg-cover bg-center flex items-center justify-center"
                style={{
                    backgroundImage:
                        "url('https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSrCdiCbREakk8wflNlQ34FD7z0rTPbcd5XajlEdLyVA74Dc3c2')", // Replace with the actual background image URL
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative z-10 text-center text-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">HOÀN THIỆN BỮA ĂN CỦA NGƯỜI VIỆT</h1>
                    <p className="text-sm md:text-base font-medium">Haven Food</p>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-16">CÂU CHUYỆN DOANH NGHIỆP</h2>
                <p className="text-lg leading-relaxed text-gray-700 mb-8">
                    Một vị doanh nhân đi khắp thế giới. Trên chặng đường và bước chân thỏa sức khám phá, anh nhận ra nhiều điều mới lạ của từng quốc gia,
                    dân tộc, của các nền văn hóa khác biệt cũng như đặc trưng ẩm thực ở từng địa phương. Trong đó,
                    anh đặc biệt được thưởng thức và thẫm thấu tinh thần xây dựng giá trị của món ăn, tinh hoa của ẩm thực.
                    Tất cả vị ngon và sự quyến rũ của món ăn, nếu không kể đến công phu tay nghề của người đầu bếp,
                    phần nhiều được gói gọn trong độ tinh khiết, tươi ngon ở bản thân nguyên liệu chế biến. Thịt càng tươi, ăn càng ngon,
                    chiên xào nấu nướng món nào cũng ngon. Thịt sạch, nếm vào cảm nhận độ ngon ngọt không thể tả. Thịt nguyên liệu dùng ở các nước bạn, là thịt sạch,
                    được lấy từ những nông trại sạch áp dụng quy trình quản lý chuyên nghiệp, tiêu chuẩn sản xuất nghiêm ngặt,
                    dùng khoa học kỹ thuật tiên tiến của quốc tế để can thiệp từ khâu nuôi gia súc, chăm sóc vật nuôi đến khâu sản xuất và bảo quản,
                    đảm bảo an toàn chất lượng tối ưu từ trang trại đến khi dọn lên bàn ăn. Ở những nơi đã đi qua,
                    trải nghiệm của mỗi vùng miền đem đến những cách thưởng thức rất riêng và khác biệt cho vị doanh nhân.
Nếu như ở Việt Nam, anh đã quen thuộc các món cơm nhà vốn hay được kho, rim, chiên, xào với nhiều gia vị,
                    cách nấu truyền thống này đôi khi lấn át hương vị nguyên bản của nguyên liệu chính, khiến anh khó phân biệt và cảm nhận độ tươi ngon ngọt thịt.
                    Trái lại, ở nước ngoài, phong cách nấu ăn với phương châm vì sức khỏe đã biến người đầu bếp trở nên khắt khe hơn, bằng cách gia giảm bột ngọt và đường,
                    hạn chế muối cũng như dầu ăn, anh biết rõ các gia vị này đã không còn đóng vai trò then chốt tạo nên hương vị món ăn nữa, mà chính là độ thơm ngon,
                    tươi sạch của thịt mới quyết định cho sự thành công và hương vị đặc trưng của từng món ăn.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-12 mt-20">
                    {/* Left Column: Text */}
                    <div>
                        <p className="text-lg leading-relaxed text-gray-700 mb-4">
                            Với tâm huyết muốn đem những tinh túy ẩm thực này về Việt Nam, làm sinh động hơn các giá trị ẩm thực truyền thống mang tâm hồn Việt,
                            và tạo điều kiện cho người dân Việt Nam có cơ hội hòa nhập thế giới,
                            tận hưởng nguồn thịt sạch thơm ngon một cách yên tâm, thoải mái, không lo về chi phí, vị doanh nhân đã ấp ủ giấc mơ trong nhiều năm.
                        </p>
                    </div>

                    {/* Right Column: Two Stacked Images */}
                    <div className="flex gap-6">
                        <div className="rounded-lg overflow-hidden shadow-md w-1/2">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTouGIMf2PcC9j1-0BNN0qCNcS4F20nnOgHdcEJmsZtid4JRJbl"
                                alt="Food Display 1"
                                className="w-full h-96 object-cover"
                            />
                        </div>
                        <div className="rounded-lg overflow-hidden shadow-md w-1/2">
                            <img
                                src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTvheklFZLOMgK6YBJa1R4NUbwlBhC4n1FwbujIToxZ7yvtu4B_"
                                alt="Food Display 2"
                                className="w-full h-96 object-cover"
                            />
                        </div>
                    </div>

                </div>

            </section>
        </div>
    );
};

export default Body_AboutUs;
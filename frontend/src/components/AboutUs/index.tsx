'use client'
function AboutUS() {
    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <section className="text-left">
                    <h1 className="text-5xl font-bold text-yellow-600">Vietinter Food</h1>
                    <h2 className="text-3xl font-semibold mt-4">
                        CÔNG TY TNHH PHÁT TRIỂN VIỆT QUỐC TẾ
                    </h2>
                    <p className="mt-6 text-lg">
                        Công Ty TNHH Phát Triển Việt Quốc Tế chính thức thành lập vào ngày29 tháng 10 năm 2014. <br />
                        Khởi điểm ban đầu là một văn phòng, bao gồm 10 nhân sự, vốn điều lệ 1 tỷ đồng, vật chất còn hạn chế. Nhưng chỉ sau 5 năm, Công Ty TNHH Phát Triển Việt Quốc Tế đã hoàn toàn thay
                        đổi diện mạo và năng lực trên thị trường trong nước và quốc tế với những nổ lực không ngừng của tập thể nhân viên công ty tâm huyết
                        của Ban Lãnh Đạo, đi cùng triết lý kinh doanh "Đặt uy tín, chất lượng lên hàng đầu", ngày nay Công Ty Việt Quốc Tế đã trở thành một
                        tronbg những tập đoàn uy tín nhất trong lĩnh vực chuyên cung cấp Thực Phẩm Nhập Khẩu Đông Lạnh, Nhập Khẩu Thực Phẩm Đông Lạnh và Phân Phối
                        tại Việt Nam. Công ty đã cho ra đời nhiều dòng sản phẩm châst lượng và những thương hiệu nổi tiếng và giá trị trong suốt nhiều năm kinh doanh,
                        kể cả mảng bán sĩ hay bán lẽ, giúp Công Ty ngày càng khẳng định vị thế và niềm tin đối với các khách hàng gần xa.
                    </p>
                </section>

                {/* Section Hình Ảnh */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    {/* Hình ảnh trái */}
                    <div className="flex justify-start items-start"> {/* Chuyển justify-center thành justify-start */}
                        <img src="/images/aboutusbt.jpg" alt="Thực phẩm" width={500} height={400} className="rounded-lg" />
                    </div>
                    {/* Hình ảnh phải */}
                    <div className="flex justify-start items-start mt-10"> {/* Chuyển justify-center thành justify-start */}
                        <img src="/images/aboutusbp.jpg" alt="Thực phẩm" width={500} height={300} className="rounded-lg" />
                    </div>
                </section>
                <section className="text-left">
                    <p className="mt-6 text-lg">
                        Đến nay, Việt Quốc Tế có hơn 100 nhân viên cả vốn điều lệ là 137.5 tỷ đồng. Tổng số lượng nhập khẩu trên 350 containber/
                        tháng. Đặc biệt, Công Ty đã mở được các kho lạnh riêng trong nội thành Thành Phố Hồ Chí Minh.    <br />
                        Mạng lưới hoạt động "đa dạng mặt hàng" của Việt Quốc Tế trải dài từ Bắc tới Nam. <br />
                        Với sự thay đổi không ngừng của thị trường, người tiêu dùng - khách hàng lâu dài của chúng tôi, một mặt co nhiều lựa chọn hơn về bữa
                        ăn hàng ngày, mặt khác họ cũng đang đứng trước thử thách chưa từng có trước đây về bài toán thực phẩm sạch, an toàn dinh dưỡng và mức
                        chi phí hợp lí cho gia đình. <br />
                        Để phục vụ tốt hơn nhu cầu của triệu gia đình Việt Nam, Công Ty Việt Quốc Tế với tầm nhìn và sứ mệnh "Hoàn thiện bữa ăn của
                        Người Việt", với quyết tâm của Ban Lãnh Đạo và tuổi trẻ đầy nhiệt huyết của tập thể nhân viên, luôn đi đầu trong những thay đổi để tạo kiến tạo
                        nên bề dày giá trị tốt hơn cho người tiêu dùng.

                    </p>
                </section>
                <section
                    className="bg-cover bg-center py-5 mt-10"
                    style={{ backgroundImage: "url('/images/aboutusbp.jpg')" }}
                >
                    <div className="text-center bg-opacity-50 py-12">
                        <h1 className="text-4xl font-bold text-white">
                            HOÀN THIỆN BỮA ĂN CỦA NGƯỜI VIỆT
                        </h1>
                        <p className="text-xl text-gray-300 mt-4">Vietinter Food</p>
                    </div>
                </section>
                <section className="text-left">
                    <h2 className="text-3xl font-semibold mt-20 ">
                        CÂU CHUYỆN DOANH NGHIỆP
                    </h2>
                    <p className="mt-6 text-lg">
                        Đến nay, Việt Quốc Tế có hơn 100 nhân viên cả vốn điều lệ là 137.5 tỷ đồng. Tổng số lượng nhập khẩu trên 350 containber/
                        Một vị doanh nhân đi khắp thế giới. Trên chặng đường và bước chân thỏa sức khám phá, anh nhận ra nhiều điều mới lạ của từng quốc gia, dân tộc, 
                        của các nền văn hóa khác biệt cũng như đặc trưng ẩm thực ở từng địa phương. Trong đó, anh đặc biệt được thưởng thức và thẫm thấu tinh thần xây 
                        dựng giá trị của món ăn, tinh hoa của ẩm thực. Tất cả vị ngon và sự quyến rũ của món ăn, nếu không kể đến công phu tay nghề của người đầu bếp, 
                        phần nhiều được gói gọn trong độ tinh khiết, tươi ngon ở bản thân nguyên liệu chế biến. Thịt càng tươi, ăn càng ngon, chiên xào nấu nướng món 
                        nào cũng ngon. Thịt sạch, nếm vào cảm nhận độ ngon ngọt không thể tả. Thịt nguyên liệu dùng ở các nước bạn, là thịt sạch, được lấy từ những nông
                        trại sạch áp dụng quy trình quản lý chuyên nghiệp, tiêu chuẩn sản xuất nghiêm ngặt, dùng khoa học kỹ thuật tiên tiến của quốc tế để can thiệp từ 
                        khâu nuôi gia súc, chăm sóc vật nuôi đến khâu sản xuất và bảo quản, đảm bảo an toàn chất lượng tối ưu từ trang trại đến khi dọn lên bàn ăn. Ở những 
                        nơi đã đi qua, trải nghiệm của mỗi vùng miền đem đến những cách thưởng thức rất riêng và khác biệt cho vị doanh nhân. Nếu như ở Việt Nam, anh đã quen 
                        thuộc các món cơm nhà vốn hay được kho, rim, chiên, xào với nhiều gia vị, cách nấu truyền thống này đôi khi lấn át hương vị nguyên bản của nguyên liệu chính, 
                        khiến anh khó phân biệt và cảm nhận độ tươi ngon ngọt thịt. Trái lại, ở nước ngoài, phong cách nấu ăn với phương châm vì sức khỏe đã biến người đầu bếp 
                        trở nên khắt khe hơn, bằng cách gia giảm bột ngọt và đường, hạn chế muối cũng như dầu ăn, anh biết rõ các gia vị này đã không còn đóng vai trò then chốt tạo 
                        nên hương vị món ăn nữa, mà chính là độ thơm ngon, tươi sạch của thịt mới quyết định cho sự thành công và hương vị đặc trưng của từng món ăn.

                    </p>
                </section>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                    {/* Text on the left */}
                    <div className="flex justify-center items-center">
                        <p className="text-lg leading-relaxed">
                        Với tâm huyết muốn đem những tinh túy ẩm thực này về Việt Nam, làm sinh động hơn các giá trị ẩm thực truyền thống mang tâm hồn Việt, 
                        và tạo điều kiện cho người dân Việt Nam có cơ hội hòa nhập thế giới, tận hưởng nguồn thịt sạch thơm ngon một cách yên tâm, thoải mái, k
                        hông lo về chi phí, vị doanh nhân đã ấp ủ giấc mơ trong nhiều năm.
                        </p>
                    </div>
                    
                    {/* Images on the right */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <img
                            src="/images/aboutus1.jpg"
                            alt="Thực phẩm 1"
                            className="w-full h-96   object-cover rounded-lg"
                        />
                        <img
                            src="/images/aboutus2.jpg"
                            alt="Thực phẩm 2"
                            className="w-full h-96 object-cover rounded-lg"
                        />
                    </div>
                </section>

            </div>
        </div>

    )
}
export default AboutUS;

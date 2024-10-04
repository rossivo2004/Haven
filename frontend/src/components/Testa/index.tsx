import Image from "next/image";

function Testa() {
    return (
        <section className="">
            <div className="max-w-screen-xl mx-auto lg:px-0 px-4">
                <div className="flex lg:flex-row flex-col gap-10 lg:p-[100px] p-5 bg-gradient-to-br from-[#c3ccef] to-[#ebf0ef] rounded-[20px] mb-20">
                    <div className="flex-1">
                        <Image width={520} height={520} loading="lazy" src="https://s3-alpha-sig.figma.com/img/da35/6c5e/421cb9ccd94fbba8b5d10f861b2205be?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=JXgdlJZjbFh-NvVtO7UNA-Q-U-s962La4Wt7CKdAf3eR-knaPUQCTZFHdZBkWdEWL~7wSUODIV2nQu0Fl2LpYHPkPGGlWysUdygAezb96kWxkoN6unS9Jf42kYEiJy60yZNLfmPYQ2T5wbIrDs3paRqEJ8jxUB2VYp8MjQbdgnhBLqpw4rZE~KjRCM8aL7rTkd3c1rZjwMO3cdlyNvlL0zhMfSgRa6eWAJ11zadcYhZP-4BpS9Uih5Gib7KnltMmomT-kcZirkca03C969b41Mh-IWmwxu1yKRfmJpvfj3DEvs-s~38qMoMUD3~R5J1fmwtzibANI9Sb6ozOZHjMJQ__" alt="" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="text-sm font-medium text-[#00A76A]">Our Responsibility</div>
                        <div className="font-bold lg:text-[42px] text-[28px] mb-5">Tầm Nhìn và Sứ Mệnh</div>
                        <div className="font-normal lg:text-lg text-base mb-4">Khách hàng là trọng tâm: Lắng nghe, thấu hiểu và đáp ứng mọi nhu cầu của khách hàng.</div>
                        <div className="flex gap-7 mb-4">
                            <div>
                                <div className="lg:h-14 h-8 lg:w-14 w-8 rounded-full flex items-center justify-center bg-[#3F5AFF]">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
                                        <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none"><g transform="scale(8.53333,8.53333)"><path d="M26.98047,5.99023c-0.2598,0.00774 -0.50638,0.11632 -0.6875,0.30273l-15.29297,15.29297l-6.29297,-6.29297c-0.25082,-0.26124 -0.62327,-0.36647 -0.97371,-0.27511c-0.35044,0.09136 -0.62411,0.36503 -0.71547,0.71547c-0.09136,0.35044 0.01388,0.72289 0.27511,0.97371l7,7c0.39053,0.39037 1.02353,0.39037 1.41406,0l16,-16c0.29576,-0.28749 0.38469,-0.72707 0.22393,-1.10691c-0.16075,-0.37985 -0.53821,-0.62204 -0.9505,-0.60988z"></path></g></g>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <div className="font-bold lg:text-2xl text-base text-[#3F5AFF] lg:h-14 h-8 flex items-center">Tầm Nhìn</div>
                                <div className="lg:text-base text-sm font-normal">Trở thành đối tác chuyển đổi số đa kênh hàng đầu, thúc đẩy sự phát triển của doanh nghiệp Việt Nam trong nền kinh tế số toàn cầu.</div>
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <div>
                                <div className="lg:h-14 h-8 lg:w-14 w-8 rounded-full flex items-center justify-center bg-[#3F5AFF]">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
                                        <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none"><g transform="scale(8.53333,8.53333)"><path d="M26.98047,5.99023c-0.2598,0.00774 -0.50638,0.11632 -0.6875,0.30273l-15.29297,15.29297l-6.29297,-6.29297c-0.25082,-0.26124 -0.62327,-0.36647 -0.97371,-0.27511c-0.35044,0.09136 -0.62411,0.36503 -0.71547,0.71547c-0.09136,0.35044 0.01388,0.72289 0.27511,0.97371l7,7c0.39053,0.39037 1.02353,0.39037 1.41406,0l16,-16c0.29576,-0.28749 0.38469,-0.72707 0.22393,-1.10691c-0.16075,-0.37985 -0.53821,-0.62204 -0.9505,-0.60988z"></path></g></g>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <div className="font-bold lg:text-2xl text-base text-[#3F5AFF] lg:h-14 h-8 flex items-center">Sứ Mệnh</div>
                                <div className="lg:text-base text-sm font-normal">Nâng tầm chuyển đổi số đa kênh cho doanh nghiệp Việt. (Bằng việc cung cấp giải pháp tích hợp, dễ tiếp cận, chúng tôi giúp doanh nghiệp tối ưu hóa hoạt động, tăng năng suất và nâng cao sức cạnh tranh trên thị trường</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gradient-to-br from-[#c3ccef] to-[#ebf0ef] max-w-screen-2xl lg:h-[1000px] mx-auto lg:px-[130px] px-4 lg:py-[80px] py-10 text-center">
                <div className="font-medium text-sm text-[#00A76A] mb-2">Our Services</div>
                <div className="font-bold lg:text-[42px] text-[28px] mb-5">Giải pháp của chúng tôi</div>
                <div className="text-base font-normal mb-10">Tiên Phong CDS cung cấp các giải pháp dựa trên nền tảng công nghệ tiên tiến và linh hoạt, tập trung vào các yếu tố sau</div>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                    <div className="bg-white lg:h-[310px] h-[260px] rounded-[20px] p-4 text-center">
                        <div className="flex items-center justify-center mb-5">
                            <img
                                className="h-20 w-20"
                                src="https://s3-alpha-sig.figma.com/img/7db2/dee8/73d427a127b4fcf8355331a566f74169?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NYfmM~ylJHs65bfXRbZEFy7lcuZG9AHd5geCfiub507abVLm90yzt3nJGuZzaaCQGb0GcNfaaJWxrsrnDlEcuniEA2p8-HLTMUWVnR~tvZ7bpsMT7HVQjCj~9FYfvtNZJLVierNTObcO-xTEGSCWb-PUL8cAIQwIc2uHO76jZRHAuxtk5fi3KfWZIUT15gzAlb~sT~iUJvyVTwGpyJGX31UolGNxcuFzaFG5xHOGzMnQ~3fdI53-cTRMOUQUl~dXjgP--LQTvKUYKNddW8MVxMfjSbtPJyWxQ0Kjr8g3Rfv5J086qo0dfYh1itPiIEKsI2o4D4nWun2IxGWqvckvWw__" alt="" />
                        </div>
                        <div className="font-semibold lg:text-[20px] text-[18px] mb-6">Nền tảng công nghệ linh hoạt và mở</div>
                        <div className="h-[2px] w-full bg-[#EFEFEF] mb-5"></div>
                        <div className="font-normal text-base">
                            Microservices, Container và orchestration, API mở và tài liệu phát triển đầy đủ
                        </div>
                    </div>
                    <div className="bg-white lg:h-[310px] h-[260px] rounded-[20px] p-4 text-center">
                        <div className="flex items-center justify-center mb-5">
                            <img
                                className="h-20 w-20"
                                src="https://s3-alpha-sig.figma.com/img/fa52/b427/765810e16eb963ee48d1e396016e54a6?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=nUDm6v7esHmHGOmJHtXDwkRIWw8eAmER499JzVakWlQwVzgMa7dlOXya9FPVhgbqxet7J9o3ypkctbMpUUt9-Q0NwYK8Fr5NV7PBbuJBzNsCgw08-vFif-e~F~VrdkwRDFNX5jYTFHBZZM3sSafhxb6sOcJ8XuDQyUuAQarr98FoZWbMRdQPFzv67JjNxvR9bBT488XxWyDe~t7gGp19TktPqwqny8LBUL-wijwKmUsNetvySW6mEfzghFqqgD~ChVmJT~pVLXQaQ0wsfz0anVs5s7KFvjYu6Wc6XDZVAonJucaaD2ZKOH6oC9DdTUz8B8DU7lvm5K7WI2l0F5ODvQ__" alt="" />
                        </div>
                        <div className="font-semibold lg:text-[20px] text-[18px] mb-6">Giải pháp chuyên biệt theo ngành</div>
                        <div className="h-[2px] w-full bg-[#EFEFEF] mb-5"></div>
                        <div className="font-normal text-base">
                            Module chuyên sâu, Template và best practices
                        </div>
                    </div>
                    <div className="bg-white lg:h-[310px] h-[260px] rounded-[20px] p-4 text-center">
                        <div className="flex items-center justify-center mb-5">
                            <img
                                className="h-20 w-20"
                                src="https://s3-alpha-sig.figma.com/img/585e/33b4/e44c533e1650a6198c3e3f51ac1d41d1?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RP0vrbupf4I6JSasmlyCJHO4F6bUbQ-RV0SUyN5Yx9EAiuORQc~aJ5~UAUEBMZN2Hw~b8B9T88Za3GYqpkCtfjaiC~waNuKeT2M6az87-RpqnQ6BNI6S-QLh2gwc1yBeTU6SyvjKcU~mqpk4oH6KV3KTQide1WGQ2eEt4aL9B-18bSXKHFxLMqpwPgneH3lRC1jjHNAfZ6-BwVyqknBszGN-CbAom4T8nGpTu3A2gj3Dtqo-a9ghGiKZOB71muNX2iflWDp7-r5JI960jzq8zEwIs6kE9Pt4RXTzy8pOLCC1iOghF5sxFabuhNfZtyI66ZF~PSmHaS7OocqnDKMXKg__" alt="" />
                        </div>
                        <div className="font-semibold lg:text-[20px] text-[18px] mb-6">Trí tuệ nhân tạo và học máy</div>
                        <div className="h-[2px] w-full bg-[#EFEFEF] mb-5"></div>
                        <div className="font-normal text-base">
                            Tích hợp AI, Thuật toán học máy giúp tối ưu hóa hoạt động doanh nghiệp và dự báo xu hướng.
                        </div>
                    </div>
                    <div className="bg-white lg:h-[310px] h-[260px] rounded-[20px] p-4 text-center">
                        <div className="flex items-center justify-center mb-5">
                            <img
                                className="h-20 w-20"
                                src="https://s3-alpha-sig.figma.com/img/5bf1/d210/02b66ed5355eb58fbc81d2db3fd063b7?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FEpbwjk7A9lpyOTVRdMZKA0ppE~m4ICwpZfg9O7eQx-NhGOtqiWyIU9Km~KIByiSO-biY-vo0LKpnFFlFRXzU9mywIdn~h1aFet4wjvdMwiRF82UCYX26WtoHVmR~zxSb4~4taZ~DHzzvZsZMq-QAvc-UbsqaQvspASWZ-JJ~hJq7K4sdkmg-BNwRzaChIUztLMxAdiB169yaeqJzxu7ioCbFcZALCtJHfIxs0VX1AWzI8LP9EB9koIfSlkAm6x2OyLihlicKanF3tegX2nxBT2VXDU1iaTWOq5pgwoi7m9KmkVZMd1TOTL~6rgECyDpyg8F~kiBq8G243Ae8RWfig__" alt="" />
                        </div>
                        <div className="font-semibold lg:text-[20px] text-[18px] mb-6">Bảo mật và tuân thủ</div>
                        <div className="h-[2px] w-full bg-[#EFEFEF] mb-5"></div>
                        <div className="font-normal text-base">
                            Áp dụng các tiêu chuẩn bảo mật cao nhất, Hệ thống tuân thủ tự động với các quy định pháp lý
                        </div>
                    </div>
                    <div className="bg-white lg:h-[310px] h-[260px] rounded-[20px] p-4 text-center">
                        <div className="flex items-center justify-center mb-5">
                            <img
                                className="h-20 w-20"
                                src="https://s3-alpha-sig.figma.com/img/afdd/18da/c617fff558001705b02969614e4d0989?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MfLaeucDYdTSvu5sGQTFWwDpqwPQAfX17u5W2g8y63wFuivKXq~tPLNoyCvzaaymJEJrpe9K8kDvPL2oMsqPlq8S16voPoEnwJqKdwPxvZQG5OKhA-l-rpQFQAr3rdnnXa5INxfV0OVS3gc~UrZemtTkxheGz4Anq26XTynTHkYnAcoRa10R1qFMwawvsRetKywtSBXTbXDQdbuF4fHL1DUq7zBtisFhGS7of6woFKfdEJftAX0oI2SLFPa3K9J8Cvhr3rgM6Sewb46cQcK0B2D8h0WrxbicDsTK6lXT~8fC41pF~ote46EKqHZo362EEpQcRO5vdk7MsKJShWroFQ__" alt="" />
                        </div>
                        <div className="font-semibold lg:text-[20px] text-[18px] mb-6">Hệ sinh thái đối tác</div>
                        <div className="h-[2px] w-full bg-[#EFEFEF] mb-5"></div>
                        <div className="font-normal text-base">
                            Mở rộng mạng lưới đối tác, Cơ chế chia sẻ lợi ích công bằng, thu hút và giữ chân đối tác chất lượng
                        </div>
                    </div>
                    <div className="bg-white lg:h-[310px] h-[260px] rounded-[20px] p-4 text-center">
                        <div className="flex items-center justify-center mb-5">
                            <img
                                className="h-20 w-20"
                                src="https://s3-alpha-sig.figma.com/img/8b58/a15a/6f8c9198d5c5dfdf814c217f3402358b?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gECeZdCLU-ZsXSNYyKiSeLx7fAeBdpNBtxrc2NX2u0AIsvrkdbmnEhnW3N27B1oG3LrwQVmaQ2AW7v0Z9CnrRkUuD18HyUCDrdowJ5TndbMDYKq8GiFMePiuJwqZiwZGfKeDvW04yHhwL1SVFhTOLorGtGvUpOHgwxw-ZuJar0t4sfLSSgcNsovSnjpjsEJ~m0YsrIrtwozj5QLVHddcyBfJgGh0jcQ-2fEbcV4Y-fo3mQt3~TSBPTPKOQg8LSmZGi2T~e664waUleZdvt-e5LcQvkrd3ZIn5BBt0dbZbIGS2V4GnAtNogOErHaTZiY6OKUxcus4dr8rLlj4FHroRQ__" alt="" />
                        </div>
                        <div className="font-semibold lg:text-[20px] text-[18px] mb-6">Tăng trưởng kinh doanh</div>
                        <div className="h-[2px] w-full bg-[#EFEFEF] mb-5"></div>
                        <div className="font-normal text-base">
                            Tối ưu hóa quy trình, cải thiện trải nghiệm khách hàng và tăng cường cạnh tranh
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Testa;
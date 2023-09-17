Những kĩ thuật mà tôi đã học được và dùng nó trong dự án cá nhân của tôi:
- Authentication: tôi xác thực người dùng bằng cách dùng passport.js (middleware) để xác thực theo nhiều cách như là local, google, facebook, thì passport.js sẽ giúp tôi thực hiện điều đó dễ dàng hơn. Khi đăng nhập bằng local thì tôi sử dụng thêm 'joi' để validate dữ liệu nhập vào, đồng thời khi đã đăng nhập hoặc đăng kí thì tôi dùng bcryptjs để hash password nhằm tăng tính bảo mật. (passport.middleware.js, auth.controllers.js)
- Authorization: khi người dùng đã đăng nhập với đúng tài khoản và mật khẩu của mình thì tôi sẽ encoded ra 1 mã jwt chứa userId và role, sau đó tôi sẽ set cookie cho client là đoạn mã jwt vừa lưu ấy để mỗi khi người dùng truy cập vào những URL paths khác thì server sẽ lấy cái token là mã jwt đó và decoded ra, lấy thằng role để phân quyền theo chức năng (nếu ko đủ quyền truy cập thì sẽ chặn lại), tất nhiên sẽ phải sử dụng https để tăng bảo mật. (checkrole.middleware.js, auth.controller.js)

- Template engine: tôi dùng handlebars để có thể dễ dàng thao tác và xử lí khi truyền data từ controller qua, có hỗ trợ layouts sẵn dễ dàng để config header body footer. (/resources/views)

- Database tôi dùng mongoose để kết nối vào mongodb và thao tác những với database CRUD.
- Hiểu được khái niệm về Restful Api và áp dụng nó vào dự án này
- Xây dựng cấu trúc dự án theo mô hình MVC
- Dùng framework express.js làm server-side để định nghĩa các tuyến đường (routes) và xử lí request response hiệu quả
- Sử dụng SocketIO để phát triển úng dụng thời gian thực (real-time applications), cụ thể là tôi tạo ra room chatbox để những user có thể chat trực tiếp với nhau. (socket.io.js)